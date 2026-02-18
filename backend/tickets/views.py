"""
API Views for Support Ticket System

Provides REST API endpoints for:
- CRUD operations on tickets
- Filtering and searching tickets
- Statistics and aggregated metrics
- LLM-based ticket classification
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Q, Count, Avg
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
import logging

from .models import Ticket
from .serializers import (
    TicketSerializer,
    TicketClassificationRequestSerializer,
    TicketClassificationResponseSerializer,
    TicketStatsSerializer
)
from .llm_service import get_llm_service

logger = logging.getLogger(__name__)


class TicketViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Ticket CRUD operations
    
    Supports:
    - List all tickets (GET /api/tickets/)
    - Create a ticket (POST /api/tickets/)
    - Retrieve a ticket (GET /api/tickets/{id}/)
    - Update a ticket (PATCH /api/tickets/{id}/)
    - Delete a ticket (DELETE /api/tickets/{id}/)
    
    Filtering:
    - ?category=billing
    - ?priority=high
    - ?status=open
    - ?search=keyword (searches in title and description)
    - Multiple filters can be combined
    """
    
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    
    def get_queryset(self):
        """
        Filter tickets based on query parameters
        """
        queryset = Ticket.objects.all()
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Filter by status
        ticket_status = self.request.query_params.get('status')
        if ticket_status:
            queryset = queryset.filter(status=ticket_status)
        
        # Search in title and description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """
        Create a new ticket
        
        Returns 201 Created on success
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=False, methods=['get'], url_path='stats')
    def statistics(self, request):
        """
        Get aggregated ticket statistics
        
        Returns:
        - total_tickets: Total number of tickets
        - open_tickets: Number of tickets with status='open'
        - avg_tickets_per_day: Average tickets created per day
        - priority_breakdown: Count of tickets by priority
        - category_breakdown: Count of tickets by category
        
        All aggregations are done at the database level using Django ORM
        """
        
        # Total tickets
        total_tickets = Ticket.objects.count()
        
        # Open tickets
        open_tickets = Ticket.objects.filter(status='open').count()
        
        # Average tickets per day
        # Calculate based on date range from first ticket to now
        if total_tickets > 0:
            first_ticket = Ticket.objects.order_by('created_at').first()
            days_since_first = (timezone.now() - first_ticket.created_at).days + 1
            avg_tickets_per_day = round(total_tickets / days_since_first, 1)
        else:
            avg_tickets_per_day = 0.0
        
        # Priority breakdown - database-level aggregation
        priority_breakdown = {}
        priority_counts = Ticket.objects.values('priority').annotate(
            count=Count('id')
        )
        
        # Initialize all priorities with 0
        for priority, _ in Ticket.PRIORITY_CHOICES:
            priority_breakdown[priority] = 0
        
        # Fill in actual counts
        for item in priority_counts:
            priority_breakdown[item['priority']] = item['count']
        
        # Category breakdown - database-level aggregation
        category_breakdown = {}
        category_counts = Ticket.objects.values('category').annotate(
            count=Count('id')
        )
        
        # Initialize all categories with 0
        for category, _ in Ticket.CATEGORY_CHOICES:
            category_breakdown[category] = 0
        
        # Fill in actual counts
        for item in category_counts:
            category_breakdown[item['category']] = item['count']
        
        stats_data = {
            'total_tickets': total_tickets,
            'open_tickets': open_tickets,
            'avg_tickets_per_day': avg_tickets_per_day,
            'priority_breakdown': priority_breakdown,
            'category_breakdown': category_breakdown,
        }
        
        serializer = TicketStatsSerializer(stats_data)
        return Response(serializer.data)


@api_view(['POST'])
def classify_ticket(request):
    """
    LLM-based ticket classification endpoint
    
    POST /api/tickets/classify/
    
    Request body:
    {
        "description": "I can't access my account after password reset"
    }
    
    Response:
    {
        "suggested_category": "account",
        "suggested_priority": "medium"
    }
    
    This endpoint uses an LLM (OpenAI, Anthropic, etc.) to analyze the
    ticket description and suggest appropriate category and priority.
    
    Error handling:
    - If LLM is unavailable, falls back to keyword-based classification
    - If request is invalid, returns 400 Bad Request
    - If classification fails completely, returns 500 Internal Server Error
    """
    
    # Validate request
    request_serializer = TicketClassificationRequestSerializer(data=request.data)
    if not request_serializer.is_valid():
        return Response(
            request_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    description = request_serializer.validated_data['description']
    
    try:
        # Get LLM service and classify
        llm_service = get_llm_service()
        category, priority = llm_service.classify_ticket(description)
        
        # Prepare response
        response_data = {
            'suggested_category': category,
            'suggested_priority': priority,
        }
        
        response_serializer = TicketClassificationResponseSerializer(response_data)
        return Response(response_serializer.data)
        
    except Exception as e:
        logger.error(f"Classification failed: {str(e)}")
        return Response(
            {'error': 'Classification failed', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

"""
URL configuration for tickets app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, classify_ticket

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')

urlpatterns = [
    path('tickets/classify/', classify_ticket, name='ticket-classify'),
    path('', include(router.urls)),
]

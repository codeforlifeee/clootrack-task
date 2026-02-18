from django.db import models


class Ticket(models.Model):
    """
    Support Ticket Model
    
    Represents a customer support ticket with auto-suggested category and priority
    based on LLM analysis of the description.
    """
    
    # Categories - auto-suggested by LLM, user can override
    CATEGORY_CHOICES = [
        ('billing', 'Billing'),
        ('technical', 'Technical'),
        ('account', 'Account'),
        ('general', 'General'),
    ]
    
    # Priority levels - auto-suggested by LLM, user can override
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    # Status - defaults to open
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    title = models.CharField(
        max_length=200,
        help_text="Brief title of the support ticket"
    )
    
    description = models.TextField(
        help_text="Full description of the problem"
    )
    
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        help_text="Category of the ticket (auto-suggested by LLM)"
    )
    
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        help_text="Priority level (auto-suggested by LLM)"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='open',
        help_text="Current status of the ticket"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when the ticket was created"
    )
    
    class Meta:
        ordering = ['-created_at']  # Newest first
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['category']),
            models.Index(fields=['priority']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"[{self.priority.upper()}] {self.title}"

"""
LLM Service for Ticket Classification

This module provides LLM-powered classification of support tickets.
Supports multiple LLM providers: OpenAI, Anthropic, and Google.

The LLM analyzes the ticket description and suggests:
- Category: billing, technical, account, or general
- Priority: low, medium, high, or critical
"""

import json
import logging
from typing import Dict, Tuple
from django.conf import settings

logger = logging.getLogger(__name__)


# Classification prompt that will be sent to the LLM
CLASSIFICATION_PROMPT = """You are a support ticket classifier. Analyze the following support ticket description and classify it into a category and priority level.

Categories:
- billing: Issues related to payments, invoices, refunds, charges, pricing, subscriptions
- technical: Technical problems, bugs, errors, performance issues, integration problems
- account: Account access, login issues, password resets, profile updates, account settings
- general: General inquiries, feedback, questions that don't fit other categories

Priority Levels:
- low: Minor issues, general questions, feature requests, non-urgent matters
- medium: Standard issues that need attention but aren't blocking critical functionality
- high: Significant problems affecting user experience or important functionality
- critical: System down, data loss, security issues, complete service unavailability, severe bugs affecting many users

Ticket Description:
{description}

Respond ONLY with a valid JSON object in this exact format (no additional text):
{{"category": "one_of_the_categories", "priority": "one_of_the_priorities"}}

Examples:
- "I can't log into my account" -> {{"category": "account", "priority": "medium"}}
- "Your service has been down for 3 hours!" -> {{"category": "technical", "priority": "critical"}}
- "How do I change my billing address?" -> {{"category": "billing", "priority": "low"}}
- "Getting error 500 on checkout page, losing customers" -> {{"category": "technical", "priority": "high"}}
"""


class LLMService:
    """Service class for LLM-based ticket classification"""
    
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.api_key = settings.LLM_API_KEY
    
    def classify_ticket(self, description: str) -> Tuple[str, str]:
        """
        Classify a ticket description into category and priority
        
        Args:
            description: The ticket description text
            
        Returns:
            Tuple of (category, priority)
            
        Raises:
            Exception: If classification fails and no fallback is available
        """
        if not self.api_key:
            logger.warning("LLM API key not configured, using fallback classification")
            return self._fallback_classification(description)
        
        try:
            if self.provider == 'openai':
                return self._classify_with_openai(description)
            elif self.provider == 'anthropic':
                return self._classify_with_anthropic(description)
            else:
                logger.warning(f"Unknown LLM provider: {self.provider}, using fallback")
                return self._fallback_classification(description)
        except Exception as e:
            logger.error(f"LLM classification failed: {str(e)}, using fallback")
            return self._fallback_classification(description)
    
    def _classify_with_openai(self, description: str) -> Tuple[str, str]:
        """Classify using OpenAI API"""
        try:
            from openai import OpenAI
            
            client = OpenAI(api_key=self.api_key)
            prompt = CLASSIFICATION_PROMPT.format(description=description)
            
            response = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a support ticket classifier. Respond only with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=100
            )
            
            content = response.choices[0].message.content.strip()
            return self._parse_llm_response(content)
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise
    
    def _classify_with_anthropic(self, description: str) -> Tuple[str, str]:
        """Classify using Anthropic Claude API"""
        try:
            from anthropic import Anthropic
            
            client = Anthropic(api_key=self.api_key)
            prompt = CLASSIFICATION_PROMPT.format(description=description)
            
            response = client.messages.create(
                model=settings.ANTHROPIC_MODEL,
                max_tokens=100,
                temperature=0.3,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            content = response.content[0].text.strip()
            return self._parse_llm_response(content)
            
        except Exception as e:
            logger.error(f"Anthropic API error: {str(e)}")
            raise
    
    def _parse_llm_response(self, content: str) -> Tuple[str, str]:
        """
        Parse LLM JSON response and validate the category and priority
        
        Args:
            content: The raw response from LLM
            
        Returns:
            Tuple of (category, priority)
            
        Raises:
            ValueError: If response cannot be parsed or contains invalid values
        """
        try:
            # Try to extract JSON from response (in case LLM adds extra text)
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No JSON object found in response")
            
            json_str = content[start_idx:end_idx]
            data = json.loads(json_str)
            
            category = data.get('category', '').lower()
            priority = data.get('priority', '').lower()
            
            # Validate category
            valid_categories = ['billing', 'technical', 'account', 'general']
            if category not in valid_categories:
                raise ValueError(f"Invalid category: {category}")
            
            # Validate priority
            valid_priorities = ['low', 'medium', 'high', 'critical']
            if priority not in valid_priorities:
                raise ValueError(f"Invalid priority: {priority}")
            
            return category, priority
            
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            logger.error(f"Failed to parse LLM response: {content}. Error: {str(e)}")
            raise ValueError(f"Invalid LLM response format: {str(e)}")
    
    def _fallback_classification(self, description: str) -> Tuple[str, str]:
        """
        Simple keyword-based fallback classification when LLM is unavailable
        
        This is a basic safety net to ensure the system continues to function
        even when the LLM API is down or misconfigured.
        """
        description_lower = description.lower()
        
        # Determine category based on keywords
        category = 'general'  # default
        
        billing_keywords = ['payment', 'invoice', 'bill', 'charge', 'refund', 'price', 'subscription', 'credit card']
        technical_keywords = ['error', 'bug', 'crash', 'broken', 'not working', 'failed', 'issue', 'problem']
        account_keywords = ['login', 'password', 'access', 'account', 'sign in', 'authenticate']
        
        for keyword in billing_keywords:
            if keyword in description_lower:
                category = 'billing'
                break
        
        if category == 'general':
            for keyword in technical_keywords:
                if keyword in description_lower:
                    category = 'technical'
                    break
        
        if category == 'general':
            for keyword in account_keywords:
                if keyword in description_lower:
                    category = 'account'
                    break
        
        # Determine priority based on urgency indicators
        priority = 'medium'  # default
        
        critical_keywords = ['down', 'outage', 'critical', 'urgent', 'emergency', 'immediately', 'asap']
        high_keywords = ['important', 'serious', 'blocking', 'can\'t', 'cannot', 'unable']
        low_keywords = ['question', 'how to', 'wondering', 'curious', 'feedback']
        
        for keyword in critical_keywords:
            if keyword in description_lower:
                priority = 'critical'
                break
        
        if priority == 'medium':
            for keyword in high_keywords:
                if keyword in description_lower:
                    priority = 'high'
                    break
        
        if priority == 'medium':
            for keyword in low_keywords:
                if keyword in description_lower:
                    priority = 'low'
                    break
        
        logger.info(f"Fallback classification: category={category}, priority={priority}")
        return category, priority


# Singleton instance
_llm_service = None

def get_llm_service() -> LLMService:
    """Get or create the LLM service singleton"""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service

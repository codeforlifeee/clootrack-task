import React, { useState } from 'react';
import { ticketAPI } from '../api';
import './TicketForm.css';

const TicketForm = ({ onTicketCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });

  const [classifying, setClassifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Classify description when user finishes typing
  const handleDescriptionBlur = async () => {
    if (formData.description.trim().length < 10) return;

    try {
      setClassifying(true);
      const classification = await ticketAPI.classifyTicket(formData.description);
      
      setFormData(prev => ({
        ...prev,
        category: classification.suggested_category,
        priority: classification.suggested_priority,
      }));
    } catch (error) {
      console.error('Classification failed:', error);
    } finally {
      setClassifying(false);
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      const newTicket = await ticketAPI.createTicket(formData);
      
      // Show success message
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'general',
        priority: 'medium',
      });
      
      // Call parent callback
      if (onTicketCreated) {
        onTicketCreated(newTicket);
      }

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to create ticket. Please try again.';
      setErrors({ submit: errorMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ticket-form">
      {success && (
        <div className="success-message">
          <span className="success-icon">✓</span>
          <span>Ticket submitted successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            <span className="label-icon">📌</span>
            Title <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief summary of your issue"
              maxLength={200}
              disabled={submitting}
            />
          </div>
          {errors.title && <div className="error">⚠️ {errors.title}</div>}
          <div className="char-count">{formData.title.length}/200</div>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            <span className="label-icon">📝</span>
            Description <span className="required">*</span>
          </label>
          <div className="input-wrapper">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleDescriptionBlur}
              placeholder="Please describe your issue in detail..."
              rows={6}
              disabled={submitting}
            />
          </div>
          {errors.description && <div className="error">⚠️ {errors.description}</div>}
          {classifying && (
            <div className="classifying-indicator">
              <span className="ai-spinner"></span>
              <span>🤖 AI is analyzing your description...</span>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">
              <span className="label-icon">🏷️</span>
              Category
              {classifying && <span className="auto-label">✨ AI</span>}
            </label>
            <div className="select-wrapper">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="general">📝 General</option>
                <option value="billing">💳 Billing</option>
                <option value="technical">🔧 Technical</option>
                <option value="account">👤 Account</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priority">
              <span className="label-icon">🎯</span>
              Priority
              {classifying && <span className="auto-label">✨ AI</span>}
            </label>
            <div className="select-wrapper">
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="critical">🔴 Critical</option>
              </select>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{errors.submit}</span>
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={submitting || classifying}
        >
          {submitting ? (
            <>
              <span className="button-spinner"></span>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>✉️ Submit Ticket</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;

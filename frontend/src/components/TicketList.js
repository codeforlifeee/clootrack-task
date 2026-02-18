import React, { useState } from 'react';
import './TicketList.css';

const TicketList = ({ tickets, onTicketUpdate }) => {
  const [expandedTicket, setExpandedTicket] = useState(null);

  const toggleExpand = (ticketId) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    if (onTicketUpdate) {
      await onTicketUpdate(ticketId, { status: newStatus });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryBadgeClass = (category) => {
    const classes = {
      billing: 'badge-billing',
      technical: 'badge-technical',
      account: 'badge-account',
      general: 'badge-general',
    };
    return classes[category] || 'badge-general';
  };

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      low: 'badge-low',
      medium: 'badge-medium',
      high: 'badge-high',
      critical: 'badge-critical',
    };
    return classes[priority] || 'badge-medium';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      open: 'badge-status-open',
      in_progress: 'badge-status-progress',
      resolved: 'badge-status-resolved',
      closed: 'badge-status-closed',
    };
    return classes[status] || 'badge-status-open';
  };

  const formatStatusDisplay = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  if (tickets.length === 0) {
    return (
      <div className="no-tickets">
        <div className="empty-icon">🎫</div>
        <h3>No Tickets Found</h3>
        <p>Try adjusting your filters or submit a new ticket to get started.</p>
      </div>
    );
  }

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <div 
          key={ticket.id} 
          className={`ticket-card ${expandedTicket === ticket.id ? 'expanded' : ''}`}
        >
          <div className="ticket-header" onClick={() => toggleExpand(ticket.id)}>
            <div className="ticket-title-section">
              <h3 className="ticket-title">{ticket.title}</h3>
              <div className="ticket-badges">
                <span className={`badge ${getCategoryBadgeClass(ticket.category)}`}>
                  {ticket.category}
                </span>
                <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
                  {formatStatusDisplay(ticket.status)}
                </span>
              </div>
            </div>
            <div className="ticket-meta">
              <span className="ticket-id">#{ticket.id}</span>
              <span className="ticket-date">{formatDate(ticket.created_at)}</span>
              <span className="expand-icon">{expandedTicket === ticket.id ? '▼' : '▶'}</span>
            </div>
          </div>

          {expandedTicket === ticket.id && (
            <div className="ticket-body">
              <div className="ticket-description">
                <strong>Description:</strong>
                <p>{ticket.description}</p>
              </div>

              <div className="ticket-actions">
                <label htmlFor={`status-${ticket.id}`}>Change Status:</label>
                <select
                  id={`status-${ticket.id}`}
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                  className="status-select"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketList;

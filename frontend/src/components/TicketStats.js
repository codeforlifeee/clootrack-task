import React from 'react';
import './TicketStats.css';

const TicketStats = ({ stats }) => {
  if (!stats) return null;

  const {
    total_tickets,
    open_tickets,
    avg_tickets_per_day,
    priority_breakdown,
    category_breakdown
  } = stats;

  return (
    <div className="stats-dashboard">
      <h2>Dashboard Statistics</h2>
      
      <div className="stats-grid">
        {/* Summary Cards */}
        <div className="stat-card highlight">
          <div className="stat-value">{total_tickets}</div>
          <div className="stat-label">Total Tickets</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-value">{open_tickets}</div>
          <div className="stat-label">Open Tickets</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-value">{avg_tickets_per_day}</div>
          <div className="stat-label">Avg Tickets/Day</div>
        </div>
      </div>

      <div className="stats-grid">
        {/* Priority Breakdown */}
        <div className="stat-card breakdown-card">
          <h3>Priority Breakdown</h3>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <span className="breakdown-label">
                <span className="priority-dot critical"></span>
                Critical
              </span>
              <span className="breakdown-value">{priority_breakdown.critical}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">
                <span className="priority-dot high"></span>
                High
              </span>
              <span className="breakdown-value">{priority_breakdown.high}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">
                <span className="priority-dot medium"></span>
                Medium
              </span>
              <span className="breakdown-value">{priority_breakdown.medium}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">
                <span className="priority-dot low"></span>
                Low
              </span>
              <span className="breakdown-value">{priority_breakdown.low}</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="stat-card breakdown-card">
          <h3>Category Breakdown</h3>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <span className="breakdown-label">
                <span className="category-icon">💳</span>
                Billing
              </span>
              <span className="breakdown-value">{category_breakdown.billing}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">
                <span className="category-icon">🔧</span>
                Technical
              </span>
              <span className="breakdown-value">{category_breakdown.technical}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">
                <span className="category-icon">👤</span>
                Account
              </span>
              <span className="breakdown-value">{category_breakdown.account}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-label">
                <span className="category-icon">📝</span>
                General
              </span>
              <span className="breakdown-value">{category_breakdown.general}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketStats;

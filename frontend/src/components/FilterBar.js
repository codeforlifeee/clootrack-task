import React from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      category: '',
      priority: '',
      status: '',
      search: '',
    });
  };

  const hasActiveFilters = 
    filters.category || 
    filters.priority || 
    filters.status || 
    filters.search;

  return (
    <div className="filter-bar">
      <div className="filter-inputs">
        <div className="filter-group">
          <label htmlFor="search">🔍 Search</label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search in title and description..."
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">🏷️ Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            <option value="billing">💳 Billing</option>
            <option value="technical">🔧 Technical</option>
            <option value="account">👤 Account</option>
            <option value="general">📝 General</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority">🎯 Priority</label>
          <select
            id="priority"
            name="priority"
            value={filters.priority}
            onChange={handleChange}
          >
            <option value="">All Priorities</option>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🟠 High</option>
            <option value="critical">🔴 Critical</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status">📊 Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
          >
            <option value="">All Statuses</option>
            <option value="open">🆕 Open</option>
            <option value="in_progress">⏳ In Progress</option>
            <option value="resolved">✅ Resolved</option>
            <option value="closed">🔒 Closed</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <button 
          className="clear-filters-btn"
          onClick={handleClearFilters}
        >
          ✖️ Clear All Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;

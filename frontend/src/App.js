import React, { useState, useEffect } from 'react';
import './App.css';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import TicketStats from './components/TicketStats';
import FilterBar from './components/FilterBar';
import { ticketAPI } from './api';

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
    search: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tickets based on current filters
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketAPI.getTickets(filters);
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const data = await ticketAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchTickets();
  }, [filters]);

  // Handle new ticket submission
  const handleTicketCreated = async (newTicket) => {
    // Refresh tickets and stats
    await fetchTickets();
    await fetchStats();
  };

  // Handle ticket update
  const handleTicketUpdate = async (ticketId, updates) => {
    try {
      await ticketAPI.updateTicket(ticketId, updates);
      await fetchTickets();
      await fetchStats();
    } catch (err) {
      console.error('Error updating ticket:', err);
      alert('Failed to update ticket. Please try again.');
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        <div className="container">
          <div className="header-content">
            <div className="header-icon">🎫</div>
            <h1>Support Ticket System</h1>
            <p>✨ Submit and manage support tickets with AI-powered categorization</p>
            <div className="header-badges">
              <span className="header-badge">🤖 AI-Powered</span>
              <span className="header-badge">⚡ Real-time</span>
              <span className="header-badge">📊 Analytics</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Statistics Dashboard */}
        {stats && <TicketStats stats={stats} />}

        {/* Ticket Submission Form */}
        <section className="section">
          <div className="section-header">
            <div className="section-icon">📝</div>
            <h2>Submit a New Ticket</h2>
          </div>
          <TicketForm onTicketCreated={handleTicketCreated} />
        </section>

        {/* Ticket List with Filters */}
        <section className="section">
          <div className="section-header">
            <div className="section-icon">📋</div>
            <h2>All Tickets</h2>
            <span className="ticket-count">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</span>
          </div>
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />
          
          {error && <div className="error-message">⚠️ {error}</div>}
          
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading tickets...</p>
            </div>
          ) : (
            <TicketList 
              tickets={tickets} 
              onTicketUpdate={handleTicketUpdate}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p>🚀 &copy; 2026 Support Ticket System. Built with React + Django + LLM.</p>
            <div className="footer-links">
              <span>Made with ❤️ for Clootrack</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

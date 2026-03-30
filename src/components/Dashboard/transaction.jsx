import React, { useState, useEffect, useCallback } from 'react';
import SideNavbar from './SideNavbar';
import api from '../../api';
import '../../styles/transaction.css';

const Transaction = () => {
  const [userName] = useState('Kim Ryan');
  const [userRole] = useState('Driver');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    totalDeductions: 0,
    netBalance: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    console.log('Fetching transactions...');
    try {
      setLoading(true);
      setError(null);
      const response = await api.getTransactions();
      
      if (response && response.transactions) {
        console.log('Transactions fetched:', response.transactions.length);
        setTransactions(response.transactions);
        setSummary(response.summary);
      } else {
        console.warn('Invalid response structure:', response);
        setTransactions([]);
        setSummary({ totalEarnings: 0, totalDeductions: 0, netBalance: 0, transactionCount: 0 });
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please try again.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchTransactions, 10000);
    return () => clearInterval(interval);
  }, [fetchTransactions]);

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    const statusMatch = filterStatus === 'all' || txn.status === filterStatus || (filterStatus === 'completed' && (txn.status === 'completed' || txn.status === 'paid'));
    const searchMatch = 
      (txn.reference?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (txn.description?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (txn.type?.toLowerCase().includes(searchQuery.toLowerCase()));
    return statusMatch && searchMatch;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Ride Earnings':
        return '💰';
      case 'Commission Deduction':
        return '📉';
      case 'Refund':
        return '↩️';
      case 'Bonus':
        return '🎁';
      default:
        return '💳';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className="status-badge completed">Completed</span>;
      case 'paid':
        return <span className="status-badge completed">Paid</span>;
      case 'pending':
        return <span className="status-badge pending">Pending</span>;
      case 'failed':
        return <span className="status-badge failed">Failed</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatCurrencyFromCentavos = (amountInCentavos) => {
    // Convert centavos to pesos (divide by 100)
    const amountInPesos = amountInCentavos / 100;
    return formatCurrency(amountInPesos);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="dashboard-container">
        <SideNavbar 
          userName={userName} 
          userRole={userRole}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className={`transaction-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchTransactions} className="retry-btn">Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <SideNavbar 
        userName={userName} 
        userRole={userRole}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className={`transaction-wrapper ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <div className="transaction-container">
          {/* Header */}
          <div className="transaction-header">
            <h1>Transactions</h1>
            <p>View your earnings and payment history</p>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon earnings">💵</div>
              <div className="card-content">
                <p className="card-label">Total Earnings</p>
                <p className="card-amount">{formatCurrencyFromCentavos(summary.totalEarnings)}</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon deductions">📊</div>
              <div className="card-content">
                <p className="card-label">Total Deductions</p>
                <p className="card-amount">{formatCurrencyFromCentavos(summary.totalDeductions)}</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon balance">✅</div>
              <div className="card-content">
                <p className="card-label">Net Balance</p>
                <p className="card-amount">{formatCurrencyFromCentavos(summary.netBalance)}</p>
              </div>
            </div>

            <div className="summary-card">
              <div className="card-icon count">📋</div>
              <div className="card-content">
                <p className="card-label">Total Rides</p>
                <p className="card-amount">{summary.transactionCount}</p>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search by reference, type, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                Pending
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'failed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('failed')}
              >
                Failed
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="transactions-list">
            <div className="list-header">
              <div className="col-date">Date</div>
              <div className="col-type">Type</div>
              <div className="col-description">Description</div>
              <div className="col-reference">Reference</div>
              <div className="col-amount">Amount</div>
              <div className="col-status">Status</div>
            </div>

            {loading ? (
              <div className="loading-message">
                <p>Loading transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
                <div key={txn.id} className="transaction-item">
                  <div className="col-date">{formatDate(txn.date)}</div>
                  <div className="col-type">
                    <span className="type-badge">
                      {getTypeIcon(txn.type)} {txn.type}
                    </span>
                  </div>
                  <div className="col-description">{txn.description}</div>
                  <div className="col-reference">
                    <code>{txn.reference}</code>
                  </div>
                  <div className="col-amount">
                    <span className={txn.type === 'Commission Deduction' || txn.type === 'Refund' ? 'negative' : 'positive'}>
                      {txn.type === 'Commission Deduction' || txn.type === 'Refund' ? '-' : '+'}{formatCurrencyFromCentavos(txn.amount)}
                    </span>
                  </div>
                  <div className="col-status">
                    {getStatusBadge(txn.status)}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-transactions">
                <p>No transactions found</p>
              </div>
            )}
          </div>

          {/* Pagination Info */}
          <div className="pagination-info">
            <p>Showing {filteredTransactions.length} of {transactions.length} transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;

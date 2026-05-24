import { useEffect, useState } from 'react';
import { getDashboardStats, getAlerts } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [statsData, alertsData] = await Promise.all([
        getDashboardStats(),
        getAlerts()
      ]);
      setStats(statsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading dashboard...</div>;
  if (!stats) return <div>Failed to load data</div>;
  
  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, color: '#4361ee' },
    { label: 'Quality Score', value: `${stats.overallQualityScore}%`, color: '#10b981' },
    { label: 'High Issues', value: stats.issueCounts?.HIGH || 0, color: '#ef4444' },
    { label: 'Medium Issues', value: stats.issueCounts?.MEDIUM || 0, color: '#f59e0b' },
    { label: 'Missing Images', value: stats.missingImageCount || 0, color: '#8b5cf6' },
    { label: 'Weak Listings', value: stats.weakListings || 0, color: '#ec489a' }
  ];
  
  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>
      
      <div className="grid grid-3">
        {statCards.map(card => (
          <div key={card.label} className="card">
            <h3 style={{ color: '#6c757d', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{card.label}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Active Alerts</h3>
          {alerts.length === 0 ? (
            <p style={{ color: '#10b981' }}>No active alerts! All products look good.</p>
          ) : (
            <div>
              {alerts.slice(0, 5).map(alert => (
                <div key={alert._id} style={{ padding: '0.75rem 0', borderBottom: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span className={`badge badge-${alert.severity.toLowerCase()}`} style={{ marginRight: '0.5rem' }}>
                        {alert.severity}
                      </span>
                      <span style={{ fontWeight: 500 }}>{alert.title}</span>
                    </div>
                    <Link to={`/products/${alert.productId?._id}`} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
                      View
                    </Link>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.25rem' }}>{alert.message}</p>
                </div>
              ))}
              {alerts.length > 5 && (
                <Link to="/alerts" style={{ display: 'block', marginTop: '1rem', textAlign: 'center' }}>
                  View all {alerts.length} alerts →
                </Link>
              )}
            </div>
          )}
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/upload" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
              Upload New Product
            </Link>
            <Link to="/products" className="btn btn-secondary" style={{ textAlign: 'center', textDecoration: 'none' }}>
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

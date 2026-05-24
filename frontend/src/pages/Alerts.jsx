import { useEffect, useState } from 'react';
import { getAlerts, resolveAlert } from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAlerts();
  }, []);
  
  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResolve = async (alertId) => {
    try {
      await resolveAlert(alertId);
      toast.success('Alert resolved');
      fetchAlerts();
    } catch {
      toast.error('Failed to resolve alert');
    }
  };
  
  if (loading) return <div>Loading alerts...</div>;
  
  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Alert History</h1>
      
      {alerts.length === 0 ? (
        <div className="card">
          <p>No active alerts. Great job! 🎉</p>
        </div>
      ) : (
        <div className="card">
          {alerts.map(alert => (
            <div key={alert._id} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className={`badge badge-${alert.severity.toLowerCase()}`}>
                      {alert.severity}
                    </span>
                    <span className="badge" style={{ background: '#e5e7eb' }}>
                      {alert.type}
                    </span>
                    <strong>{alert.title}</strong>
                  </div>
                  <p style={{ color: '#495057', marginBottom: '0.5rem' }}>{alert.message}</p>
                  {alert.actionSuggestion && (
                    <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                      💡 {alert.actionSuggestion}
                    </p>
                  )}
                  <p style={{ fontSize: '0.75rem', color: '#adb5bd', marginTop: '0.5rem' }}>
                    Created: {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {alert.productId && (
                    <Link to={`/products/${alert.productId._id}`} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
                      View Product
                    </Link>
                  )}
                  <button onClick={() => handleResolve(alert._id)} className="btn btn-primary" style={{ fontSize: '0.75rem', background: '#10b981' }}>
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;

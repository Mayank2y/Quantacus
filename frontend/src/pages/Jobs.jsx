import { useEffect, useState } from 'react';
import { getJobs } from '../services/api';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return '#10b981';
      case 'RUNNING': return '#3b82f6';
      case 'PENDING': return '#f59e0b';
      case 'FAILED': return '#ef4444';
      case 'PARTIALLY_COMPLETED': return '#8b5cf6';
      default: return '#6b7280';
    }
  };
  
  if (loading) return <div>Loading jobs...</div>;
  
  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Processing Jobs</h1>
      
      {jobs.length === 0 ? (
        <div className="card">No jobs found. Upload a video to get started.</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.jobId}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{job.jobId.slice(0, 8)}...</td>
                  <td>{job.type}</td>
                  <td>
                    <span className="badge" style={{ background: getStatusColor(job.status), color: 'white' }}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ width: '100px' }}>
                      <div className="status-bar">
                        <div className="status-progress" style={{ width: `${job.progress}%` }} />
                      </div>
                      <small>{job.progress}%</small>
                    </div>
                  </td>
                  <td>{new Date(job.createdAt).toLocaleTimeString()}</td>
                  <td>
                    {job.productId && (
                      <Link to={`/products/${job.productId._id}`} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
                        View Product
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Jobs;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { uploadCSV, uploadVideo } from '../services/api';

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [enhanceTitle, setEnhanceTitle] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a video file');
      return;
    }
    
    setUploading(true);
    try {
      await uploadVideo(file, enhanceTitle);
      toast.success('Video uploaded! Processing started.');
      navigate(`/jobs`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Upload Product Video</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Product Video *
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ width: '100%', padding: '0.5rem' }}
              required
            />
            <small style={{ color: '#6c757d' }}>MP4, MOV, AVI formats supported (max 50MB)</small>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={enhanceTitle}
                onChange={(e) => setEnhanceTitle(e.target.checked)}
              />
              <span>Enhance product title automatically</span>
            </label>
            <small style={{ color: '#6c757d' }}>Uses AI to generate improved titles with trending keywords</small>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload & Process'}
          </button>
        </form>
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Fallback: Upload CSV</h3>
        <p style={{ marginBottom: '1rem', color: '#6c757d' }}>
          If video extraction is incomplete, you can upload a product CSV file.
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              try {
                await uploadCSV(file);
                toast.success('CSV uploaded successfully');
                navigate('/products');
              } catch {
                toast.error('CSV upload failed');
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Upload;

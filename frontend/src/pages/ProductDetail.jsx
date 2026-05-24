import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProduct, updateProduct, enhanceTitle, getCompetitorPrices, refreshCompetitorPrices } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [competitors, setCompetitors] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  const fetchData = useCallback(async () => {
    try {
      const [productData, competitorData] = await Promise.all([
        getProduct(id),
        getCompetitorPrices(id)
      ]);
      setProduct(productData.product);
      setCompetitors(competitorData.competitors);
      setComparison(competitorData.comparison);
      setEditData(productData.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleSave = async () => {
    try {
      const updated = await updateProduct(id, editData);
      setProduct(updated);
      setEditing(false);
      toast.success('Product updated successfully');
      fetchData();
    } catch {
      toast.error('Update failed');
    }
  };
  
  const handleEnhanceTitle = async () => {
    try {
      const result = await enhanceTitle(id);
      toast.success(`Enhanced title generated: ${result.enhancedTitle}`);
      fetchData();
    } catch {
      toast.error('Title enhancement failed');
    }
  };
  
  const handleRefreshPrices = async () => {
    try {
      const data = await refreshCompetitorPrices(id);
      setCompetitors(data.competitors);
      setComparison(data.comparison);
      toast.success('Competitor prices refreshed');
    } catch {
      toast.error('Refresh failed');
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Product Details</h1>
        <button onClick={() => navigate('/products')} className="btn btn-secondary">Back to List</button>
      </div>
      
      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Product Information</h3>
          
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input type="text" placeholder="SKU" value={editData.skuId || ''} onChange={e => setEditData({...editData, skuId: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.375rem' }} />
              <input type="text" placeholder="Title" value={editData.productTitle || ''} onChange={e => setEditData({...editData, productTitle: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.375rem' }} />
              <input type="text" placeholder="Brand" value={editData.brand || ''} onChange={e => setEditData({...editData, brand: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.375rem' }} />
              <input type="number" placeholder="Price" value={editData.price || ''} onChange={e => setEditData({...editData, price: parseFloat(e.target.value)})} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.375rem' }} />
              <input type="text" placeholder="Image URL" value={editData.imageUrl || ''} onChange={e => setEditData({...editData, imageUrl: e.target.value})} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.375rem' }} />
              <textarea placeholder="Description" value={editData.description || ''} onChange={e => setEditData({...editData, description: e.target.value})} rows="3" style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.375rem' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleSave} className="btn btn-primary">Save</button>
                <button onClick={() => setEditing(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p><strong>SKU:</strong> {product.skuId}</p>
              <p><strong>Title:</strong> {product.productTitle}</p>
              {product.enhancedTitle && (
                <p><strong>✨ Enhanced Title:</strong> <span style={{ color: '#10b981' }}>{product.enhancedTitle}</span></p>
              )}
              <p><strong>Brand:</strong> {product.brand || 'N/A'}</p>
              <p><strong>Category:</strong> {product.category || 'N/A'}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              <p><strong>MRP:</strong> ₹{product.mrp || 'N/A'}</p>
              <p><strong>Availability:</strong> {product.availability}</p>
              <p><strong>Quality Score:</strong> 
                <span className="badge" style={{ background: '#e5e7eb', marginLeft: '0.5rem' }}>{product.listingQualityScore || 0}%</span>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button onClick={() => setEditing(true)} className="btn btn-secondary">Edit</button>
                <button onClick={handleEnhanceTitle} className="btn btn-primary">✨ Generate Enhanced Title</button>
              </div>
            </div>
          )}
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Listing Issues</h3>
          {product.validationIssues?.length === 0 ? (
            <p style={{ color: '#10b981' }}>✓ No issues found! Great listing!</p>
          ) : (
            <div>
              {product.validationIssues?.map((issue, idx) => (
                <div key={idx} style={{ padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span className={`badge badge-${issue.severity.toLowerCase()}`} style={{ marginRight: '0.5rem' }}>
                    {issue.severity}
                  </span>
                  <strong>{issue.message}</strong>
                  <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '0.25rem' }}>
                    Suggestion: {issue.suggestion}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Competitor Price Comparison</h3>
          <button onClick={handleRefreshPrices} className="btn btn-primary">🔄 Refresh Prices</button>
        </div>
        
        {comparison && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '0.5rem' }}>
            <h4>Price Analysis</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              <div><strong>Your Price:</strong> ₹{product.price}</div>
              <div><strong>Lowest Competitor:</strong> ₹{comparison.lowestCompetitorPrice || 'N/A'}</div>
              <div><strong>Average Competitor:</strong> ₹{comparison.averageCompetitorPrice || 'N/A'}</div>
              <div><strong>Price Gap:</strong> ₹{comparison.priceGap || 'N/A'}</div>
              <div><strong>Difference:</strong> {comparison.percentageDifference?.toFixed(1) || 'N/A'}%</div>
            </div>
            <p style={{ marginTop: '1rem', padding: '0.5rem', background: '#e9ecef', borderRadius: '0.375rem' }}>
              <strong>Recommendation:</strong> {comparison.recommendedAction}
            </p>
          </div>
        )}
        
        <table>
          <thead>
            <tr>
              <th>Platform</th>
              <th>Price</th>
              <th>Last Checked</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {competitors?.map((comp, idx) => (
              <tr key={idx}>
                <td><strong>{comp.platform}</strong></td>
                <td>₹{comp.price}</td>
                <td>{new Date(comp.lastChecked).toLocaleDateString()}</td>
                <td><a href={comp.url} target="_blank" rel="noopener noreferrer">View</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductDetail;

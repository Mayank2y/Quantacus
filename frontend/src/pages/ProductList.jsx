import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  const fetchProducts = useCallback(async (severity = '') => {
    try {
      const data = await getProducts(severity ? { severity } : {});
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const getQualityColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };
  
  if (loading) return <div>Loading products...</div>;
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>Products</h1>
        <div>
          <select
            value={filter}
            onChange={(e) => {
              const severity = e.target.value;
              setFilter(severity);
              fetchProducts(severity);
            }}
            style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #ddd' }}
          >
            <option value="">All Issues</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="card">No products found. Upload a product to get started.</div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Title</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Quality</th>
                <th>Issues</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td style={{ fontFamily: 'monospace' }}>{product.skuId}</td>
                  <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {product.productTitle}
                  </td>
                  <td>{product.brand || '-'}</td>
                  <td>₹{product.price}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="status-bar" style={{ width: '60px' }}>
                        <div className="status-progress" style={{ width: `${product.listingQualityScore || 0}%`, background: getQualityColor(product.listingQualityScore || 0) }} />
                      </div>
                      <span>{product.listingQualityScore || 0}%</span>
                    </div>
                  </td>
                  <td>
                    {product.validationIssues?.filter(i => i.severity === 'HIGH').length > 0 && (
                      <span className="badge badge-high">H</span>
                    )}
                    {product.validationIssues?.filter(i => i.severity === 'MEDIUM').length > 0 && (
                      <span className="badge badge-medium">M</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/products/${product._id}`} className="btn btn-secondary" style={{ fontSize: '0.75rem' }}>
                      View Details
                    </Link>
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

export default ProductList;

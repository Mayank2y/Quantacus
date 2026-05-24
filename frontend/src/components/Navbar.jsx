import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/upload', label: 'Upload Product' },
    { path: '/products', label: 'Products' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/alerts', label: 'Alerts' }
  ];
  
  return (
    <nav style={{ background: '#1a1a2e', color: 'white', padding: '1rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Product Intelligence
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: 'white',
                  textDecoration: location.pathname === link.path ? 'underline' : 'none',
                  opacity: location.pathname === link.path ? 1 : 0.7
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState, useEffect } from 'react';
import AdminInquiries from '../components/AdminInquiries';
import GoogleIndexing from '../components/GoogleIndexing';
import AdminLogin from '../components/AdminLogin';
import AdminActivityLog from '../components/AdminActivityLog';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', role: '' });

  const handleLogin = (username: string, role: string) => {
    // Store authentication in session storage (clears when browser closes)
    sessionStorage.setItem('admin_authenticated', 'true');
    sessionStorage.setItem('admin_session', Date.now().toString());
    sessionStorage.setItem('admin_user', username);
    sessionStorage.setItem('admin_role', role);
    setCurrentUser({ username, role });
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_session');
    sessionStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_role');
    setCurrentUser({ username: '', role: '' });
    setIsAuthenticated(false);
  };

  // Check if already authenticated (session-based)
  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    const sessionTime = sessionStorage.getItem('admin_session');
    const storedUser = sessionStorage.getItem('admin_user');
    const storedRole = sessionStorage.getItem('admin_role');
    
    // Session expires after 4 hours
    if (isAuth && sessionTime && storedUser && storedRole) {
      const sessionAge = Date.now() - parseInt(sessionTime);
      if (sessionAge < 4 * 60 * 60 * 1000) { // 4 hours
        setCurrentUser({ username: storedUser, role: storedRole });
        setIsAuthenticated(true);
      } else {
        sessionStorage.removeItem('admin_authenticated');
        sessionStorage.removeItem('admin_session');
        sessionStorage.removeItem('admin_user');
        sessionStorage.removeItem('admin_role');
      }
    }
  }, []);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{
              color: '#1D4ED8',
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0'
            }}>
              LA Automotive Admin Dashboard
            </h1>
            <p style={{
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontSize: '1rem'
            }}>
              Welcome back, {currentUser.role} - {currentUser.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#EF4444',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Logout ({currentUser.username})
          </button>
        </div>

        <div style={{
          display: 'grid',
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))'
        }}>
          <AdminInquiries />
          <GoogleIndexing />
        </div>

        {/* Activity Tracking Section - Only for Owner */}
        {currentUser.role === 'Owner' && (
          <div style={{ marginTop: '2rem' }}>
            <AdminActivityLog />
          </div>
        )}

        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: '#374151',
            marginBottom: '1rem'
          }}>
            Business Management Features
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div>
              <h4 style={{ color: '#1D4ED8', marginBottom: '0.5rem' }}>Customer Inquiries</h4>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                View all contact form submissions and service requests from customers.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1D4ED8', marginBottom: '0.5rem' }}>Google Indexing</h4>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Submit your SEO landing pages to Google for faster search visibility.
              </p>
            </div>
            <div>
              <h4 style={{ color: '#1D4ED8', marginBottom: '0.5rem' }}>SEO Analytics</h4>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Monitor your 5,860+ monthly search targets and website performance.
              </p>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#FEF2F2',
          borderRadius: '8px',
          border: '1px solid #FCA5A5'
        }}>
          <p style={{
            margin: '0',
            fontSize: '0.875rem',
            color: '#991B1B',
            textAlign: 'center'
          }}>
            <strong>Security Active:</strong> Session expires in 4 hours. Customer data is protected.
          </p>
        </div>
      </div>
    </div>
  );
}
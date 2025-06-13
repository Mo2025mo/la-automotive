import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PasswordRecovery from "./PasswordRecovery";

interface AdminLoginProps {
  onLogin: (username: string, role: string) => void;
}

// Admin users database - add or remove admins here
const ADMIN_USERS = [
  { username: "owner", password: "YourNewOwnerPassword123!", role: "Owner", fullAccess: true },
  { username: "manager", password: "YourNewManagerPassword123!", role: "Manager", fullAccess: true },
  { username: "staff", password: "YourNewStaffPassword123!", role: "Staff", fullAccess: false }
];

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check credentials against admin database
    const admin = ADMIN_USERS.find(user => 
      user.username === username && user.password === password
    );
    
    if (admin) {
      onLogin(admin.username, admin.role);
      toast({
        title: "Access Granted",
        description: `Welcome ${admin.role} - ${admin.username}`,
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
    setUsername("");
    setPassword("");
  };

  if (showRecovery) {
    return <PasswordRecovery onBackToLogin={() => setShowRecovery(false)} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            color: '#1D4ED8',
            fontSize: '1.75rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            LA Automotive
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1rem' }}>
            Admin Dashboard Access
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1D4ED8'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              color: '#374151'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1D4ED8'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            style={{
              width: '100%',
              backgroundColor: '#1D4ED8',
              color: 'white',
              padding: '1rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: (isLoading || !password) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || !password) ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? "Verifying..." : "Access Dashboard"}
          </button>

          <button
            type="button"
            onClick={() => setShowRecovery(true)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: '#6B7280',
              padding: '0.75rem',
              fontSize: '0.875rem',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Forgot Password?
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#FEF3C7',
          borderRadius: '8px',
          border: '1px solid #F59E0B'
        }}>
          <p style={{
            margin: '0',
            fontSize: '0.875rem',
            color: '#92400E',
            textAlign: 'center'
          }}>
            <strong>Security Notice:</strong><br/>
            This admin area contains sensitive customer data.<br/>
            Access is restricted to authorized personnel only.
          </p>
        </div>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{
            margin: '0',
            fontSize: '0.75rem',
            color: '#9CA3AF'
          }}>
            LA Automotive - 5 Burgess Road, Hastings<br/>
            Secure Admin Portal v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
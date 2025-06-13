import { useQuery } from "@tanstack/react-query";

interface AdminActivity {
  username: string;
  role: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  sessionDuration?: number;
  success: boolean;
}

interface LoginStats {
  username: string;
  role: string;
  totalLogins: number;
  lastLogin: string;
  failedAttempts: number;
}

export default function AdminActivityLog() {
  const { data: activities = [], isLoading: activitiesLoading } = useQuery<AdminActivity[]>({
    queryKey: ['/api/admin/activities'],
    queryFn: async (): Promise<AdminActivity[]> => {
      const response = await fetch('/api/admin/activities');
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    }
  });

  const { data: stats = [], isLoading: statsLoading } = useQuery<LoginStats[]>({
    queryKey: ['/api/admin/login-stats'],
    queryFn: async (): Promise<LoginStats[]> => {
      const response = await fetch('/api/admin/login-stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS': return '#10B981';
      case 'LOGIN_FAILED': return '#EF4444';
      case 'LOGOUT': return '#6B7280';
      case 'VIEW_INQUIRIES': return '#3B82F6';
      case 'MARK_READ': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS': return 'Login Success';
      case 'LOGIN_FAILED': return 'Login Failed';
      case 'LOGOUT': return 'Logout';
      case 'VIEW_INQUIRIES': return 'Viewed Inquiries';
      case 'MARK_READ': return 'Marked Inquiry Read';
      default: return action;
    }
  };

  if (activitiesLoading || statsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading admin activity data...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h2 style={{
        color: '#1D4ED8',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Admin Activity Tracking
      </h2>

      {/* Login Statistics */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
          User Statistics
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>
          {stats.map((stat) => (
            <div
              key={stat.username}
              style={{
                padding: '1.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div>
                  <h4 style={{ margin: '0', color: '#1F2937' }}>{stat.username}</h4>
                  <p style={{ margin: '0', color: '#6B7280', fontSize: '0.875rem' }}>{stat.role}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    backgroundColor: '#10B981',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem'
                  }}>
                    {stat.totalLogins} logins
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                <p style={{ margin: '0.25rem 0' }}>
                  Last Login: {stat.lastLogin ? formatTimestamp(stat.lastLogin) : 'Never'}
                </p>
                <p style={{ margin: '0.25rem 0' }}>
                  Failed Attempts: {stat.failedAttempts}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div>
        <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
          Recent Activities (Last 50)
        </h3>
        
        {activities.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#6B7280'
          }}>
            No admin activities recorded yet.
          </div>
        ) : (
          <div style={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #E5E7EB',
            borderRadius: '8px'
          }}>
            {activities.map((activity, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  borderBottom: index < activities.length - 1 ? '1px solid #F3F4F6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      backgroundColor: getActionColor(activity.action),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {getActionLabel(activity.action)}
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#1F2937' }}>
                      {activity.username} ({activity.role})
                    </span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.875rem',
                    color: '#6B7280'
                  }}>
                    <div>
                      <strong>Time:</strong> {formatTimestamp(activity.timestamp)}
                    </div>
                    <div>
                      <strong>IP:</strong> {activity.ipAddress}
                    </div>
                    {activity.userAgent && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <strong>Browser:</strong> {activity.userAgent.slice(0, 80)}...
                      </div>
                    )}
                    {activity.sessionDuration && (
                      <div>
                        <strong>Session:</strong> {Math.round(activity.sessionDuration / 60)} minutes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#F0F9FF',
        borderRadius: '8px',
        border: '1px solid #0EA5E9'
      }}>
        <p style={{
          margin: '0',
          fontSize: '0.875rem',
          color: '#0C4A6E',
          textAlign: 'center'
        }}>
          <strong>Security Monitoring:</strong> All admin activities are logged for security purposes.
          This includes login attempts, session durations, IP addresses, and user actions.
        </p>
      </div>
    </div>
  );
}
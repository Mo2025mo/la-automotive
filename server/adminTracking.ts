// Admin activity tracking system
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

// In-memory storage for admin activities
export const adminActivityLog: AdminActivity[] = [];

// Log admin login attempt
export function logAdminLogin(
  username: string, 
  role: string, 
  ipAddress: string, 
  userAgent: string, 
  success: boolean
): void {
  const activity: AdminActivity = {
    username,
    role,
    action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
    timestamp: new Date().toISOString(),
    ipAddress,
    userAgent,
    success
  };

  adminActivityLog.push(activity);
  
  console.log('=== ADMIN ACTIVITY LOG ===');
  console.log(`Action: ${activity.action}`);
  console.log(`User: ${username} (${role})`);
  console.log(`Time: ${new Date(activity.timestamp).toLocaleString()}`);
  console.log(`IP: ${ipAddress}`);
  console.log(`Browser: ${userAgent}`);
  console.log('========================');
}

// Log admin logout
export function logAdminLogout(
  username: string, 
  role: string, 
  ipAddress: string, 
  sessionDuration: number
): void {
  const activity: AdminActivity = {
    username,
    role,
    action: 'LOGOUT',
    timestamp: new Date().toISOString(),
    ipAddress,
    userAgent: '',
    sessionDuration,
    success: true
  };

  adminActivityLog.push(activity);
  
  console.log('=== ADMIN LOGOUT LOG ===');
  console.log(`User: ${username} (${role})`);
  console.log(`Session Duration: ${Math.round(sessionDuration / 60)} minutes`);
  console.log(`Time: ${new Date(activity.timestamp).toLocaleString()}`);
  console.log('======================');
}

// Log admin actions (viewing inquiries, etc.)
export function logAdminAction(
  username: string,
  role: string,
  action: string,
  ipAddress: string
): void {
  const activity: AdminActivity = {
    username,
    role,
    action,
    timestamp: new Date().toISOString(),
    ipAddress,
    userAgent: '',
    success: true
  };

  adminActivityLog.push(activity);
}

// Get all admin activities (for super admin view) with auto-cleanup
export function getAdminActivities(): AdminActivity[] {
  // Keep only last 500 activities for performance
  const maxActivities = 500;
  
  const sorted = adminActivityLog
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Auto-cleanup: remove oldest activities if exceeding limit
  if (sorted.length > maxActivities) {
    adminActivityLog.splice(maxActivities);
  }
  
  return sorted.slice(0, 100); // Show last 100 in dashboard
}

// Get login statistics
export function getLoginStats() {
  const activities = adminActivityLog;
  const logins = activities.filter(a => a.action === 'LOGIN_SUCCESS');
  const failedLogins = activities.filter(a => a.action === 'LOGIN_FAILED');
  
  const userStats: { [key: string]: any } = {};
  logins.forEach(login => {
    if (!userStats[login.username]) {
      userStats[login.username] = {
        username: login.username,
        role: login.role,
        totalLogins: 0,
        lastLogin: null,
        failedAttempts: 0
      };
    }
    userStats[login.username].totalLogins++;
    userStats[login.username].lastLogin = login.timestamp;
  });

  failedLogins.forEach(failed => {
    if (userStats[failed.username]) {
      userStats[failed.username].failedAttempts++;
    }
  });

  return Object.values(userStats);
}

// Security alert for suspicious activity
export function checkSuspiciousActivity(username: string, ipAddress: string): boolean {
  const recentActivities = adminActivityLog
    .filter(a => a.username === username && a.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .slice(0, 10);

  const failedLogins = recentActivities.filter(a => a.action === 'LOGIN_FAILED').length;
  const differentIPs = new Set(recentActivities.map(a => a.ipAddress)).size;

  // Alert if more than 3 failed attempts or logins from 3+ different IPs in 24h
  return failedLogins > 3 || differentIPs > 2;
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Inquiry {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  message: string;
  serviceType?: string;
  vehicleDetails?: string;
  contactMethod?: string;
  timestamp: string;
  status: 'new' | 'read' | 'responded';
}

export default function AdminInquiries() {
  const queryClient = useQueryClient();

  const { data: inquiries = [], isLoading } = useQuery<Inquiry[]>({
    queryKey: ['/api/admin/inquiries'],
    queryFn: async (): Promise<Inquiry[]> => {
      const response = await fetch('/api/admin/inquiries');
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      return response.json();
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (timestamp: string) => {
      const response = await fetch(`/api/admin/inquiries/${timestamp}/read`, {
        method: 'PATCH'
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inquiries'] });
    }
  });

  const deleteInquiryMutation = useMutation({
    mutationFn: async (timestamp: string) => {
      const response = await fetch(`/api/admin/inquiries/${timestamp}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete inquiry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/inquiries'] });
    }
  });

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#EF4444';
      case 'read': return '#F59E0B';
      case 'responded': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading inquiries...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <h2 style={{
        color: '#1D4ED8',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        Customer Inquiries
      </h2>

      {inquiries.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#6B7280'
        }}>
          No customer inquiries yet. All contact form submissions will appear here.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.timestamp}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: inquiry.status === 'new' ? '#FEF2F2' : 'white'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <h3 style={{
                    margin: '0 0 0.5rem 0',
                    color: '#1F2937',
                    fontSize: '1.125rem',
                    fontWeight: 'bold'
                  }}>
                    {inquiry.subject}
                  </h3>
                  <p style={{
                    margin: '0',
                    color: '#6B7280',
                    fontSize: '0.875rem'
                  }}>
                    {formatDate(inquiry.timestamp)}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <span style={{
                    backgroundColor: getStatusColor(inquiry.status),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {inquiry.status}
                  </span>
                  {inquiry.status === 'new' && (
                    <button
                      onClick={() => markAsReadMutation.mutate(inquiry.timestamp)}
                      disabled={markAsReadMutation.isPending}
                      style={{
                        backgroundColor: '#1D4ED8',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
                        deleteInquiryMutation.mutate(inquiry.timestamp);
                      }
                    }}
                    disabled={deleteInquiryMutation.isPending}
                    style={{
                      backgroundColor: '#DC2626',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <strong>Customer:</strong> {inquiry.customerName}<br/>
                  <strong>Email:</strong> {inquiry.customerEmail}<br/>
                  {inquiry.customerPhone && (
                    <><strong>Phone:</strong> {inquiry.customerPhone}<br/></>
                  )}
                  {inquiry.contactMethod && (
                    <><strong>Preferred Contact:</strong> {inquiry.contactMethod}<br/></>
                  )}
                </div>
                {(inquiry.serviceType || inquiry.vehicleDetails) && (
                  <div>
                    {inquiry.serviceType && (
                      <><strong>Service:</strong> {inquiry.serviceType}<br/></>
                    )}
                    {inquiry.vehicleDetails && (
                      <><strong>Vehicle:</strong> {inquiry.vehicleDetails}<br/></>
                    )}
                  </div>
                )}
              </div>

              <div style={{
                backgroundColor: '#F9FAFB',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid #E5E7EB'
              }}>
                <strong>Message:</strong>
                <p style={{
                  margin: '0.5rem 0 0 0',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {inquiry.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#F3F4F6',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0', fontSize: '0.875rem', color: '#6B7280' }}>
          <strong>Response Instructions:</strong><br/>
          Contact customers directly using the email/phone provided above.<br/>
          All inquiries are automatically logged and stored for your review.
        </p>
      </div>
    </div>
  );
}
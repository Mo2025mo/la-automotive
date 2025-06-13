// Free contact system - stores customer inquiries for business owner review
interface ContactInquiry {
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

export async function logCustomerInquiry(inquiry: Omit<ContactInquiry, 'timestamp' | 'status'>): Promise<boolean> {
  try {
    console.log('=== NEW CUSTOMER INQUIRY ===');
    console.log(`Customer: ${inquiry.customerName}`);
    console.log(`Email: ${inquiry.customerEmail}`);
    console.log(`Phone: ${inquiry.customerPhone || 'Not provided'}`);
    console.log(`Subject: ${inquiry.subject}`);
    console.log(`Message: ${inquiry.message}`);
    if (inquiry.serviceType) console.log(`Service: ${inquiry.serviceType}`);
    if (inquiry.vehicleDetails) console.log(`Vehicle: ${inquiry.vehicleDetails}`);
    console.log('============================');
    
    // Store inquiry for business owner review
    inquiryQueue.push({
      ...inquiry,
      timestamp: new Date().toISOString(),
      status: 'new' as const
    });
    
    return true;
  } catch (error) {
    console.error('Inquiry logging failed:', error);
    return false;
  }
}

// Free storage for customer inquiries
export const inquiryQueue: ContactInquiry[] = [];

// Get all inquiries for admin dashboard with optimization
export function getInquiries(): ContactInquiry[] {
  // Keep only the most recent 1000 inquiries for performance
  const maxInquiries = 1000;
  
  const sorted = inquiryQueue.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  // Auto-cleanup: remove oldest inquiries if exceeding limit
  if (sorted.length > maxInquiries) {
    inquiryQueue.splice(maxInquiries);
  }
  
  return sorted;
}

// Mark inquiry as read
export function markInquiryAsRead(timestamp: string): boolean {
  const inquiry = inquiryQueue.find(i => i.timestamp === timestamp);
  if (inquiry) {
    inquiry.status = 'read';
    return true;
  }
  return false;
}

// Delete inquiry
export function deleteInquiry(timestamp: string): boolean {
  const index = inquiryQueue.findIndex(i => i.timestamp === timestamp);
  if (index !== -1) {
    inquiryQueue.splice(index, 1);
    return true;
  }
  return false;
}

// Helper functions for common inquiry types
export function createServiceRequestInquiry(
  customerName: string, 
  customerEmail: string, 
  customerPhone: string,
  serviceType: string, 
  vehicleDetails: string,
  contactMethod?: string
): Omit<ContactInquiry, 'timestamp' | 'status'> {
  return {
    customerName,
    customerEmail,
    customerPhone,
    subject: `Service Request - ${serviceType}`,
    message: `Customer ${customerName} has requested ${serviceType} service for their ${vehicleDetails}. Please contact them to schedule an appointment.`,
    serviceType,
    vehicleDetails,
    contactMethod
  };
}

export function createContactFormInquiry(
  name: string,
  email: string,
  phone: string,
  message: string
): Omit<ContactInquiry, 'timestamp' | 'status'> {
  return {
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    subject: 'Contact Form Submission',
    message: message
  };
}

export function createPriceMatchInquiry(
  customerEmail: string,
  partName: string,
  currentPrice: string,
  competitorPrice: string
): Omit<ContactInquiry, 'timestamp' | 'status'> {
  return {
    customerName: 'Price Match Customer',
    customerEmail,
    subject: `Price Match Request - ${partName}`,
    message: `Customer requesting price match for ${partName}. Our price: £${currentPrice}, Competitor price: £${competitorPrice}. Please review and respond.`
  };
}
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { logCustomerInquiry, getInquiries, markInquiryAsRead, deleteInquiry, createContactFormInquiry, createServiceRequestInquiry } from "./email";
import { logAdminLogin, logAdminLogout, logAdminAction, getAdminActivities, getLoginStats } from "./adminTracking";
import { insertServiceRequestSchema, insertPriceMatchSchema, insertVehicleLookupSchema, insertUserSearchSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Service Request submission
  app.post("/api/service-request", async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse(req.body);
      const serviceRequest = await storage.createServiceRequest(validatedData);
      
      // Create inquiry for admin dashboard
      const inquiry = createServiceRequestInquiry(
        serviceRequest.fullName,
        serviceRequest.email || 'No email provided',
        serviceRequest.phoneNumber,
        serviceRequest.issueCategory,
        `${serviceRequest.carMake || ''} ${serviceRequest.carModel || ''} ${serviceRequest.carYear || ''}`.trim() || 'Vehicle details not provided',
        serviceRequest.contactMethod || undefined
      );
      
      // Add detailed message with all service request info
      inquiry.message = `Service Request Details:
      
Customer: ${serviceRequest.fullName}
Phone: ${serviceRequest.phoneNumber}
Email: ${serviceRequest.email || 'Not provided'}
Contact Method: ${serviceRequest.contactMethod}

Vehicle Information:
Registration: ${serviceRequest.registrationPlate || 'Not provided'}
Make/Model: ${serviceRequest.carMake || ''} ${serviceRequest.carModel || ''}
Year: ${serviceRequest.carYear || 'Not provided'}

Issue Category: ${serviceRequest.issueCategory}
Description: ${serviceRequest.issueDescription}

Request ID: ${serviceRequest.id}
Submitted: ${new Date().toLocaleString('en-GB')}`;
      
      // Log to customer inquiry system for admin dashboard
      await logCustomerInquiry(inquiry);
      
      res.json({ success: true, id: serviceRequest.id });
    } catch (error) {
      console.error("Service request error:", error);
      res.status(400).json({ error: "Invalid service request data" });
    }
  });

  // Professional vehicle lookup service
  app.post("/api/vehicle-lookup", async (req, res) => {
    try {
      const { registrationPlate } = req.body;
      
      if (!registrationPlate) {
        return res.status(400).json({ error: "Registration plate is required" });
      }

      // Track the search
      await storage.createUserSearch({
        searchType: "vehicle_lookup",
        searchQuery: registrationPlate,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || req.connection.remoteAddress || null
      });

      // Direct users to contact LA-Automotive
      return res.status(404).json({ 
        error: "Vehicle lookup unavailable",
        message: "For vehicle information and history checks, please contact LA-Automotive directly.",
        contactInfo: {
          phone: "+44 788 702 4551",
          email: "LA-Automotive@hotmail.com",
          address: "5 Burgess Road, Hastings",
          hours: "Mon-Fri 9:00 AM - 5:30 PM"
        }
      });
    } catch (error) {
      console.error("Vehicle lookup error:", error);
      res.status(500).json({ 
        error: "Vehicle lookup failed",
        message: "Please contact LA-Automotive for assistance with your vehicle enquiry."
      });
    }
  });

  // Admin login endpoint with tracking
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      // Admin credentials (should match AdminLogin.tsx)
      const ADMIN_USERS = [
        { username: "owner", password: "NewOwnerPass2025!", role: "Owner", fullAccess: true },
        { username: "manager", password: "NewManagerPass2025!", role: "Manager", fullAccess: true },
        { username: "staff", password: "NewStaffPass2025!", role: "Staff", fullAccess: false }
      ];

      const admin = ADMIN_USERS.find(user => 
        user.username === username && user.password === password
      );

      if (admin) {
        logAdminLogin(admin.username, admin.role, ipAddress, userAgent, true);
        res.json({ 
          success: true, 
          username: admin.username,
          role: admin.role,
          message: "Login successful" 
        });
      } else {
        logAdminLogin(username, 'Unknown', ipAddress, userAgent, false);
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get admin activities
  app.get("/api/admin/activities", async (req, res) => {
    try {
      const activities = getAdminActivities();
      res.json(activities);
    } catch (error) {
      console.error("Activities retrieval error:", error);
      res.status(500).json({ error: "Failed to retrieve activities" });
    }
  });

  // Free contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message, serviceType, vehicleDetails } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Name, email, and message are required" });
      }

      let inquiry;
      if (serviceType && vehicleDetails) {
        inquiry = createServiceRequestInquiry(name, email, phone || '', serviceType, vehicleDetails);
      } else {
        inquiry = createContactFormInquiry(name, email, phone || '', message);
      }

      await logCustomerInquiry(inquiry);
      
      res.json({ 
        success: true, 
        message: "Thank you for contacting LA Automotive. We will respond within 2 hours during business hours."
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Get customer inquiries for admin dashboard
  app.get("/api/admin/inquiries", async (req, res) => {
    try {
      const inquiries = getInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Inquiries retrieval error:", error);
      res.status(500).json({ error: "Failed to retrieve inquiries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

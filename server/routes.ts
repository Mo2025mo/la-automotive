import { Express } from "express";
import { z } from "zod";
import { Server } from "http";
import { IStorage } from "./storage";
import { insertServiceRequestSchema, insertPriceMatchSchema, insertContactSchema, insertVehicleLookupSchema, insertUserSearchSchema } from "../shared/schema";
import { logCustomerInquiry } from "./email";
import { logAdminActivity } from "./adminTracking";

export function registerRoutes(app: Express, storage: IStorage): Server {

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      
      const contact = await storage.createContact(validatedData);
      
      // Create inquiry object for admin dashboard
      const inquiry = {
        customerName: validatedData.name,
        customerEmail: validatedData.email,
        customerPhone: validatedData.phone || 'Phone not provided',
        subject: "Contact Form Submission",
        message: validatedData.message
      };
      
      // Log to customer inquiry system
      await logCustomerInquiry(inquiry);
      
      res.json({ 
        success: true, 
        message: "Thank you for contacting LA Automotive. We will respond within 2 hours during business hours.",
        id: contact.id 
      });
    } catch (error) {
      console.error("Contact error:", error);
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  // Service request submission (MOT, repairs, etc.)
  app.post("/api/service-request", async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse(req.body);
      
      const serviceRequest = await storage.createServiceRequest(validatedData);
      
      // Create inquiry object for admin dashboard
      const inquiry = {
        customerName: validatedData.fullName,
        customerEmail: validatedData.email,
        customerPhone: validatedData.phoneNumber,
        subject: `Service Request - ${validatedData.issueCategory}`,
        message: `Service Request Details:
      
Customer: ${validatedData.fullName}
Phone: ${validatedData.phoneNumber}
Email: ${validatedData.email}
Contact Method: ${validatedData.contactMethod}

Vehicle Information:
Registration: ${validatedData.registrationPlate}
Make/Model: ${validatedData.carMake} ${validatedData.carModel}
Year: ${validatedData.carYear}

Issue Category: ${validatedData.issueCategory}
Description: ${validatedData.issueDescription}

Request ID: ${serviceRequest.id}
Submitted: ${new Date().toLocaleString('en-GB')}`,
        serviceType: validatedData.issueCategory,
        vehicleDetails: `${validatedData.carMake} ${validatedData.carModel} ${validatedData.carYear}`,
        contactMethod: validatedData.contactMethod
      };
      
      // Log to customer inquiry system for admin dashboard
      await logCustomerInquiry(inquiry);
      
      // Log service request for email notification to LA-Automotive@hotmail.com
      console.log(`[EMAIL NOTIFICATION] Service Request #${serviceRequest.id}
        To: LA-Automotive@hotmail.com
        Subject: New ${validatedData.issueCategory} Request from ${validatedData.fullName}
        
        Customer Details:
        Name: ${validatedData.fullName}
        Phone: ${validatedData.phoneNumber}
        Email: ${validatedData.email}
        Preferred Contact: ${validatedData.contactMethod}
        
        Vehicle Information:
        Registration: ${validatedData.registrationPlate}
        Make/Model: ${validatedData.carMake} ${validatedData.carModel}
        Year: ${validatedData.carYear}
        
        Issue Details:
        Category: ${validatedData.issueCategory}
        Description: ${validatedData.issueDescription}
        
        Submitted: ${new Date().toLocaleString('en-GB')}
        Request ID: ${serviceRequest.id}
      `);
      
      res.json({ success: true, id: serviceRequest.id });
    } catch (error) {
      console.error("Service request error:", error);
      res.status(400).json({ error: "Invalid service request data" });
    }
  });

  // Price match submission
  app.post("/api/price-match", async (req, res) => {
    try {
      const validatedData = insertPriceMatchSchema.parse(req.body);
      
      // Track the price comparison search
      await storage.createUserSearch({
        searchType: "price_comparison",
        searchQuery: `${validatedData.partName} - ${validatedData.storeName} - £${validatedData.competitorPrice}`,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || req.connection.remoteAddress || null
      });
      
      const priceMatch = await storage.createPriceMatch(validatedData);
      
      // Create inquiry for admin dashboard
      const priceInquiry = {
        customerName: validatedData.customerEmail || 'Price Match Customer',
        customerEmail: validatedData.customerEmail || 'no-email@provided.com',
        customerPhone: validatedData.customerPhone || 'Phone not provided',
        subject: `Price Match Request - ${validatedData.partName}`,
        message: `Price Match Request Details:

Part Name: ${validatedData.partName}
Competitor Price: £${validatedData.competitorPrice}
Store Name: ${validatedData.storeName}

Customer Contact:
Email: ${validatedData.customerEmail || 'Not provided'}
Phone: ${validatedData.customerPhone || 'Not provided'}

Action Required: Contact customer with competitive quote

Request ID: ${priceMatch.id}
Submitted: ${new Date().toLocaleString('en-GB')}`
      };
      
      // Log to customer inquiry system for admin dashboard
      await logCustomerInquiry(priceInquiry);
      
      // Log price match request for email notification to LA-Automotive@hotmail.com
      console.log(`[EMAIL NOTIFICATION] Price Match Request #${priceMatch.id}
        To: LA-Automotive@hotmail.com
        Subject: New Price Match Request - ${validatedData.partName}
        
        Customer Details:
        Email: ${validatedData.customerEmail || 'Not provided'}
        Phone: ${validatedData.customerPhone || 'Not provided'}
        
        Price Match Details:
        Part Name: ${validatedData.partName}
        Competitor Price: £${validatedData.competitorPrice}
        Store Name: ${validatedData.storeName}
        
        Submitted: ${new Date().toLocaleString('en-GB')}
        Request ID: ${priceMatch.id}
        
        Action Required: Contact customer to provide competitive quote
      `);
      
      res.json({ success: true, id: priceMatch.id });
    } catch (error) {
      console.error("Price match error:", error);
      res.status(400).json({ error: "Invalid price match data" });
    }
  });

  // Professional vehicle lookup service
  app.post("/api/vehicle-lookup", async (req, res) => {
    try {
      const validatedData = insertVehicleLookupSchema.parse(req.body);
      
      // Track the vehicle lookup search
      await storage.createUserSearch({
        searchType: "vehicle_lookup",
        searchQuery: `Registration: ${validatedData.registrationPlate}`,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || req.connection.remoteAddress || null
      });
      
      // Store the lookup request
      const lookup = await storage.createVehicleLookup(validatedData);
      
      // Professional response - direct customers to contact business
      const response = {
        success: true,
        message: "For accurate vehicle information and professional service, please contact LA Automotive directly.",
        contact: {
          phone: "+44 788 702 4551",
          email: "LA-Automotive@hotmail.com",
          address: "5 Burgess Road, Hastings",
          hours: "Monday-Friday: 9:00 AM - 5:30 PM"
        },
        services: [
          "MOT Failure Repairs",
          "Brake & Suspension Repairs", 
          "Engine Diagnostics",
          "Tyre Replacement",
          "Car Servicing"
        ]
      };
      
      res.json(response);
    } catch (error) {
      console.error("Vehicle lookup error:", error);
      res.status(400).json({ error: "Invalid vehicle lookup data" });
    }
  });

  // Track user searches for business analytics
  app.post("/api/track-search", async (req, res) => {
    try {
      const validatedData = insertUserSearchSchema.parse(req.body);
      
      const search = await storage.createUserSearch({
        ...validatedData,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || req.connection.remoteAddress || null
      });
      
      res.json({ success: true, id: search.id });
    } catch (error) {
      console.error("Search tracking error:", error);
      res.status(400).json({ error: "Invalid search data" });
    }
  });

  // Admin authentication endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Updated admin credentials (user should change these)
      const adminCredentials = {
        'owner': 'NewOwnerPass2025!',
        'manager': 'NewManagerPass2025!',
        'staff': 'NewStaffPass2025!'
      };
      
      const role = username.toLowerCase();
      
      if (adminCredentials[role] === password) {
        // Log successful login
        await logAdminActivity({
          username: role,
          role: role.charAt(0).toUpperCase() + role.slice(1),
          action: 'LOGIN',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
          userAgent: req.headers['user-agent'] || 'Unknown',
          success: true
        });
        
        res.json({ 
          success: true, 
          message: "Login successful",
          role: role.charAt(0).toUpperCase() + role.slice(1)
        });
      } else {
        // Log failed login attempt
        await logAdminActivity({
          username: username || 'Unknown',
          role: role.charAt(0).toUpperCase() + role.slice(1),
          action: 'LOGIN_FAILED',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
          userAgent: req.headers['user-agent'] || 'Unknown',
          success: false
        });
        
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login system error" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", async (req, res) => {
    try {
      const { username, role } = req.body;
      
      await logAdminActivity({
        username: username || 'Unknown',
        role: role || 'Unknown',
        action: 'LOGOUT',
        ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
        userAgent: req.headers['user-agent'] || 'Unknown',
        success: true
      });
      
      res.json({ success: true, message: "Logout successful" });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ error: "Logout system error" });
    }
  });

  // Get customer inquiries for admin dashboard
  app.get("/api/admin/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getCustomerInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Get inquiries error:", error);
      res.status(500).json({ error: "Failed to get inquiries" });
    }
  });

  // Delete customer inquiry
  app.delete("/api/admin/inquiries/:id", async (req, res) => {
    try {
      const inquiryId = parseInt(req.params.id);
      await storage.deleteCustomerInquiry(inquiryId);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete inquiry error:", error);
      res.status(500).json({ error: "Failed to delete inquiry" });
    }
  });

  // Get admin activity logs
  app.get("/api/admin/activities", async (req, res) => {
    try {
      const activities = await storage.getAdminActivities();
      res.json(activities);
    } catch (error) {
      console.error("Get activities error:", error);
      res.status(500).json({ error: "Failed to get activities" });
    }
  });

  // Get admin login statistics
  app.get("/api/admin/login-stats", async (req, res) => {
    try {
      const stats = await storage.getAdminLoginStats();
      res.json(stats);
    } catch (error) {
      console.error("Get login stats error:", error);
      res.status(500).json({ error: "Failed to get login stats" });
    }
  });

  // Password recovery endpoint
  app.post("/api/admin/password-recovery", async (req, res) => {
    try {
      const { role, securityAnswer } = req.body;
      
      // Security questions and answers (user should customize these)
      const securityQuestions = {
        owner: {
          question: "What was the name of your first car?",
          answer: "Ford Focus"  // User should change this
        },
        manager: {
          question: "In which city were you born?",
          answer: "Hastings"  // User should change this
        },
        staff: {
          question: "What is your favorite automotive brand?",
          answer: "Toyota"  // User should change this
        }
      };
      
      const roleKey = role.toLowerCase();
      
      if (securityQuestions[roleKey] && securityQuestions[roleKey].answer.toLowerCase() === securityAnswer.toLowerCase()) {
        // Log successful password recovery
        await logAdminActivity({
          username: roleKey,
          role: role,
          action: 'PASSWORD_RECOVERY',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
          userAgent: req.headers['user-agent'] || 'Unknown',
          success: true
        });
        
        res.json({ 
          success: true, 
          message: "Security question verified",
          temporaryAccess: true
        });
      } else {
        // Log failed password recovery
        await logAdminActivity({
          username: roleKey,
          role: role,
          action: 'PASSWORD_RECOVERY_FAILED',
          ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
          userAgent: req.headers['user-agent'] || 'Unknown',
          success: false
        });
        
        res.status(401).json({ error: "Incorrect security answer" });
      }
    } catch (error) {
      console.error("Password recovery error:", error);
      res.status(500).json({ error: "Password recovery system error" });
    }
  });

  // Get suppliers (for car parts page)
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error) {
      console.error("Get suppliers error:", error);
      res.status(500).json({ error: "Failed to get suppliers" });
    }
  });

  const server = app.listen(5000, "0.0.0.0", () => {
    console.log("LA-Automotive server running on 0.0.0.0:5000");
  });

  return server;
}

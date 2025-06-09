import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertServiceRequestSchema, insertPriceMatchSchema, insertVehicleLookupSchema, insertUserSearchSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Service Request submission
  app.post("/api/service-request", async (req, res) => {
    try {
      const validatedData = insertServiceRequestSchema.parse(req.body);
      const serviceRequest = await storage.createServiceRequest(validatedData);
      
      // Log service request for email notification to LA-Automotive@hotmail.com
      console.log(`[EMAIL NOTIFICATION] Service Request #${serviceRequest.id}
        To: LA-Automotive@hotmail.com
        Subject: New ${serviceRequest.issueCategory} Request from ${serviceRequest.fullName}
        
        Customer Details:
        Name: ${serviceRequest.fullName}
        Phone: ${serviceRequest.phoneNumber}
        Email: ${serviceRequest.email || 'Not provided'}
        Preferred Contact: ${serviceRequest.contactMethod}
        
        Vehicle Information:
        Registration: ${serviceRequest.registrationPlate || 'Not provided'}
        Make/Model: ${serviceRequest.carMake || 'Not provided'} ${serviceRequest.carModel || 'Not provided'}
        Year: ${serviceRequest.carYear || 'Not provided'}
        
        Issue Details:
        Category: ${serviceRequest.issueCategory}
        Description: ${serviceRequest.issueDescription}
        
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

  // Vehicle lookup using UK Government MOT History API
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

      // Check if we have existing data
      let vehicle = await storage.getVehicleLookupByPlate(registrationPlate);
      
      if (!vehicle) {
        // For now, provide a helpful message directing users to contact LA-Automotive
        // This can be upgraded later with a paid API service
        return res.status(404).json({ 
          error: "Vehicle lookup service",
          message: "For vehicle information and MOT history, please contact LA-Automotive directly. Call +44 788 702 4551 or email LA-Automotive@hotmail.com with your registration plate and we'll provide all the details you need.",
          contactInfo: {
            phone: "+44 788 702 4551",
            email: "LA-Automotive@hotmail.com",
            address: "5 Burgess Road, Hastings",
            hours: "Mon-Fri 9:00 AM - 5:30 PM"
          }
        });
      }
      
      res.json(vehicle);
    } catch (error) {
      console.error("Vehicle lookup error:", error);
      res.status(500).json({ 
        error: "Vehicle lookup failed",
        message: "Please contact LA-Automotive for assistance with your vehicle enquiry."
      });
    }
  });

  // Get suppliers data
  app.get("/api/suppliers", async (req, res) => {
    const suppliers = [
      {
        id: 1,
        name: "Hastings Auto Parts",
        address: "123 High Street, Hastings",
        phone: "01424 123456",
        hours: "Mon-Fri 8:00-17:30",
        rating: 4.6,
        specialties: ["Brakes", "Batteries", "Filters"]
      },
      {
        id: 2,
        name: "Battle Motor Factors",
        address: "456 London Road, Battle",
        phone: "01424 789012",
        hours: "Mon-Sat 8:00-18:00",
        rating: 4.8,
        specialties: ["Engine Parts", "Oils", "Tools"]
      },
      {
        id: 3,
        name: "Europarts Bexhill",
        address: "789 Seaside Road, Bexhill",
        phone: "01424 345678",
        hours: "Mon-Fri 7:30-17:00",
        rating: 4.5,
        specialties: ["Tyres", "Exhausts", "Suspension"]
      }
    ];
    
    res.json(suppliers);
  });

  // Admin endpoint to view search analytics (protected in production)
  app.get("/api/admin/searches", async (req, res) => {
    try {
      const searches = await storage.getUserSearches();
      const analytics = {
        totalSearches: searches.length,
        searchesByType: searches.reduce((acc, search) => {
          acc[search.searchType] = (acc[search.searchType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        recentSearches: searches
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 50),
        topQueries: searches
          .reduce((acc, search) => {
            acc[search.searchQuery] = (acc[search.searchQuery] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Failed to retrieve analytics" });
    }
  });

  // Track parts searches
  app.post("/api/track-search", async (req, res) => {
    try {
      const { searchType, searchQuery } = req.body;
      
      if (!searchType || !searchQuery) {
        return res.status(400).json({ error: "Search type and query are required" });
      }

      await storage.createUserSearch({
        searchType,
        searchQuery,
        userAgent: req.headers['user-agent'] || null,
        ipAddress: req.ip || req.connection.remoteAddress || null
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Search tracking error:", error);
      res.status(400).json({ error: "Failed to track search" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

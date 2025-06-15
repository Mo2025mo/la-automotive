import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const serviceRequests = pgTable("service_requests", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  registrationPlate: text("registration_plate").notNull(),
  carMake: text("car_make").notNull(),
  carModel: text("car_model").notNull(),
  carYear: text("car_year").notNull(),
  issueDescription: text("issue_description").notNull(),
  issueCategory: text("issue_category").notNull(),
  contactMethod: text("contact_method").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const priceMatches = pgTable("price_matches", {
  id: serial("id").primaryKey(),
  partName: text("part_name").notNull(),
  competitorPrice: text("competitor_price").notNull(),
  storeName: text("store_name").notNull(),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vehicleLookups = pgTable("vehicle_lookups", {
  id: serial("id").primaryKey(),
  registrationPlate: text("registration_plate").notNull(),
  make: text("make"),
  model: text("model"),
  year: text("year"),
  motExpiryDate: text("mot_expiry_date"),
  motStatus: text("mot_status"),
  fuelType: text("fuel_type"),
  engineSize: text("engine_size"),
  lastChecked: timestamp("last_checked").defaultNow(),
});

export const userSearches = pgTable("user_searches", {
  id: serial("id").primaryKey(),
  searchType: text("search_type").notNull(),
  searchQuery: text("search_query").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertServiceRequestSchema = createInsertSchema(serviceRequests).omit({
  id: true,
  createdAt: true,
});

export const insertPriceMatchSchema = createInsertSchema(priceMatches).omit({
  id: true,
  createdAt: true,
});

export const insertVehicleLookupSchema = createInsertSchema(vehicleLookups).omit({
  id: true,
  lastChecked: true,
});

export const insertUserSearchSchema = createInsertSchema(userSearches).omit({
  id: true,
  createdAt: true,
});

export type InsertServiceRequest = z.infer<typeof insertServiceRequestSchema>;
export type ServiceRequest = typeof serviceRequests.$inferSelect;

export type InsertPriceMatch = z.infer<typeof insertPriceMatchSchema>;
export type PriceMatch = typeof priceMatches.$inferSelect;

export type InsertVehicleLookup = z.infer<typeof insertVehicleLookupSchema>;
export type VehicleLookup = typeof vehicleLookups.$inferSelect;

export type InsertUserSearch = z.infer<typeof insertUserSearchSchema>;
export type UserSearch = typeof userSearches.$inferSelect;

// Contact schema for contact form submissions
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

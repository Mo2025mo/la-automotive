import { 
  serviceRequests, 
  priceMatches, 
  vehicleLookups,
  userSearches,
  type ServiceRequest, 
  type InsertServiceRequest,
  type PriceMatch,
  type InsertPriceMatch,
  type VehicleLookup,
  type InsertVehicleLookup,
  type UserSearch,
  type InsertUserSearch
} from "@shared/schema";

export interface IStorage {
  // Service Requests
  createServiceRequest(request: InsertServiceRequest): Promise<ServiceRequest>;
  getServiceRequests(): Promise<ServiceRequest[]>;
  
  // Price Matches
  createPriceMatch(priceMatch: InsertPriceMatch): Promise<PriceMatch>;
  getPriceMatches(): Promise<PriceMatch[]>;
  
  // Vehicle Lookups
  createVehicleLookup(lookup: InsertVehicleLookup): Promise<VehicleLookup>;
  getVehicleLookupByPlate(plate: string): Promise<VehicleLookup | undefined>;
  
  // User Searches
  createUserSearch(search: InsertUserSearch): Promise<UserSearch>;
  getUserSearches(): Promise<UserSearch[]>;
}

export class MemStorage implements IStorage {
  private serviceRequests: Map<number, ServiceRequest>;
  private priceMatches: Map<number, PriceMatch>;
  private vehicleLookups: Map<string, VehicleLookup>;
  private userSearches: Map<number, UserSearch>;
  private currentServiceRequestId: number;
  private currentPriceMatchId: number;
  private currentVehicleLookupId: number;
  private currentUserSearchId: number;

  constructor() {
    this.serviceRequests = new Map();
    this.priceMatches = new Map();
    this.vehicleLookups = new Map();
    this.userSearches = new Map();
    this.currentServiceRequestId = 1;
    this.currentPriceMatchId = 1;
    this.currentVehicleLookupId = 1;
    this.currentUserSearchId = 1;
  }

  async createServiceRequest(insertRequest: InsertServiceRequest): Promise<ServiceRequest> {
    const id = this.currentServiceRequestId++;
    const serviceRequest: ServiceRequest = { 
      ...insertRequest,
      registrationPlate: insertRequest.registrationPlate || null,
      carMake: insertRequest.carMake || null,
      carModel: insertRequest.carModel || null,
      carYear: insertRequest.carYear || null,
      contactMethod: insertRequest.contactMethod || null,
      id,
      createdAt: new Date()
    };
    this.serviceRequests.set(id, serviceRequest);
    return serviceRequest;
  }

  async getServiceRequests(): Promise<ServiceRequest[]> {
    return Array.from(this.serviceRequests.values());
  }

  async createPriceMatch(insertPriceMatch: InsertPriceMatch): Promise<PriceMatch> {
    const id = this.currentPriceMatchId++;
    const priceMatch: PriceMatch = { 
      ...insertPriceMatch,
      customerEmail: insertPriceMatch.customerEmail || null,
      customerPhone: insertPriceMatch.customerPhone || null,
      id,
      createdAt: new Date()
    };
    this.priceMatches.set(id, priceMatch);
    return priceMatch;
  }

  async getPriceMatches(): Promise<PriceMatch[]> {
    return Array.from(this.priceMatches.values());
  }

  async createVehicleLookup(insertLookup: InsertVehicleLookup): Promise<VehicleLookup> {
    const id = this.currentVehicleLookupId++;
    const vehicleLookup: VehicleLookup = { 
      id,
      registrationPlate: insertLookup.registrationPlate,
      make: insertLookup.make || null,
      model: insertLookup.model || null,
      year: insertLookup.year || null,
      motExpiryDate: insertLookup.motExpiryDate || null,
      motStatus: insertLookup.motStatus || null,
      fuelType: insertLookup.fuelType || null,
      engineSize: insertLookup.engineSize || null,
      lastChecked: new Date()
    };
    this.vehicleLookups.set(insertLookup.registrationPlate, vehicleLookup);
    return vehicleLookup;
  }

  async getVehicleLookupByPlate(plate: string): Promise<VehicleLookup | undefined> {
    return this.vehicleLookups.get(plate);
  }

  async createUserSearch(insertSearch: InsertUserSearch): Promise<UserSearch> {
    const id = this.currentUserSearchId++;
    const userSearch: UserSearch = {
      ...insertSearch,
      userAgent: insertSearch.userAgent || null,
      ipAddress: insertSearch.ipAddress || null,
      id,
      createdAt: new Date()
    };
    this.userSearches.set(id, userSearch);
    return userSearch;
  }

  async getUserSearches(): Promise<UserSearch[]> {
    return Array.from(this.userSearches.values());
  }
}

export const storage = new MemStorage();

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { validateUKRegistration, formatUKRegistration } from "@/lib/ukValidation";
import { useToast } from "@/hooks/use-toast";
import type { InsertVehicleLookup, VehicleLookup } from "@shared/schema";

export default function Hero() {
  // Force browser refresh to show updated content
  const [regPlate, setRegPlate] = useState("");
  const [regPlateError, setRegPlateError] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const vehicleLookupMutation = useMutation({
    mutationFn: async (plate: string) => {
      const lookupData = {
        registrationPlate: plate,
        make: "Unknown",
        model: "Unknown", 
        year: new Date().getFullYear().toString(),
        fuelType: "Unknown",
        engineSize: "Unknown"
      };

      const response = await fetch("/api/vehicle-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lookupData),
      });
      
      if (!response.ok) throw new Error("Failed to lookup vehicle");
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Vehicle Found!",
        description: `${data.make || "Unknown"} ${data.model || "Vehicle"} (${data.year || "Unknown"})`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicle-lookup"] });
    },
    onError: () => {
      toast({
        title: "Lookup Failed",
        description: "Could not find vehicle details. Please check the registration plate.",
        variant: "destructive",
      });
    },
  });

  const handleRegPlateChange = (value: string) => {
    const formatted = formatUKRegistration(value);
    setRegPlate(formatted);
    setRegPlateError("");
  };

  const handleVehicleSearch = () => {
    if (!regPlate.trim()) {
      setRegPlateError("Please enter a registration plate");
      return;
    }

    if (!validateUKRegistration(regPlate)) {
      setRegPlateError("Please enter a valid UK registration plate (e.g., AB12 CDE)");
      return;
    }

    vehicleLookupMutation.mutate(regPlate);
  };

  return (
    <div style={{
      backgroundColor: '#1D4ED8',
      minHeight: '100vh',
      padding: '80px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      {/* Main Heading */}
      <h1 style={{
        color: 'white',
        fontSize: '3.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '2rem',
        lineHeight: '1.2',
        maxWidth: '1000px'
      }}>
        Complete Automotive Services - Expert <span style={{color: '#FB923C'}}>Car Repairs & MOT Failure Fixes</span> in Hastings
      </h1>
      
      {/* Description */}
      <p style={{
        color: 'white',
        fontSize: '1.25rem',
        textAlign: 'center',
        marginBottom: '3rem',
        maxWidth: '800px',
        lineHeight: '1.6'
      }}>
        Professional garage offering complete automotive services in Hastings. Car repairs, MOT failure fixes, bodywork, engine diagnostics, brake services, clutch repairs, and more. Same-day service available at 5 Burgess Road, East Sussex.
      </p>
      
      {/* Vehicle Lookup Form */}
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        marginBottom: '3rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h3 style={{
          color: 'black',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Quick Vehicle Lookup
        </h3>
        
        <input
          type="text"
          placeholder="Enter reg plate (e.g. AB12 CDE)"
          value={regPlate}
          onChange={(e) => handleRegPlateChange(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            border: regPlateError ? '2px solid #EF4444' : '1px solid #D1D5DB',
            borderRadius: '8px',
            marginBottom: '1rem',
            boxSizing: 'border-box'
          }}
        />
        
        {regPlateError && (
          <p style={{color: '#EF4444', fontSize: '0.875rem', marginBottom: '1rem'}}>
            {regPlateError}
          </p>
        )}
        
        <button
          onClick={handleVehicleSearch}
          disabled={vehicleLookupMutation.isPending}
          style={{
            width: '100%',
            backgroundColor: '#EA580C',
            color: 'white',
            padding: '1rem',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: vehicleLookupMutation.isPending ? 'not-allowed' : 'pointer',
            opacity: vehicleLookupMutation.isPending ? 0.7 : 1
          }}
        >
          {vehicleLookupMutation.isPending ? "Searching..." : "Search"}
        </button>
      </div>
      
      {/* Garage Image */}
      <div style={{textAlign: 'center', marginTop: '2rem'}}>
        <img 
          src="https://images.unsplash.com/photo-1632823469322-6cb28446e204?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt=""
          style={{
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />
      </div>
      
    </div>
  );
}
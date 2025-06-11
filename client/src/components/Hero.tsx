import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { validateUKRegistration } from "@/lib/ukValidation";

export default function Hero() {
  const [regPlate, setRegPlate] = useState("");
  const [regPlateError, setRegPlateError] = useState("");
  const { toast } = useToast();

  const vehicleLookupMutation = useMutation({
    mutationFn: async (registrationPlate: string) => {
      const response = await apiRequest('POST', '/api/vehicle-lookup', { registrationPlate });
      return response.json();
    },
    onSuccess: (data) => {
      const motStatus = data.motStatus === 'PASSED' ? 'Valid' : data.motStatus || 'Unknown';
      const expiryText = data.motExpiryDate ? `MOT expires: ${data.motExpiryDate}` : 'MOT status unknown';
      
      toast({
        title: "Vehicle Found",
        description: `${data.make} ${data.model} (${data.year}) - ${expiryText} - Status: ${motStatus}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Contact for Vehicle Information", 
        description: "Call +44 788 702 4551 or email LA-Automotive@hotmail.com for vehicle details and MOT history.",
        duration: 6000,
      });
    },
  });

  const handleRegPlateChange = (value: string) => {
    const formatted = value.toUpperCase().replace(/\s+/g, ' ').trim();
    setRegPlate(formatted);
    
    if (formatted && !validateUKRegistration(formatted)) {
      setRegPlateError("Please enter a valid UK registration plate");
    } else {
      setRegPlateError("");
    }
  };

  const handleVehicleSearch = () => {
    if (!regPlate) {
      setRegPlateError("Please enter a registration plate");
      return;
    }
    
    if (!validateUKRegistration(regPlate)) {
      setRegPlateError("Please enter a valid UK registration plate");
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
      
      <h1 style={{
        color: 'white',
        fontSize: '3.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '2rem',
        lineHeight: '1.2',
        maxWidth: '1000px'
      }}>
        Expert <span style={{color: '#FB923C'}}>MOT Failure Repairs</span> in Hastings
      </h1>
      
      <p style={{
        color: 'white',
        fontSize: '1.25rem',
        textAlign: 'center',
        marginBottom: '3rem',
        maxWidth: '800px',
        lineHeight: '1.6'
      }}>
        Professional MOT failure repairs, engine diagnostics, brake services, and bodywork repairs. Same-day service available at 5 Burgess Road.
      </p>
      
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
          Vehicle Lookup
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

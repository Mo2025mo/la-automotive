import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      if (error?.contactInfo) {
        toast({
          title: "Contact LA-Automotive for Vehicle Info",
          description: `Call ${error.contactInfo.phone} or email ${error.contactInfo.email} with your registration plate for complete vehicle details and MOT history.`,
          duration: 8000,
        });
      } else {
        toast({
          title: "Contact for Vehicle Information", 
          description: "Call +44 788 702 4551 or email LA-Automotive@hotmail.com for vehicle details and MOT history.",
          duration: 6000,
        });
      }
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
    <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Expert <span className="text-orange-400">MOT Failure Repairs</span> in Hastings
              </h1>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Professional MOT failure repairs, engine diagnostics, brake services, and bodywork repairs. Same-day service available at 5 Burgess Road.
              </p>
            </div>
            
            <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg max-w-md">
              <h3 className="font-semibold mb-4 flex items-center text-lg">
                🔍 Quick Vehicle Lookup
              </h3>
              <div className="space-y-3">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter reg plate (e.g. AB12 CDE)"
                    value={regPlate}
                    onChange={(e) => handleRegPlateChange(e.target.value)}
                    className={`w-full ${regPlateError ? 'border-red-500' : ''}`}
                  />
                  {regPlateError && (
                    <p className="text-red-500 text-sm mt-1">{regPlateError}</p>
                  )}
                </div>
                <Button 
                  onClick={handleVehicleSearch}
                  disabled={vehicleLookupMutation.isPending}
                  className="w-full auto-orange hover-auto-orange"
                >
                  {vehicleLookupMutation.isPending ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative flex justify-center">
            <div className="relative max-w-lg">
              <img 
                src="https://images.unsplash.com/photo-1632823469322-6cb28446e204?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Professional automotive garage" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
              <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg text-gray-900">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="font-semibold">4.8/5 Rating</span>
                </div>
                <p className="text-sm text-gray-600">500+ Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

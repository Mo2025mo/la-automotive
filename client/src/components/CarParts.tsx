import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function CarParts() {
  const [priceMatchData, setPriceMatchData] = useState({
    partName: "",
    competitorPrice: "",
    storeName: "",
    customerEmail: "",
    customerPhone: ""
  });
  const { toast } = useToast();

  const priceMatchMutation = useMutation({
    mutationFn: async (data: typeof priceMatchData) => {
      const response = await apiRequest('POST', '/api/price-match', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Price Match Request Submitted",
        description: "We'll get back to you within 2 hours during business hours.",
      });
      setPriceMatchData({ 
        partName: "", 
        competitorPrice: "", 
        storeName: "",
        customerEmail: "",
        customerPhone: ""
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly at +44 788 702 4551.",
        variant: "destructive",
      });
    },
  });

  const trackSearchMutation = useMutation({
    mutationFn: async (data: { searchType: string; searchQuery: string }) => {
      const response = await apiRequest('POST', '/api/track-search', data);
      return response.json();
    },
  });

  const handlePriceMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!priceMatchData.partName || !priceMatchData.competitorPrice || !priceMatchData.storeName) {
      toast({
        title: "Missing Information",
        description: "Please fill in part name, competitor price, and store name.",
        variant: "destructive",
      });
      return;
    }
    priceMatchMutation.mutate(priceMatchData);
  };

  const handlePartsSearch = () => {
    trackSearchMutation.mutate({
      searchType: "parts_search",
      searchQuery: "Generic parts search - Find Compatible Parts"
    });
    toast({
      title: "Parts Search",
      description: "Searching for compatible parts...",
    });
  };

  const handleCategoryClick = (categoryName: string) => {
    trackSearchMutation.mutate({
      searchType: "parts_category",
      searchQuery: `Category: ${categoryName}`
    });
    toast({
      title: "Category Selected",
      description: `Browsing ${categoryName} category...`,
    });
  };

  const partCategories = [
    { name: "Brake Components", count: "450+ parts", icon: "fas fa-car-crash" },
    { name: "Engine Parts", count: "320+ parts", icon: "fas fa-cogs" },
    { name: "Suspension", count: "280+ parts", icon: "fas fa-car-side" },
    { name: "Electrical", count: "180+ parts", icon: "fas fa-bolt" },
    { name: "Filters & Fluids", count: "150+ parts", icon: "fas fa-tint" },
    { name: "Tyres & Wheels", count: "120+ parts", icon: "fas fa-circle" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Car Parts & Components
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quality replacement parts from trusted suppliers. Can't find what you need? 
            Submit a price comparison and we'll beat any genuine quote.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Parts Categories */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <i className="fas fa-wrench text-blue-600 mr-2"></i>
                Browse Parts by Category
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {partCategories.map((category, index) => (
                  <div 
                    key={index}
                    onClick={() => handleCategoryClick(category.name)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <i className={category.icon}></i>
                      </div>
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.count}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={handlePartsSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  <i className="fas fa-search mr-2"></i>
                  Find Compatible Parts
                </Button>
              </div>
            </div>
          </div>
          
          {/* Price Comparison Tool */}
          <div className="bg-white p-6 rounded-xl shadow-lg h-fit">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <i className="fas fa-pound-sign text-green-600 mr-2"></i>
              Price Comparison
            </h3>
            <p className="text-gray-600 mb-4">Found a better price elsewhere? Submit it and we'll try to match it!</p>
            
            <form onSubmit={handlePriceMatchSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Part name/number *"
                value={priceMatchData.partName}
                onChange={(e) => setPriceMatchData({...priceMatchData, partName: e.target.value})}
                required
              />
              <Input
                type="text"
                placeholder="Competitor price (£) *"
                value={priceMatchData.competitorPrice}
                onChange={(e) => setPriceMatchData({...priceMatchData, competitorPrice: e.target.value})}
                required
              />
              <Input
                type="text"
                placeholder="Store/website name *"
                value={priceMatchData.storeName}
                onChange={(e) => setPriceMatchData({...priceMatchData, storeName: e.target.value})}
                required
              />
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Contact Details (Optional)</p>
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={priceMatchData.customerEmail}
                  onChange={(e) => setPriceMatchData({...priceMatchData, customerEmail: e.target.value})}
                />
                <Input
                  type="tel"
                  placeholder="Your phone number"
                  value={priceMatchData.customerPhone}
                  onChange={(e) => setPriceMatchData({...priceMatchData, customerPhone: e.target.value})}
                  className="mt-2"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={priceMatchMutation.isPending}
              >
                {priceMatchMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-paper-plane mr-2"></i>
                )}
                Submit Price Match Request
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <i className="fas fa-info-circle mr-2"></i>
                We aim to respond within 2 hours during business hours
              </p>
              <p className="text-xs text-green-700 mt-1">
                Call directly: +44 788 702 4551 for urgent requests
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            <i className="fas fa-phone-alt mr-2"></i>
            Need Parts Urgently?
          </h3>
          <p className="text-red-700 mb-4">
            For same-day parts sourcing and emergency repairs, call us directly
          </p>
          <div className="space-y-2">
            <p className="text-lg font-bold text-red-800">+44 788 702 4551</p>
            <p className="text-sm text-red-600">Monday-Friday: 9:00 AM - 5:30 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
}

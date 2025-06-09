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
    storeName: ""
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
      setPriceMatchData({ partName: "", competitorPrice: "", storeName: "" });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
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
        description: "Please fill in all required fields.",
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
    { icon: "fas fa-car-battery", name: "Batteries", count: "120+ items", color: "auto-blue", hoverColor: "hover:border-blue-600 hover:bg-blue-50" },
    { icon: "fas fa-filter", name: "Filters", count: "350+ items", color: "auto-orange", hoverColor: "hover:border-orange-600 hover:bg-orange-50" },
    { icon: "fas fa-circle", name: "Brake Pads", count: "280+ items", color: "auto-green", hoverColor: "hover:border-green-600 hover:bg-green-50" },
    { icon: "fas fa-lightbulb", name: "Bulbs", count: "90+ items", color: "bg-purple-600", hoverColor: "hover:border-purple-600 hover:bg-purple-50" }
  ];

  return (
    <section id="parts" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Car Parts & Components in Hastings</h2>
          <p className="text-xl text-gray-600">Genuine and aftermarket car parts with competitive price matching. Local delivery available across Hastings and East Sussex.</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Parts Search */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
              <h3 className="text-xl font-semibold mb-4">Search Parts by Vehicle</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ford">Ford</SelectItem>
                    <SelectItem value="vauxhall">Vauxhall</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="audi">Audi</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="focus">Focus</SelectItem>
                    <SelectItem value="fiesta">Fiesta</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full mt-4 auto-blue hover-auto-blue" onClick={handlePartsSearch}>
                <i className="fas fa-search mr-2"></i>Find Compatible Parts
              </Button>
            </div>
            
            {/* Parts Categories */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Browse by Category</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {partCategories.map((category, index) => (
                  <div key={index} onClick={() => handleCategoryClick(category.name)} className={`flex items-center p-4 border border-gray-200 rounded-lg ${category.hoverColor} cursor-pointer transition-colors`}>
                    <div className={`w-10 h-10 ${category.color} text-white rounded-lg flex items-center justify-center mr-4`}>
                      <i className={category.icon}></i>
                    </div>
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.count}</p>
                    </div>
                  </div>
                ))}
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
                placeholder="Part name/number"
                value={priceMatchData.partName}
                onChange={(e) => setPriceMatchData({...priceMatchData, partName: e.target.value})}
              />
              <Input
                type="text"
                placeholder="Competitor price (£)"
                value={priceMatchData.competitorPrice}
                onChange={(e) => setPriceMatchData({...priceMatchData, competitorPrice: e.target.value})}
              />
              <Input
                type="text"
                placeholder="Store/website name"
                value={priceMatchData.storeName}
                onChange={(e) => setPriceMatchData({...priceMatchData, storeName: e.target.value})}
              />
              <Button 
                type="submit" 
                className="w-full auto-green hover-auto-green"
                disabled={priceMatchMutation.isPending}
              >
                {priceMatchMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : null}
                Submit Price Match
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <i className="fas fa-info-circle mr-2"></i>
                We aim to respond within 2 hours during business hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

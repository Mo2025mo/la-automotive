import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MOTTracking() {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    registrationPlate: "",
    carMake: "",
    carModel: "",
    carYear: "",
    issueDescription: "",
    contactMethod: "phone"
  });
  const { toast } = useToast();

  const serviceRequestMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/service-request', {
        ...data,
        issueCategory: "MOT Failure Repair"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quote Request Submitted",
        description: "We'll contact you within 2 hours during business hours with your MOT repair quote.",
      });
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        registrationPlate: "",
        carMake: "",
        carModel: "",
        carYear: "",
        issueDescription: "",
        contactMethod: "phone"
      });
      setShowQuoteForm(false);
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or call us directly at +44 788 702 4551",
        variant: "destructive",
      });
    },
  });

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber || !formData.issueDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, phone number, and describe the MOT failure.",
        variant: "destructive",
      });
      return;
    }
    serviceRequestMutation.mutate(formData);
  };

  const handleEmergencyCall = () => {
    window.location.href = "tel:00447887024551";
  };
  return (
    <section id="mot" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">MOT Failure Repairs in Hastings</h2>
            <p className="text-xl text-gray-600 mb-8">
              Expert MOT failure repairs at 5 Burgess Road, Hastings. Same-day diagnosis and competitive repair quotes. Professional service for brake failures, tyre issues, light faults, and emission problems.
            </p>
            
            <div className="space-y-4">
              {[
                "Same-day MOT failure diagnosis",
                "Competitive repair quotes", 
                "Quality parts and workmanship",
                "Fast turnaround times"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 auto-green rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl">
            <h3 className="text-xl font-semibold mb-6">MOT Failure Repair Quote</h3>
            
            {/* MOT Failure Example */}
            <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Common MOT Failures</h4>
                  <p className="text-sm text-gray-600">We repair all types of MOT failures</p>
                </div>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">Repair Service</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Brake Pad Replacement</span>
                  <span className="font-medium">From £45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tyre Replacement</span>
                  <span className="font-medium">From £35</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Light Bulb Replacement</span>
                  <span className="font-medium">From £5</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowQuoteForm(true)}
              className="w-full auto-orange hover-auto-orange text-white py-3 rounded-lg font-medium transition-colors mb-4"
            >
              <i className="fas fa-wrench mr-2"></i>Get MOT Repair Quote
            </button>
            
            <button 
              onClick={handleEmergencyCall}
              className="w-full border border-orange-600 text-orange-600 hover:bg-orange-50 py-3 rounded-lg font-medium transition-colors"
            >
              <i className="fas fa-phone mr-2"></i>Call for Emergency Repair
            </button>
          </div>
        </div>
      </div>

      {/* MOT Repair Quote Form Modal */}
      <Dialog open={showQuoteForm} onOpenChange={setShowQuoteForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 auto-orange text-white rounded-lg flex items-center justify-center">
                <i className="fas fa-wrench text-lg"></i>
              </div>
              <span>MOT Failure Repair Quote</span>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitQuote} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="Your phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your.email@example.com"
              />
            </div>

            {/* Vehicle Information */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Vehicle Information</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Plate</label>
                  <Input
                    value={formData.registrationPlate}
                    onChange={(e) => setFormData({...formData, registrationPlate: e.target.value.toUpperCase()})}
                    placeholder="AB12 CDE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Car Make</label>
                  <Input
                    value={formData.carMake}
                    onChange={(e) => setFormData({...formData, carMake: e.target.value})}
                    placeholder="e.g. Ford, BMW, Audi"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <Input
                    value={formData.carModel}
                    onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                    placeholder="e.g. Focus, A4, 3 Series"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <Input
                    value={formData.carYear}
                    onChange={(e) => setFormData({...formData, carYear: e.target.value})}
                    placeholder="e.g. 2018"
                  />
                </div>
              </div>
            </div>

            {/* MOT Failure Details */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">MOT Failure Details</h4>
              <div>
                <label className="block text-sm font-medium mb-2">Describe the MOT failure(s) *</label>
                <Textarea
                  value={formData.issueDescription}
                  onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
                  placeholder="Please describe what failed the MOT test - e.g. brake pads worn, headlight bulb out, tyre tread depth, etc."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Contact Preference */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium mb-2">How would you like us to contact you?</label>
              <Select value={formData.contactMethod} onValueChange={(value) => setFormData({...formData, contactMethod: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contact method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <Button
                type="submit"
                disabled={serviceRequestMutation.isPending}
                className="flex-1 auto-orange hover-auto-orange"
              >
                {serviceRequestMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Get Quote
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuoteForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <i className="fas fa-info-circle mr-2"></i>
                We'll provide your quote within 2 hours during business hours (Mon-Fri 9AM-5:30PM). 
                For urgent repairs, call us directly at +44 788 702 4551.
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

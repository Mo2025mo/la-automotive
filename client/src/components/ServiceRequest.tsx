import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { validateUKRegistration } from "@/lib/ukValidation";

export default function ServiceRequest() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    registrationPlate: "",
    carMake: "",
    carModel: "",
    carYear: "",
    issueCategory: "",
    issueDescription: "",
    contactMethod: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const serviceRequestMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/service-request', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service Request Submitted",
        description: "Thank you! We will contact you within 2 hours during business hours.",
      });
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        registrationPlate: "",
        carMake: "",
        carModel: "",
        carYear: "",
        issueCategory: "",
        issueDescription: "",
        contactMethod: ""
      });
      setErrors({});
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please check all fields and try again.",
        variant: "destructive",
      });
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.issueCategory) newErrors.issueCategory = "Please select an issue category";
    if (!formData.issueDescription.trim()) newErrors.issueDescription = "Please describe the issue";

    if (formData.registrationPlate && !validateUKRegistration(formData.registrationPlate)) {
      newErrors.registrationPlate = "Please enter a valid UK registration plate";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      serviceRequestMutation.mutate(formData);
    }
  };

  const issueCategories = [
    { value: "engine", label: "Engine Problems", description: "Starting, running, performance" },
    { value: "brakes", label: "Brakes", description: "Pads, discs, fluid" },
    { value: "electrical", label: "Electrical", description: "Lights, battery, alternator" },
    { value: "suspension", label: "Suspension", description: "Shocks, springs, handling" },
    { value: "mot_failure", label: "MOT Failure Repair", description: "Failed MOT repair services" },
    { value: "bodywork", label: "Bodywork", description: "Panel repairs, paint, dents" },
    { value: "other", label: "Other", description: "Describe below" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Service</h2>
          <p className="text-xl text-gray-600">Tell us about your car issue and we'll get back to you with a quote</p>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="Enter your full name"
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  placeholder="Enter your phone number"
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter your email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Plate</label>
                <Input
                  type="text"
                  value={formData.registrationPlate}
                  onChange={(e) => setFormData({...formData, registrationPlate: e.target.value.toUpperCase()})}
                  placeholder="e.g. AB12 CDE"
                  className={errors.registrationPlate ? 'border-red-500' : ''}
                />
                {errors.registrationPlate && <p className="text-red-500 text-sm mt-1">{errors.registrationPlate}</p>}
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Car Make</label>
                <Select value={formData.carMake} onValueChange={(value) => setFormData({...formData, carMake: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ford">Ford</SelectItem>
                    <SelectItem value="vauxhall">Vauxhall</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="audi">Audi</SelectItem>
                    <SelectItem value="volkswagen">Volkswagen</SelectItem>
                    <SelectItem value="mercedes">Mercedes</SelectItem>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="nissan">Nissan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <Input
                  type="text"
                  value={formData.carModel}
                  onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                  placeholder="e.g. Focus, Golf"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <Select value={formData.carYear} onValueChange={(value) => setFormData({...formData, carYear: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                    <SelectItem value="2018">2018</SelectItem>
                    <SelectItem value="older">Older</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Issue Category *</label>
              <div className="grid md:grid-cols-3 gap-4">
                {issueCategories.map((category) => (
                  <label key={category.value} className={`flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-600 ${formData.issueCategory === category.value ? 'border-blue-600 bg-blue-50' : ''}`}>
                    <input
                      type="radio"
                      name="issue_category"
                      value={category.value}
                      checked={formData.issueCategory === category.value}
                      onChange={(e) => setFormData({...formData, issueCategory: e.target.value})}
                      className="mr-3 text-blue-600"
                    />
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-sm text-gray-600">{category.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.issueCategory && <p className="text-red-500 text-sm mt-1">{errors.issueCategory}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Describe the Issue *</label>
              <Textarea
                rows={4}
                value={formData.issueDescription}
                onChange={(e) => setFormData({...formData, issueDescription: e.target.value})}
                placeholder="Please describe the symptoms, when they occur, and any other relevant details..."
                className={errors.issueDescription ? 'border-red-500' : ''}
              />
              {errors.issueDescription && <p className="text-red-500 text-sm mt-1">{errors.issueDescription}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
              <div className="flex space-x-6">
                {["phone", "email", "text"].map((method) => (
                  <label key={method} className="flex items-center">
                    <input
                      type="radio"
                      name="contact_method"
                      value={method}
                      checked={formData.contactMethod === method}
                      onChange={(e) => setFormData({...formData, contactMethod: e.target.value})}
                      className="mr-2 text-blue-600"
                    />
                    <span className="capitalize">{method === "text" ? "Text Message" : method === "phone" ? "Phone Call" : "Email"}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full auto-orange hover-auto-orange py-4 text-lg font-semibold"
              disabled={serviceRequestMutation.isPending}
            >
              {serviceRequestMutation.isPending ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <i className="fas fa-paper-plane mr-2"></i>
              )}
              Submit Service Request
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

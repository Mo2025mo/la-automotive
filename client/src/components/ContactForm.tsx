import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    serviceType: '',
    vehicleDetails: ''
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error("Failed to submit contact form");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting LA Automotive. We will respond within 2 hours.",
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        serviceType: '',
        vehicleDetails: ''
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or call +44 788 702 4551 directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Required Fields",
        description: "Please fill in name, email, and message.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{
        color: '#1D4ED8',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        Contact LA Automotive
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Service Type (Optional)
          </label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select a service</option>
            <option value="MOT Failure Repair">MOT Failure Repair</option>
            <option value="Brake Service">Brake Service</option>
            <option value="Engine Diagnostics">Engine Diagnostics</option>
            <option value="Clutch Repair">Clutch Repair</option>
            <option value="Bodywork Repair">Bodywork Repair</option>
            <option value="Exhaust Repair">Exhaust Repair</option>
            <option value="General Repair">General Repair</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Vehicle Details (Optional)
          </label>
          <input
            type="text"
            name="vehicleDetails"
            value={formData.vehicleDetails}
            onChange={handleChange}
            placeholder="e.g., 2018 Ford Focus, AB12 CDE"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Tell us about your automotive needs..."
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '1rem',
              boxSizing: 'border-box',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={contactMutation.isPending}
          style={{
            width: '100%',
            backgroundColor: '#EA580C',
            color: 'white',
            padding: '1rem',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: contactMutation.isPending ? 'not-allowed' : 'pointer',
            opacity: contactMutation.isPending ? 0.7 : 1
          }}
        >
          {contactMutation.isPending ? "Sending..." : "Send Message"}
        </button>
      </form>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#F3F4F6',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0', fontSize: '0.875rem', color: '#6B7280' }}>
          Or call us directly: <strong>+44 788 702 4551</strong><br />
          Email: <strong>LA-Automotive@hotmail.com</strong><br />
          Address: <strong>5 Burgess Road, Hastings, East Sussex</strong>
        </p>
      </div>
    </div>
  );
}
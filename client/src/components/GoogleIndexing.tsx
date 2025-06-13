import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function GoogleIndexing() {
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();

  const submitSitemapMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/submit-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) throw new Error("Failed to submit sitemap");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Sitemap Submitted",
        description: `${data.urls} pages submitted to Google for indexing`,
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

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
        Google Search Console Setup
      </h2>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
          Step 1: Verify Website Ownership
        </h3>
        <p style={{ marginBottom: '1rem', color: '#6B7280' }}>
          1. Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" style={{ color: '#1D4ED8' }}>Google Search Console</a><br/>
          2. Add property: https://laautomotive.co.uk<br/>
          3. Choose "HTML tag" verification method<br/>
          4. Copy the verification code and paste below
        </p>
        
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Paste Google verification code here"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '1rem',
            boxSizing: 'border-box',
            marginBottom: '1rem'
          }}
        />
        
        <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
          The verification file is already created at: /google-search-console-verification.html
        </p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#374151', marginBottom: '1rem' }}>
          Step 2: Submit Sitemap for Indexing
        </h3>
        <p style={{ marginBottom: '1rem', color: '#6B7280' }}>
          Submit your sitemap to Google for faster indexing of all SEO landing pages:
        </p>
        
        <button
          onClick={() => submitSitemapMutation.mutate()}
          disabled={submitSitemapMutation.isPending}
          style={{
            width: '100%',
            backgroundColor: '#10B981',
            color: 'white',
            padding: '1rem',
            fontSize: '1.125rem',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: submitSitemapMutation.isPending ? 'not-allowed' : 'pointer',
            opacity: submitSitemapMutation.isPending ? 0.7 : 1,
            marginBottom: '1rem'
          }}
        >
          {submitSitemapMutation.isPending ? "Submitting..." : "Submit Sitemap to Google"}
        </button>
        
        <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
          Sitemap URL: https://laautomotive.co.uk/sitemap.xml
        </p>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: '#F3F4F6',
        borderRadius: '8px'
      }}>
        <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>
          Pages Ready for Indexing:
        </h4>
        <ul style={{ margin: '0', paddingLeft: '1.5rem', color: '#6B7280', fontSize: '0.875rem' }}>
          <li>Main website (homepage)</li>
          <li>Car repairs landing page (1,900+ searches)</li>
          <li>Garage near me landing page (2,400+ searches)</li>
          <li>MOT failure repairs landing page (880+ searches)</li>
          <li>Bodywork repairs landing page (680+ searches)</li>
        </ul>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
          <strong>Total:</strong> 5,860+ monthly searches targeted
        </p>
      </div>
    </div>
  );
}
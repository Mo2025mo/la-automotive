import { useLocation } from "wouter";
import { useEffect } from "react";

export default function LandingPages() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Redirect to the actual HTML file in public folder
    const htmlPath = location.replace('/pages', '') + '.html';
    window.location.href = htmlPath;
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to landing page...</p>
      </div>
    </div>
  );
}
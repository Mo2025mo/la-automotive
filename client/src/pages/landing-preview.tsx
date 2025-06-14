import { useState } from "react";

const landingPages = [
  {
    title: "Car Servicing",
    file: "car-servicing-hastings.html", 
    traffic: "~800 searches",
    description: "Full service, basic service, oil changes, and maintenance",
    isNew: true
  },
  {
    title: "Tyre Replacement",
    file: "tyre-replacement-hastings.html",
    traffic: "~600 searches", 
    description: "New tyres, puncture repairs, wheel balancing, and alignment",
    isNew: true
  },
  {
    title: "Brake Repair",
    file: "brake-repair-hastings.html",
    traffic: "~800 searches", 
    description: "Emergency brake repairs, brake pads, discs, and diagnostics",
    isNew: false
  },
  {
    title: "Engine Diagnostics", 
    file: "engine-diagnostics-hastings.html",
    traffic: "~600 searches",
    description: "Check engine light, fault diagnosis, and engine repairs",
    isNew: false
  },
  {
    title: "Emergency Car Repair",
    file: "emergency-car-repair-hastings.html", 
    traffic: "~400 searches",
    description: "Same-day emergency repairs and mobile services",
    isNew: false
  },
  {
    title: "Clutch Replacement",
    file: "clutch-replacement-hastings.html",
    traffic: "~300 searches", 
    description: "Expert clutch replacement and repair services",
    isNew: false
  },
  {
    title: "Car Battery Service",
    file: "car-battery-replacement-hastings.html",
    traffic: "~500 searches",
    description: "Battery testing, replacement, and jump start service", 
    isNew: false
  },
  {
    title: "Exhaust Repair",
    file: "exhaust-repair-hastings.html",
    traffic: "~400 searches",
    description: "Complete exhaust system repairs and MOT emissions",
    isNew: false
  }
];

export default function LandingPreview() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const openPage = (filename: string) => {
    window.open(`/${filename}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">
            LA Automotive - All Landing Pages
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            8 professional landing pages targeting 4,800+ monthly searches
          </p>
          <p className="text-sm text-gray-500">
            Click "View Page" to open each landing page in a new tab
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {landingPages.map((page, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{page.title}</h3>
                {page.isNew && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    NEW
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{page.description}</p>
              
              <div className="text-xs text-blue-600 font-medium mb-4">
                {page.traffic}
              </div>
              
              <button 
                onClick={() => openPage(page.file)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View Page
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">SEO Performance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4,800+</div>
              <div className="text-sm text-gray-600">Monthly Searches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Landing Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">Hastings Focused</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Main Site
          </a>
        </div>
      </div>
    </div>
  );
}

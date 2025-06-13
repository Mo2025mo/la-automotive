import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Services() {
  const [selectedService, setSelectedService] = useState<any>(null);
  const services = [
    {
      icon: "fas fa-wrench",
      title: "Engine Diagnostics",
      description: "Advanced diagnostic tools to identify and resolve engine issues quickly and accurately.",
      color: "auto-blue",
      hoverColor: "hover:text-blue-800",
      details: {
        overview: "Professional engine diagnostic services using the latest OBD-II scanners and advanced diagnostic equipment to identify engine problems accurately.",
        services: [
          "Engine fault code reading and clearing",
          "Live data monitoring and analysis",
          "Emission system diagnostics",
          "Performance testing and analysis",
          "ECU programming and updates"
        ],
        pricing: "Quote on assessment",
        timeframe: "30-60 minutes"
      }
    },
    {
      icon: "fas fa-tools",
      title: "MOT Failure Repair",
      description: "Fix my car MOT failures fast - Expert repair services with quick turnaround and competitive pricing.",
      color: "auto-orange",
      hoverColor: "hover:text-orange-800",
      details: {
        overview: "Specialist MOT failure repair services at 5 Burgess Road, Hastings. We repair all common MOT failures with same-day service available. Local garage near you in East Sussex.",
        services: [
          "Brake system repairs and replacements",
          "Suspension component replacement", 
          "Exhaust system repairs",
          "Light and electrical fault repairs",
          "Tyre fitting and wheel alignment",
          "Clutch repairs and replacements",
          "Battery replacement and charging system"
        ],
        pricing: "Brake pads from £55, clutch repairs from £300, other repairs - quote on assessment", 
        timeframe: "Same day to 2 working days"
      }
    },
    {
      icon: "fas fa-car-crash",
      title: "Brake Services",
      description: "Complete brake system inspection, repair, and replacement with quality components.",
      color: "auto-green",
      hoverColor: "hover:text-green-800",
      details: {
        overview: "Comprehensive brake services ensuring your vehicle's safety with quality brake components and expert installation.",
        services: [
          "Brake pad and disc replacement",
          "Brake fluid changes and bleeding",
          "Brake line inspection and repair",
          "Handbrake adjustment and repair",
          "ABS system diagnostics"
        ],
        pricing: "Brake pads from £55, other parts - quote on assessment",
        timeframe: "2-4 hours"
      }
    },
    {
      icon: "fas fa-bolt",
      title: "Electrical Systems",
      description: "Expert diagnosis and repair of automotive electrical and electronic systems.",
      color: "bg-purple-600",
      hoverColor: "hover:text-purple-800",
      details: {
        overview: "Professional automotive electrical services covering all vehicle electrical systems from basic lighting to complex ECU repairs.",
        services: [
          "Alternator and starter motor repair",
          "Battery testing and replacement",
          "Wiring harness repair",
          "ECU diagnostics and programming",
          "Lighting system repairs"
        ],
        pricing: "Quote on assessment",
        timeframe: "1-3 hours depending on complexity"
      }
    },
    {
      icon: "fas fa-oil-can",
      title: "Oil & Fluids",
      description: "Regular maintenance services including oil changes and fluid top-ups.",
      color: "bg-red-600",
      hoverColor: "hover:text-red-800",
      details: {
        overview: "Essential vehicle maintenance services to keep your engine running smoothly with quality oils and fluids.",
        services: [
          "Engine oil and filter changes",
          "Transmission fluid service",
          "Coolant system flush",
          "Power steering fluid replacement",
          "Brake fluid replacement"
        ],
        pricing: "Quote on assessment",
        timeframe: "30-60 minutes"
      }
    },
    {
      icon: "fas fa-car",
      title: "Bodywork Services",
      description: "Professional bodywork repairs, panel beating, and paint restoration services.",
      color: "bg-purple-600",
      hoverColor: "hover:text-purple-800",
      details: {
        overview: "Expert bodywork and paint services to restore your vehicle's appearance with professional panel beating and paint matching.",
        services: [
          "Dent removal and panel beating",
          "Scratch and scuff repair",
          "Paint matching and spraying",
          "Bumper repair and replacement",
          "Rust treatment and prevention"
        ],
        pricing: "Quote on assessment",
        timeframe: "1-5 days depending on work required"
      }
    },
    {
      icon: "fas fa-cogs",
      title: "General Repairs",
      description: "Comprehensive repair services for all makes and models of vehicles.",
      color: "bg-indigo-600",
      hoverColor: "hover:text-indigo-800",
      details: {
        overview: "Complete automotive repair services for all vehicle makes and models with experienced technicians and quality parts.",
        services: [
          "Clutch replacement and repair",
          "Timing belt replacement",
          "Suspension system repairs",
          "Exhaust system replacement",
          "Air conditioning service"
        ],
        pricing: "Quote on assessment",
        timeframe: "Half day to 3 days"
      }
    }
  ];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Expert MOT Failure Repairs & Automotive Services in Hastings</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional MOT failure repairs, engine diagnostics, brake services, and bodywork repairs at 5 Burgess Road, Hastings. Same-day service available with competitive pricing and expert craftsmanship.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 ${service.color} text-white rounded-lg flex items-center justify-center mb-4`}>
                <i className={`${service.icon} text-xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <button 
                onClick={() => setSelectedService(service)}
                className={`${service.hoverColor} font-medium transition-colors`}
              >
                Learn More <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Service Details Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${selectedService?.color} text-white rounded-lg flex items-center justify-center`}>
                <i className={`${selectedService?.icon} text-lg`}></i>
              </div>
              <span>{selectedService?.title}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-6">
              {/* Overview */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Service Overview</h4>
                <p className="text-gray-600">{selectedService.details.overview}</p>
              </div>

              {/* Services Included */}
              <div>
                <h4 className="font-semibold text-lg mb-3">What's Included</h4>
                <ul className="space-y-2">
                  {selectedService.details.services.map((item: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <i className="fas fa-check text-green-600 mt-1"></i>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Service Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">
                    <i className="fas fa-pound-sign mr-2"></i>Pricing
                  </h5>
                  <p className="text-blue-800 text-sm">{selectedService.details.pricing}</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-orange-900 mb-2">
                    <i className="fas fa-clock mr-2"></i>Timeframe
                  </h5>
                  <p className="text-orange-800 text-sm">{selectedService.details.timeframe}</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">Ready to Book This Service?</h4>
                <p className="text-gray-600 mb-4">
                  Contact LA-Automotive at 5 Burgess Road, Hastings for professional {selectedService.title.toLowerCase()} services.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href="tel:00447887024551" 
                    className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <i className="fas fa-phone mr-2"></i>Call Now: +44 788 702 4551
                  </a>
                  <a 
                    href="mailto:LA-Automotive@hotmail.com" 
                    className="flex items-center justify-center border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <i className="fas fa-envelope mr-2"></i>Email Quote
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

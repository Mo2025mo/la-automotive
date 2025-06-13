export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/assets/la-automotive-logo.svg" 
                alt="LA-Automotive Logo" 
                className="h-12 w-auto"
                width="60"
                height="36"
              />
              <div>
                <h3 className="font-bold text-xl">LA Automotive</h3>
                <p className="text-sm text-gray-400">MOT Failure Repairs & Car Services</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted automotive partner in Hastings, specializing in MOT failure repairs, engine diagnostics, brake services, and bodywork repairs. Located at 5 Burgess Road.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/people/La-Automotive/61575976954390/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">MOT Failure Repair</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Engine Diagnostics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Brake Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Electrical Repairs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bodywork Services</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Parts & Suppliers</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Car Parts Search</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Local Suppliers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Price Comparison</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Parts Request</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Genuine Parts</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <i className="fas fa-phone w-4"></i>
                <a href="tel:00447887024551" className="hover:text-white transition-colors">+44 788 702 4551</a>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-envelope w-4"></i>
                <a href="mailto:LA-Automotive@hotmail.com" className="hover:text-white transition-colors">LA-Automotive@hotmail.com</a>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-map-marker-alt w-4 mt-1"></i>
                <span>5 Burgess Road<br />Hastings, United Kingdom</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 LA-Automotive. All rights reserved. | MOT Failure Repairs, Engine Diagnostics & Bodywork Services in Hastings, UK | 5 Burgess Road</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

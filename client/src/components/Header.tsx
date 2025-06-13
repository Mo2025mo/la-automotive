import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/la-automotive-logo.svg" 
              alt="LA-Automotive Logo - Professional Car Services Hastings" 
              className="h-16 w-auto"
              width="80"
              height="48"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LA Automotive</h1>
              <p className="text-sm text-gray-600">MOT Failure Repairs & Car Services</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
            <a href="#parts" className="text-gray-700 hover:text-blue-600 font-medium">Parts</a>
            <a href="#mot" className="text-gray-700 hover:text-blue-600 font-medium">MOT Repairs</a>
            <a href="#suppliers" className="text-gray-700 hover:text-blue-600 font-medium">Suppliers</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
            <a href="/admin" className="text-orange-600 hover:text-orange-700 font-medium">Admin</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Call Now</p>
              <a href="tel:00447887024551" className="text-orange-600 font-bold hover:text-orange-700">
                +44 788 702 4551
              </a>
            </div>
            <button 
              className="md:hidden text-gray-700 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Services</a>
              <a href="#parts" className="text-gray-700 hover:text-blue-600 font-medium">Parts</a>
              <a href="#mot" className="text-gray-700 hover:text-blue-600 font-medium">MOT Repairs</a>
              <a href="#suppliers" className="text-gray-700 hover:text-blue-600 font-medium">Suppliers</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
              <a href="/admin" className="text-orange-600 hover:text-orange-700 font-medium">Admin Dashboard</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

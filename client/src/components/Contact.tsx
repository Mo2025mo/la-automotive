export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact LA Automotive Hastings</h2>
          <p className="text-xl text-gray-600">Professional MOT failure repairs at 5 Burgess Road, Hastings. Open Monday-Friday 9AM-5:30PM. Call now for same-day service.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="auto-blue text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">LA Automotive</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-1">
                    <i className="fas fa-map-marker-alt text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="opacity-90">5 Burgess Road<br />Hastings, United Kingdom</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-1">
                    <i className="fas fa-phone text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:00447887024551" className="opacity-90 hover:text-orange-300 transition-colors">
                      +44 788 702 4551
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-1">
                    <i className="fas fa-envelope text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:LA-Automotive@hotmail.com" className="opacity-90 hover:text-orange-300 transition-colors">
                      LA-Automotive@hotmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-1">
                    <i className="fas fa-clock text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium">Opening Hours</p>
                    <div className="opacity-90 text-sm space-y-1">
                      <p>Monday - Friday: 9:00 AM - 5:30 PM</p>
                      <p>Saturday: Closed</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="auto-orange text-white p-6 rounded-xl">
              <h4 className="font-semibold mb-3 flex items-center">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Emergency Breakdown?
              </h4>
              <p className="mb-4 opacity-90">Need immediate assistance? Call our emergency line:</p>
              <a href="tel:00447887024551" className="text-xl font-bold hover:underline">
                +44 788 702 4551
              </a>
            </div>
          </div>
          
          {/* Interactive Map */}
          <div className="bg-gray-200 rounded-xl h-96 overflow-hidden relative">
                       <iframe
              src="https://maps.google.com/maps?q=5+Burgess+Road,+Hastings+TN35+3AB,+UK&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="LA Automotive Location - 5 Burgess Road, Hastings"
            />
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10">
              <p className="font-medium text-gray-900">LA Automotive</p>
              <p className="text-sm text-gray-600">5 Burgess Road, Hastings TN35 3AB</p>
              <div className="flex space-x-2 mt-2">
                <a 
                  href="https://www.google.com/maps/dir//5+Burgess+Road,+Hastings+TN35+3AB,+UK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <i className="fas fa-directions mr-1"></i>
                  Directions
                </a>
                <a 
                  href="https://maps.apple.com/?q=5+Burgess+Road,+Hastings+TN35+3AB,+UK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <i className="fas fa-map mr-1"></i>
                  Apple Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

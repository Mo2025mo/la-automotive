import { useQuery } from "@tanstack/react-query";

export default function Suppliers() {
  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['/api/suppliers'],
  });

  if (isLoading) {
    return (
      <section id="suppliers" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
            <p className="mt-2 text-gray-600">Loading suppliers...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="suppliers" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Local Hastings Suppliers</h2>
          <p className="text-xl text-gray-600">Trusted parts suppliers and service partners in the Hastings area</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suppliers?.map((supplier: any) => (
            <div key={supplier.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{supplier.name}</h3>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-star text-yellow-400"></i>
                  <span className="text-sm font-medium">{supplier.rating}</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-map-marker-alt w-4 text-blue-600 mr-2"></i>
                  <span>{supplier.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-phone w-4 text-blue-600 mr-2"></i>
                  <a href={`tel:${supplier.phone}`} className="hover:text-blue-600">{supplier.phone}</a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <i className="fas fa-clock w-4 text-blue-600 mr-2"></i>
                  <span>{supplier.hours}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {supplier.specialties?.map((specialty: string, index: number) => (
                  <span key={index} className="auto-blue text-white text-xs px-2 py-1 rounded">
                    {specialty}
                  </span>
                ))}
              </div>
              
              <div className="flex space-x-3">
                <button className="flex-1 auto-blue hover-auto-blue text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Call Now
                </button>
                <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-lg text-sm font-medium transition-colors">
                  Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

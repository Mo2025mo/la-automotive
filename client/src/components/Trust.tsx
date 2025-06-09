export default function Trust() {
  const features = [
    {
      icon: "fas fa-certificate",
      title: "Certified Technicians",
      description: "Fully qualified and experienced automotive specialists",
      color: "auto-blue"
    },
    {
      icon: "fas fa-tools",
      title: "Expert Technicians",
      description: "Skilled mechanics with years of automotive repair experience",
      color: "auto-orange"
    },
    {
      icon: "fas fa-clock",
      title: "Same Day Service",
      description: "Many repairs completed the same day you drop off",
      color: "auto-green"
    },
    {
      icon: "fas fa-pound-sign",
      title: "Competitive Prices",
      description: "Fair, transparent pricing with no hidden costs",
      color: "bg-purple-600"
    }
  ];

  const certifications = [
    { icon: "fas fa-wrench", title: "Specialist Repairs" },
    { icon: "fas fa-tools", title: "IMI Certified" },
    { icon: "fas fa-handshake", title: "Trade Partner" },
    { icon: "fas fa-star", title: "5 Star Reviews" }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LA-Automotive?</h2>
          <p className="text-xl text-gray-600">Trusted by hundreds of customers across Hastings and surrounding areas</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${feature.color} text-white rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`${feature.icon} text-2xl`}></i>
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        {/* Certifications */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-8">Our Certifications & Partnerships</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <i className={`${cert.icon} text-2xl text-gray-500`}></i>
                </div>
                <p className="text-sm font-medium">{cert.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

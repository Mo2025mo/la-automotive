export default function LandingNav() {
  const landingPages = [
    {
      title: "MOT Failure Repair",
      url: "/mot-failure-repair-hastings.html",
      description: "Same-day MOT failure fixes - brake pads from £55"
    },
    {
      title: "Diesel Engine Repair", 
      url: "/diesel-engine-repair-hastings.html",
      description: "DPF cleaning, turbo repairs, diesel diagnostics"
    },
    {
      title: "Bodywork Repairs",
      url: "/bodywork-repairs-hastings.html", 
      description: "Dent repair, scratch removal, panel beating"
    },
    {
      title: "Car Breakdown Emergency",
      url: "/car-breakdown-hastings.html",
      description: "Emergency roadside assistance & same-day repairs"
    },
    {
      title: "Insurance Repairs",
      url: "/car-insurance-repairs-hastings.html",
      description: "Accident damage & collision repairs"
    },
    {
      title: "Garage Near Me",
      url: "/garage-near-me-hastings.html", 
      description: "Local garage services in Hastings"
    },
    {
      title: "General Car Repairs",
      url: "/hastings-car-repairs.html",
      description: "Professional automotive services"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">LA Automotive Landing Pages</h1>
          <p className="text-xl text-gray-600">Specialized service pages for different automotive needs</p>
          <div className="mt-6">
            <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">← Back to Main Website</a>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{page.title}</h3>
              <p className="text-gray-600 mb-4">{page.description}</p>
              <a 
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                View Page →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900">Phone</h3>
              <p className="text-gray-600">+44 788 702 4551</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="text-gray-600">LA-Automotive@hotmail.com</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Address</h3>
              <p className="text-gray-600">5 Burgess Road, Hastings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
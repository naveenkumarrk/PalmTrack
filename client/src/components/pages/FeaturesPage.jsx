import { useState } from 'react';
import { 
  Droplet, 
  Layers, 
  BarChart2, 
  Package, 
  Lock, 
  ChevronRight,
  DollarSign,
  Thermometer,
  Truck,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react';

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    {
      id: 0,
      title: "Neera Collection Tracking",
      icon: <Droplet size={24} />,
      description: "Track daily neera collection entries from farms with key details like supplier, quantity, method, temperature, and storage — all in one place.",
      color: "bg-blue-600",
      image: "https://live.staticflickr.com/2245/2354109983_1a632f1c64_o.jpg",
      details: [
        { icon: <Users size={16} />, text: "Supplier management & history tracking" },
        { icon: <Thermometer size={16} />, text: "Temperature and freshness monitoring" },
        { icon: <Truck size={16} />, text: "Collection method & transport logs" },
        { icon: <Clock size={16} />, text: "Time-stamped entries for quality control" }
      ]
    },
    {
      id: 1,
      title: "Batch-Wise Processing Workflow",
      icon: <Layers size={24} />,
      description: "Create processing batches, update their stages (Boiling, Crystallization, etc.), and record real-time outputs and wastage — enabling a complete digital production trail.",
      color: "bg-indigo-600",
      image: "https://www.shutterstock.com/image-photo/roorkee-uttarakhand-india-nov-7-260nw-2071601117.jpg",
      details: [
        { icon: <CheckCircle size={16} />, text: "Multi-stage production tracking" },
        { icon: <Clock size={16} />, text: "Real-time status updates & notifications" },
        { icon: <DollarSign size={16} />, text: "Yield & wastage calculation" },
        { icon: <Users size={16} />, text: "Operator assignment & accountability" }
      ]
    },
    {
      id: 2,
      title: "Smart Inventory Management",
      icon: <Package size={24} />,
      description: "Seamlessly convert completed batches into inventory records, track product type, weight, packaging, location, and expiry for efficient stock control.",
      color: "bg-emerald-600",
      image: "https://www.shutterstock.com/image-photo/many-1-kg-jaggery-placed-260nw-1648481728.jpg",
      details: [
        { icon: <Package size={16} />, text: "Product categorization & packaging options" },
        { icon: <Clock size={16} />, text: "Expiry tracking & alerts" },
        { icon: <Truck size={16} />, text: "Location & warehouse management" },
        { icon: <DollarSign size={16} />, text: "Valuation & stock level insights" }
      ]
    },
    {
      id: 3,
      title: "Dynamic Dashboard & Analytics",
      icon: <BarChart2 size={24} />,
      description: "Monitor total neera collected, sugar produced, batch completion stats, and wastage percentage with clean KPIs, Recharts visualizations, and real-time insights.",
      color: "bg-purple-600",
      image: "https://cdn.prod.website-files.com/63adbe40f5bff026576c111d/6493093b0a70d99b8c97c730_The%20Dos%20and%20Don%27ts%20of%20Dashboard%20Design%20(1).png",
      details: [
        { icon: <BarChart2 size={16} />, text: "Production & efficiency metrics" },
        { icon: <DollarSign size={16} />, text: "Financial performance indicators" },
        { icon: <Users size={16} />, text: "Supplier contribution analysis" },
        { icon: <Clock size={16} />, text: "Seasonal trends & predictions" }
      ]
    },
    {
      id: 4,
      title: "Role-Based Access with JWT Authentication",
      icon: <Lock size={24} />,
      description: "Secure login system with role-based access for employees and managers. Employees can log collections and updates, while managers verify and finalize critical steps.",
      color: "bg-gray-800",
      image: "https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fwb4q92d2nehp9fnjnf0w.png",
      details: [
        { icon: <Lock size={16} />, text: "Secure JWT authentication" },
        { icon: <Users size={16} />, text: "Role-based permission system" },
        { icon: <CheckCircle size={16} />, text: "Approval workflows & verification" },
        { icon: <Clock size={16} />, text: "Audit logs & activity tracking" }
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Capabilities</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Comprehensive Features
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            End-to-end palm sugar production management with intelligent tracking and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-24">
          {features.map((feature) => (
            <button
              key={feature.id}
              className={`px-4 py-3 rounded-md text-center transition-all ${
                activeFeature === feature.id 
                  ? `${feature.color} text-white font-medium shadow-md` 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <div className="flex items-center justify-center">
                <span className="mr-2">{feature.icon}</span>
                <span className="hidden md:inline">{feature.title.split(' ')[0]}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <div className={`inline-flex items-center justify-center p-3 mb-5 rounded-full ${features[activeFeature].color} bg-opacity-10`}>
                <div className={`${features[activeFeature].color} text-white rounded-full p-2`}>
                  {features[activeFeature].icon}
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{features[activeFeature].title}</h2>
              <p className="text-lg text-gray-600 mb-8">{features[activeFeature].description}</p>
              
              <div className="space-y-4 mb-8">
                {features[activeFeature].details.map((detail, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className={`p-1 rounded-full ${features[activeFeature].color} mr-3 mt-1`}>
                      {detail.icon}
                    </div>
                    <p className="text-gray-700">{detail.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-200">
              <img 
                src={features[activeFeature].image} 
                alt={features[activeFeature].title}
                className="w-[38em] h-[34em] object-cover rounded-lg shadow-md" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
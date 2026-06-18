import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiZap, FiShield } from 'react-icons/fi';

const features = [
  { icon: '🔍', title: 'Find Nearest Pump', desc: 'Highway par nearest petrol pump dhundho GPS se' },
  { icon: '⛽', title: 'Multiple Fuel Types', desc: 'Petrol, Diesel, CNG aur EV charging available' },
  { icon: '📱', title: 'Easy Ordering', desc: 'Ek click me fuel order karo, tracking real-time' },
  { icon: '⭐', title: 'Ratings & Reviews', desc: 'Verified customer reviews se sahi pump chuno' },
];

const Home = () => (
  <div>
    {/* Hero */}
    <section className="bg-gradient-to-br from-secondary to-gray-900 text-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Highway par <span className="text-primary">Fuel</span> ki tension nahi!
        </h1>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          India ke highways par nearest petrol pumps dhundho, fuel order karo aur hassle-free travel karo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/pumps" className="btn-primary text-base px-8 py-3 flex items-center justify-center gap-2">
            📍 Find Nearest Pump
          </Link>
          <Link to="/pumps?tab=city" className="btn-outline text-base px-8 py-3 border-white text-white hover:bg-white hover:text-secondary">
            🏙️ Search by City
          </Link>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-primary py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
        {[['500+', 'Petrol Pumps'], ['50,000+', 'Happy Customers'], ['100+', 'Highways Covered'], ['₹10Cr+', 'Fuel Delivered']].map(([v, l]) => (
          <div key={l}><p className="text-2xl font-bold">{v}</p><p className="text-sm opacity-80">{l}</p></div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Kyun choose karein HighwayFuel?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(f => (
          <div key={f.title} className="card text-center hover:shadow-md transition">
            <span className="text-4xl block mb-3">{f.icon}</span>
            <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="bg-gray-100 py-16 px-4 text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to get started?</h2>
      <p className="text-gray-500 mb-6">Abhi join karo aur stress-free highway travel ka anand lo.</p>
      <Link to="/register" className="btn-primary px-8 py-3 text-base">Create Free Account</Link>
    </section>
  </div>
);

export default Home;

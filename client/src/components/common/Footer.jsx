import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-secondary text-white mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⛽</span>
            <span className="text-xl font-bold">Highway<span className="text-primary">Fuel</span></span>
          </div>
          <p className="text-gray-300 text-sm">Highway par nearest petrol pump dhundho aur fuel order karo apni location se.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-primary">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/pumps" className="hover:text-white transition">Find Pumps</Link></li>
            <li><Link to="/register" className="hover:text-white transition">Register as Dealer</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3 text-primary">Contact</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>📧 support@highwayfuel.in</li>
            <li>📞 1800-XXX-XXXX</li>
            <li>🏢 Highway Fuel Pvt. Ltd.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-600 mt-8 pt-6 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} HighwayFuel. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

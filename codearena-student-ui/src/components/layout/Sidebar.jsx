import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function Sidebar() {
  return (
    <nav className="w-64 bg-gray-800 text-gray-100 flex flex-col p-4 space-y-4">
      <div className="text-xl font-bold mb-6 text-center">Student UI</div>
      <Link to="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
        <Home size={20} />
        Dashboard
      </Link>
      {/* Additional navigation items can be added here */}
    </nav>
  );
}

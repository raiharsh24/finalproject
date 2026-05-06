import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-card-bg rounded-lg shadow p-4 flex items-center">
      <div className={`p-3 rounded-full ${color ? color : 'bg-primary'} text-white`}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

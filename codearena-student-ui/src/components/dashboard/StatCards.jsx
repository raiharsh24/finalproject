import { BarChart2, Users, Award } from 'lucide-react';

export default function StatCards() {
  const cards = [
    { title: 'Submissions Today', value: 12, icon: <BarChart2 size={24} className="text-blue-500" /> },
    { title: 'Active Users', value: 34, icon: <Users size={24} className="text-green-500" /> },
    { title: 'Top Rank', value: '#1', icon: <Award size={24} className="text-yellow-500" /> },
    { title: 'XP Points', value: 1240, icon: <Award size={24} className="text-purple-500" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div
          key={i}
          className="p-4 bg-white/70 backdrop-blur rounded-3xl shadow-xl border border-slate-200 hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center gap-3">
            {c.icon}
            <div>
              <p className="text-sm text-gray-500">{c.title}</p>
              <p className="text-2xl font-bold text-gray-800">{c.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


export default function DashboardHero() {
  return (
    <section className="p-6 bg-white/70 backdrop-blur rounded-3xl shadow-xl mb-4">
      <h1 className="text-3xl font-bold text-gray-800">Welcome back, Student!</h1>
      <p className="text-gray-600 mt-2">Your current streak: <span className="font-medium">5 days</span>. Keep up the great work!</p>
    </section>
  );
}

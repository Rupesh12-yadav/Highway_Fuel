const AnalyticsCard = ({ title, value, icon, color = 'orange', trend }) => {
  const colors = {
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
          </p>}
        </div>
        <div className={`${colors[color]} p-3 rounded-xl text-2xl`}>{icon}</div>
      </div>
    </div>
  );
};

export default AnalyticsCard;

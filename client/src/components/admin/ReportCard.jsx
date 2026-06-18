const ReportCard = ({ title, value, subtitle, icon, className = '' }) => (
  <div className={`card ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
);

export default ReportCard;

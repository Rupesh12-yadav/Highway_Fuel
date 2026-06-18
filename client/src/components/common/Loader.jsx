const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const s = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <div className={`${s[size]} animate-spin rounded-full border-4 border-primary border-t-transparent`} />
      {text && <p className="text-gray-500 text-sm">{text}</p>}
    </div>
  );
};

export default Loader;

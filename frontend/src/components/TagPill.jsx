const TagPill = ({ tag, onClick, isSelected = false, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const baseClasses = 'inline-block rounded-full font-medium transition-colors cursor-pointer';
  const selectedClasses = isSelected 
    ? 'bg-blue-600 text-white' 
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

  return (
    <span
      className={`${baseClasses} ${selectedClasses} ${sizeClasses[size]}`}
      onClick={onClick}
    >
      {tag}
    </span>
  );
};

export default TagPill;

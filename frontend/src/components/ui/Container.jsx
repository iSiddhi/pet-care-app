const Container = ({ children, className = '', size = 'default' }) => {
  const widths = {
    narrow: 'max-w-3xl',
    default: 'max-w-7xl',
    wide: 'max-w-[90rem]',
  };
  return (
    <div className={`${widths[size]} mx-auto px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
};

export default Container;

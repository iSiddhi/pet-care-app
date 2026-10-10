const Container = ({ children, className = '', size = 'default' }) => {
  const widths = {
    narrow: 'max-w-3xl',
    default: 'max-w-[88rem]',   // 1408px — was 80rem, too narrow on large screens
    wide: 'max-w-[96rem]',
  };
  return (
    <div className={`${widths[size]} mx-auto px-5 sm:px-8 lg:px-12 ${className}`}>
      {children}
    </div>
  );
};

export default Container;

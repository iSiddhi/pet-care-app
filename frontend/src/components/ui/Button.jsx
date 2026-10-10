import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full ' +
  'transition-colors duration-200 focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-cream disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  primary: 'bg-ink text-cream hover:bg-blush-600 shadow-soft',
  blush: 'bg-blush-400 text-white hover:bg-blush-500 shadow-glow',
  soft: 'bg-blush-50 text-blush-600 hover:bg-blush-100',
  outline: 'border border-hairline bg-cream/80 text-ink hover:border-blush-300 hover:bg-blush-50',
  ghost: 'text-ink-soft hover:text-ink hover:bg-mist',
};

// Hoisted: motion(Link) inside render would remount the node every pass
const MotionLink = motion(Link);

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: 'text-sm px-6 py-3',
  lg: 'text-base px-8 py-4',
};

const Button = ({
  as = 'button',
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  };

  if (to) {
    return (
      <MotionLink to={to} className={cls} {...motionProps} {...props}>
        {children}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <motion.a href={href} className={cls} {...motionProps} {...props}>
        {children}
      </motion.a>
    );
  }

  const Tag = motion[as] || motion.button;
  return (
    <Tag className={cls} {...motionProps} {...props}>
      {children}
    </Tag>
  );
};

export default Button;

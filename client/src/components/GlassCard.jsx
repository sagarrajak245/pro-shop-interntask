import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hover = true,
  ...rest
}) => {
  const baseClasses =
    'glass-card backdrop-blur-lg bg-glass-white border border-slate-500/20 rounded-2xl p-6 shadow-lg shadow-black/50';
  const hoverClasses = hover
    ? 'hover:bg-white/[0.2] hover:border-slate-400/30 transition-all duration-300'
    : '';

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

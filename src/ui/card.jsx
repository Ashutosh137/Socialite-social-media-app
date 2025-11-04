import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

/**
 * Card Component - Reusable card container
 * @param {ReactNode} children - Card content
 * @param {string} variant - Style variant: 'default' | 'elevated' | 'outline' | 'hover'
 * @param {string} padding - Padding size: 'sm' | 'md' | 'lg' | 'none'
 * @param {string} className - Additional CSS classes
 * @param {boolean} interactive - Make card interactive (hover effects)
 * @param {function} onClick - Click handler
 */
function Card({
  children,
  variant = "default",
  padding = "md",
  className,
  interactive = false,
  onClick,
  ...props
}) {
  const variants = {
    default: "bg-bg-tertiary border border-border-default",
    elevated: "bg-bg-elevated border border-border-default shadow-soft",
    outline: "bg-transparent border-2 border-border-default",
    hover: "bg-bg-tertiary border border-border-default hover:bg-bg-elevated hover:border-border-hover hover:shadow-soft",
  };

  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const baseClasses = twMerge(
    "rounded-xl transition-all duration-200",
    variants[variant],
    paddingClasses[padding],
    interactive && "cursor-pointer hover:scale-[1.01]",
    className
  );

  if (onClick || interactive) {
    return (
      <motion.div
        whileHover={interactive ? { scale: 1.01 } : {}}
        whileTap={interactive ? { scale: 0.99 } : {}}
        onClick={onClick}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

export default Card;


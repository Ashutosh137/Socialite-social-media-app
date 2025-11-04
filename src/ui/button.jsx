import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function Button({ children, className, variant = "primary", size = "md", ...props }) {
  const baseStyles = "relative font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-bg-default disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variants = {
    primary: "bg-accent-500 hover:bg-accent-600 text-white shadow-medium hover:shadow-glow active:scale-95",
    secondary: "bg-bg-tertiary hover:bg-bg-elevated text-text-primary border border-border-default hover:border-border-hover active:scale-95",
    ghost: "bg-transparent hover:bg-bg-hover text-text-primary active:scale-95",
    outline: "bg-transparent border-2 border-accent-500 text-accent-500 hover:bg-accent-500/10 active:scale-95",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(
        baseStyles,
        variants[variant] || variants.primary,
        sizeStyles[size] || sizeStyles.md,
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;

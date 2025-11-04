import { motion } from "framer-motion";

export const Skeleton = ({ 
  variant = "rectangular", 
  width, 
  height, 
  animation = "wave",
  sx = {},
  className = "",
  ...props 
}) => {
  const baseClasses = "bg-bg-elevated rounded";
  
  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
  };

  const animateClass = animation === "wave" 
    ? "animate-pulse" 
    : "animate-pulse";

  const style = {
    width: width || (variant === "text" ? "100%" : "auto"),
    height: height || (variant === "text" ? "1rem" : "auto"),
    ...sx,
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant] || ""} ${animateClass} ${className}`}
      style={style}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      {...props}
    />
  );
};

export default Skeleton;


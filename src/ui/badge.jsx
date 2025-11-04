import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

/**
 * Badge Component - Reusable badge for notifications and counts
 * @param {number|string} count - Count to display
 * @param {string} variant - Color variant: 'default' | 'error' | 'success' | 'warning'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {string} className - Additional CSS classes
 * @param {boolean} showZero - Show badge even when count is 0
 */
function Badge({
  count,
  variant = "default",
  size = "sm",
  className,
  showZero = false,
  ...props
}) {
  if ((count === null || count === undefined || count === 0) && !showZero) {
    return null;
  }

  const variants = {
    default: "bg-accent-500 text-white",
    error: "bg-status-error text-white",
    success: "bg-status-success text-white",
    warning: "bg-status-warning text-black",
  };

  const sizeClasses = {
    sm: "min-w-[18px] h-[18px] text-xs px-1",
    md: "min-w-[20px] h-[20px] text-sm px-1.5",
    lg: "min-w-[24px] h-[24px] text-base px-2",
  };

  // Format large numbers
  const formatCount = (num) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={twMerge(
        "absolute -top-1 -right-1 flex items-center justify-center rounded-full font-bold",
        variants[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {formatCount(count)}
    </motion.span>
  );
}

export default Badge;


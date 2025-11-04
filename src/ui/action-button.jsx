import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

/**
 * ActionButton Component - Reusable action button for post interactions
 * @param {ReactNode} icon - Icon component
 * @param {string} label - Button label (for accessibility)
 * @param {function} onClick - Click handler
 * @param {string} variant - Color variant: 'default' | 'like' | 'comment' | 'share' | 'bookmark'
 * @param {number} count - Count to display
 * @param {boolean} isActive - Active state
 * @param {string} className - Additional CSS classes
 */
function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  count = null,
  isActive = false,
  className,
  ...props
}) {
  const variants = {
    default: {
      hover: "hover:bg-accent-500/10",
      active: "hover:text-accent-500",
      activeState: "text-accent-500",
    },
    like: {
      hover: "hover:bg-social-like/10",
      active: "hover:text-social-like",
      activeState: "text-social-like",
    },
    comment: {
      hover: "hover:bg-accent-500/10",
      active: "hover:text-accent-500",
      activeState: "text-accent-500",
    },
    share: {
      hover: "hover:bg-social-retweet/10",
      active: "hover:text-social-retweet",
      activeState: "text-social-retweet",
    },
    bookmark: {
      hover: "hover:bg-accent-500/10",
      active: "hover:text-accent-500",
      activeState: "text-accent-500",
    },
  };

  const variantStyle = variants[variant] || variants.default;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={twMerge(
        "group flex items-center gap-2 p-2 rounded-full transition-colors duration-200",
        variantStyle.hover,
        isActive ? variantStyle.activeState : "text-text-secondary",
        !isActive && variantStyle.active,
        className
      )}
      aria-label={label}
      {...props}
    >
      {Icon && (
        <Icon
          className={twMerge(
            "text-xl",
            isActive && variantStyle.activeState
          )}
        />
      )}
      {count !== null && count !== "" && (
        <span
          className={twMerge(
            "text-[13px] transition-colors duration-200",
            isActive && variantStyle.activeState
          )}
        >
          {typeof count === "number" && count > 0 ? count : count}
        </span>
      )}
    </motion.button>
  );
}

export default ActionButton;


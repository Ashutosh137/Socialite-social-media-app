import { twMerge } from "tailwind-merge";

/**
 * Typography Component - Reusable text component with consistent styling
 * @param {string} variant - Text variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small'
 * @param {string} color - Text color variant: 'primary' | 'secondary' | 'tertiary' | 'accent'
 * @param {string} className - Additional CSS classes
 * @param {ReactNode} children - Text content
 */
function Typography({
  variant = "body",
  color = "primary",
  className,
  children,
  as,
  ...props
}) {
  const variants = {
    h1: "text-3xl font-bold leading-tight",
    h2: "text-2xl font-bold leading-tight",
    h3: "text-xl font-semibold leading-tight",
    h4: "text-lg font-semibold leading-tight",
    body: "text-[15px] leading-5",
    caption: "text-[13px] leading-4",
    small: "text-xs leading-4",
  };

  const colors = {
    primary: "text-text-primary",
    secondary: "text-text-secondary",
    tertiary: "text-text-tertiary",
    accent: "text-accent-500",
  };

  const Component = as || (variant.startsWith("h") ? variant : "p");

  return (
    <Component
      className={twMerge(
        variants[variant] || variants.body,
        colors[color] || colors.primary,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Typography;


import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

function Input({ name, placeholder, className, label, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="flex w-full flex-col space-y-2"
    >
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-semibold text-text-secondary px-1 transition-colors duration-200"
        >
          {label}
        </label>
      )}

      <input
        className={twMerge(
          "input-field w-full text-base placeholder:capitalize resize-none placeholder:text-text-tertiary focus:ring-2 focus:ring-accent-500/20",
          className,
        )}
        id={name}
        name={name}
        placeholder={placeholder}
        {...props}
      />
    </motion.div>
  );
}

function TextInput({ name, placeholder, className, label, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="flex w-full flex-col space-y-2"
    >
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-semibold text-text-secondary px-1 transition-colors duration-200"
        >
          {label}
        </label>
      )}

      <textarea
        placeholder={placeholder}
        className={twMerge(
          "input-field w-full min-h-[120px] text-base placeholder:capitalize resize-none placeholder:text-text-tertiary focus:ring-2 focus:ring-accent-500/20",
          className,
        )}
        id={name}
        name={name}
        {...props}
      />
    </motion.div>
  );
}

export { Input, TextInput };

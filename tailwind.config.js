/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Color palette
      colors: {
        // Primary colors
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // Accent colors (X/Twitter blue)
        accent: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#1d9bf0",
          600: "#1e40af",
          700: "#1e3a8a",
          800: "#1e293b",
          900: "#0f172a",
        },
        // Background colors
        bg: {
          default: "#000000",
          secondary: "#0a0a0a",
          tertiary: "#16181c",
          elevated: "#202327",
          hover: "#1a1a1a",
        },
        // Text colors
        text: {
          primary: "#ffffff",
          secondary: "#71767a",
          tertiary: "#536471",
          disabled: "#3d3d3d",
        },
        // Border colors
        border: {
          default: "#2f3336",
          hover: "#536471",
          focus: "#1d9bf0",
          error: "#f4212e",
        },
        // Social interaction colors
        social: {
          like: "#f91880",
          retweet: "#00ba7c",
          comment: "#1d9bf0",
          share: "#1d9bf0",
          bookmark: "#1d9bf0",
        },
        // Status colors
        status: {
          error: "#f4212e",
          warning: "#ffad1f",
          success: "#00ba7c",
          info: "#1d9bf0",
        },
      },
      // Typography
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }],
        base: ["0.9375rem", { lineHeight: "1.5rem", letterSpacing: "0.01em" }],
        lg: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0.01em" }],
        xl: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        "3xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
        "4xl": ["2rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }],
      },
      // Spacing - Enhanced spacing scale
      spacing: {
        "18": "4.5rem", // 72px
        "88": "22rem", // 352px
        "128": "32rem", // 512px
        "144": "36rem", // 576px
      },
      
      // Gap spacing
      gap: {
        "18": "4.5rem",
        "88": "22rem",
      },
      // Border radius
      borderRadius: {
        "4xl": "2rem",
      },
      // Box shadows - Premium shadow system
      boxShadow: {
        "soft": "0 2px 8px rgba(0, 0, 0, 0.3)",
        "medium": "0 4px 12px rgba(0, 0, 0, 0.4)",
        "large": "0 8px 24px rgba(0, 0, 0, 0.5)",
        "glow": "0 0 20px rgba(29, 155, 240, 0.3)",
        "glow-lg": "0 0 40px rgba(29, 155, 240, 0.5)",
        "inner-soft": "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
      },
      
      // Drop shadows
      dropShadow: {
        "soft": "0 2px 4px rgba(0, 0, 0, 0.3)",
        "medium": "0 4px 8px rgba(0, 0, 0, 0.4)",
        "large": "0 8px 16px rgba(0, 0, 0, 0.5)",
      },
      // Animation
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      // Transitions
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      // Backdrop blur
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

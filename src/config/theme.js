/**
 * Centralized Theme Configuration
 * Premium design tokens inspired by X (Twitter), Threads, and Instagram
 */

export const theme = {
  // Color Palette - Modern, refined colors
  colors: {
    // Primary colors
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9", // Main primary
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
    
    // Accent colors (like X/Twitter blue)
    accent: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#1d9bf0", // X/Twitter blue
      600: "#1e40af",
      700: "#1e3a8a",
      800: "#1e293b",
      900: "#0f172a",
    },
    
    // Background colors
    background: {
      default: "#000000", // Pure black for premium feel
      secondary: "#0a0a0a", // Slightly lighter black
      tertiary: "#16181c", // Card backgrounds
      elevated: "#202327", // Elevated surfaces
      hover: "#1a1a1a", // Hover states
    },
    
    // Text colors
    text: {
      primary: "#ffffff", // Pure white
      secondary: "#71767a", // Muted gray
      tertiary: "#536471", // More muted
      disabled: "#3d3d3d",
      inverse: "#000000",
    },
    
    // Border colors
    border: {
      default: "#2f3336", // Subtle borders
      hover: "#536471",
      focus: "#1d9bf0",
      error: "#f4212e",
    },
    
    // Status colors
    status: {
      success: "#00d26a",
      error: "#f4212e",
      warning: "#ffd400",
      info: "#1d9bf0",
    },
    
    // Social interaction colors
    social: {
      like: "#f91880", // Instagram pink
      retweet: "#00ba7c", // Green
      comment: "#1d9bf0", // Blue
      share: "#1d9bf0",
      bookmark: "#1d9bf0",
    },
  },
  
  // Typography - Premium font system
  typography: {
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
      mono: [
        "SF Mono",
        "Monaco",
        "Inconsolata",
        "Fira Code",
        "Fira Mono",
        "Droid Sans Mono",
        "Consolas",
        "monospace",
      ],
    },
    
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }], // 12px
      sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.01em" }], // 14px
      base: ["0.9375rem", { lineHeight: "1.5rem", letterSpacing: "0.01em" }], // 15px base
      lg: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0.01em" }], // 16px
      xl: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }], // 18px
      "2xl": ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }], // 20px
      "3xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }], // 24px
      "4xl": ["2rem", { lineHeight: "2.5rem", letterSpacing: "-0.02em" }], // 32px
      "5xl": ["2.5rem", { lineHeight: "3rem", letterSpacing: "-0.03em" }], // 40px
    },
    
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    lineHeight: {
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
  },
  
  // Spacing scale (consistent 4px base) - Premium spacing system
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "5rem", // 80px
    "5xl": "6rem", // 96px
  },
  
  // Component spacing
  componentSpacing: {
    card: {
      padding: "1.5rem", // 24px
      gap: "1rem", // 16px
    },
    section: {
      padding: {
        mobile: "1rem", // 16px
        desktop: "2rem", // 32px
      },
      gap: "2rem", // 32px
    },
    post: {
      padding: "1rem", // 16px
      gap: "0.75rem", // 12px
    },
  },
  
  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.5rem", // 8px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
    full: "9999px",
  },
  
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)",
  },
  
  // Transitions
  transitions: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
  
  // Breakpoints (matching Tailwind defaults)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  
  // Z-index scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

export default theme;


/**
 * App Configuration
 * Global settings and constants
 */

import { theme } from "./theme";

export const config = {
  // App metadata
  app: {
    name: "Socialite",
    description: "Premium social media platform",
    version: "4.1.0",
  },
  
  // Theme configuration
  theme,
  
  // Animation settings
  animations: {
    // Framer Motion variants
    page: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 },
    },
    
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    },
    
    // Stagger children animation
    staggerContainer: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    },
    
    staggerItem: {
      initial: { opacity: 0, y: 20 },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        },
      },
    },
  },
  
  // Layout constants
  layout: {
    navbarWidth: {
      md: "36", // 144px
      xl: "56", // 224px
    },
    sidebarWidth: {
      xl: "384px", // 384px (w-96)
    },
    maxWidth: "1280px", // max-w-screen-xl
    contentPadding: {
      mobile: "0.5rem", // 8px
      desktop: "1.5rem", // 24px
    },
  },
  
  // Post configuration
  post: {
    maxContentLength: 500,
    imageMaxWidth: "30rem", // 480px
    imageMaxHeight: "35rem", // 560px
  },
  
  // Toast configuration
  toast: {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  },
};

export default config;


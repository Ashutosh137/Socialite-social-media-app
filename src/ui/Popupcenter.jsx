import PropTypes from "prop-types";
import { MdClose as CloseIcon } from "react-icons/md";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Popupcenter = ({ children, closefunction = () => {} }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.section
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-[1050] flex items-center justify-center p-4"
      >
        {/* Background overlay */}
        <motion.div
          variants={backdropVariants}
          className="absolute inset-0 backdrop-blur-xl bg-black/70"
          onClick={closefunction}
        />

        {/* Popup content */}
        <motion.div
          variants={modalVariants}
          className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-border-default bg-bg-tertiary shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={closefunction}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg-elevated/90 backdrop-blur-xl text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-all duration-200 shadow-medium"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </motion.button>

          {/* Content */}
          <div className="overflow-y-auto scroll-hidden max-h-[90vh] p-6">
            {children}
          </div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
};

Popupcenter.defaultProps = {
  closefunction: () => {},
};

Popupcenter.propTypes = {
  children: PropTypes.node.isRequired,
  closefunction: PropTypes.func,
};

export { Popupcenter };

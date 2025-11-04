import React, { Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useUserdatacontext } from "../../service/context/usercontext";
import Button from "../../ui/button";
import Avatar from "../../ui/avatar";
import { MdPerson as PersonIcon } from "react-icons/md";
import { AiFillHome as CottageIcon } from "react-icons/ai";
import { BsSearch as SearchIcon } from "react-icons/bs";
import { MdNotifications as NotificationsIcon } from "react-icons/md";
import { MdAdd as AddIcon } from "react-icons/md";
import { MdSettings as SettingsIcon } from "react-icons/md";

function Mobilenavbar({ navbar, setpost }) {
  const { userdata, defaultprofileimage } = useUserdatacontext();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/home") return location.pathname === "/home";
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: CottageIcon, path: "/home" },
    { icon: SearchIcon, path: "/search" },
    { icon: NotificationsIcon, path: userdata?.username ? "/notification" : "/login" },
    { icon: PersonIcon, path: userdata?.username ? `/profile/${userdata.username}` : "/login" },
  ];

  return (
    <Fragment>
      {/* Mobile Top Navbar */}
      <AnimatePresence>
        {navbar && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-0 left-0 right-0 z-50 bg-bg-default/80 backdrop-blur-xl border-b border-border-default"
          >
            <header className="flex items-center justify-between px-4 py-3">
              <Link
                to={userdata?.username ? `/profile/${userdata.username}` : "/login"}
                className="flex-shrink-0"
              >
                <Avatar
                  src={userdata?.profileImageURL}
                  alt={userdata?.name || "Profile"}
                  size="md"
                  fallback={defaultprofileimage}
                  showBorder={true}
                  onClick={() => {}}
                />
              </Link>

              <Link to="/home">
                <motion.h1
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-2xl font-bold text-gradient cursor-pointer"
                >
                  Socialite
                </motion.h1>
              </Link>

              <Link
                to={userdata?.username ? "/setting" : "/login"}
                className="flex-shrink-0"
              >
                <motion.div
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(22, 24, 28, 0.5)" }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-bg-hover transition-all duration-200"
                >
                  <SettingsIcon className="text-text-secondary hover:text-text-primary transition-colors duration-200" />
                </motion.div>
              </Link>
            </header>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navbar */}
      <AnimatePresence>
        {navbar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-default/80 backdrop-blur-xl border-t border-border-default"
          >
            <div className="flex items-center justify-around py-2 px-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={item.path}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-3 rounded-full transition-all duration-200 ${
                          active
                            ? "bg-bg-tertiary text-accent-500 font-semibold"
                            : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
                        }`}
                      >
                        <Icon className={`text-2xl ${active ? "text-accent-500" : ""}`} />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Create Post Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              >
                <Button
                  onClick={() => setpost(true)}
                  className="rounded-full p-3 shadow-medium hover:shadow-glow"
                  size="sm"
                >
                  <AddIcon />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
}

export default Mobilenavbar;

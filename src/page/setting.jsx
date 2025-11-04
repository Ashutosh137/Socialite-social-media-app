import React, { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdKeyboardArrowRight as KeyboardArrowRightIcon } from "react-icons/md";
import { MdArrowBack as ArrowBackIcon } from "react-icons/md";
import Editfuserdata from "../layout/profile/editfuserdata";
import { auth } from "../service/Auth";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft as KeyboardArrowLeftIcon } from "react-icons/md";
import { Helmet } from "react-helmet";
import Block from "../layout/setting/block";
import Resetpassword from "../layout/setting/resetpassword";
import Report from "../layout/setting/Report";
import DeveloperContact from "../layout/setting/Develope";
import Button from "../ui/button";

export default function Setting() {
  const [active, setactive] = useState(
     ""
  );

  const navigate = useNavigate();

  const settingsItems = [
    {
      id: "account",
      label: "Account",
      icon: KeyboardArrowRightIcon,
    },
    {
      id: "password",
      label: "Password and Protection",
      icon: KeyboardArrowRightIcon,
    },
    {
      id: "bookmark",
      label: "Bookmark Collection",
      icon: KeyboardArrowRightIcon,
      action: () => navigate("/lists"),
    },
    {
      id: "block",
      label: "Who Can See Your Posts",
      icon: KeyboardArrowRightIcon,
    },
    {
      id: "report",
      label: "Report a Problem",
      icon: KeyboardArrowRightIcon,
    },
    {
      id: "developer",
      label: "Developer Contact",
      icon: KeyboardArrowRightIcon,
    },
  ];

  return (
    <Fragment>
      <Helmet>
        <title>Settings | Socialite</title>
      </Helmet>
      
      <div className="w-full flex flex-col md:flex-row h-screen overflow-hidden">
        {/* Left Sidebar - Settings List */}
      {active === "" &&  <div
          className={`${
            active === "" ? "block" : "hidden"
          } md:flex w-full   flex flex-col h-screen`}
        >
          {/* Header */}
          <div className="sticky top-0 z-20 bg-bg-default/80 backdrop-blur-xl border-b border-border-default">
            <div className="flex items-center gap-4 h-[53px] px-4">
              <button
                onClick={() => navigate("/home")}
                className="p-2 rounded-full hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowBackIcon className="text-xl" />
              </button>
              <h1 className="text-xl font-bold text-text-primary">Settings</h1>
            </div>
          </div>

          {/* Settings Items */}
         { <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setactive(item.id);
                    }
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full transition-all duration-200 group ${
                    isActive
                      ? "bg-bg-tertiary border border-border-default shadow-soft"
                      : "hover:bg-bg-hover"
                  }`}
                >
                  <span
                    className={`text-[15px] font-medium flex-1 text-left ${
                      isActive ? "text-text-primary font-semibold" : "text-text-primary"
                    }`}
                  >
                    {item.label}
                  </span>
                  <Icon
                    className={`text-xl flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-accent-500"
                        : "text-text-secondary group-hover:text-accent-500"
                    }`}
                  />
                </motion.button>
              );
            })}

            {/* Logout Button */}
            <Button
              onClick={() => {
                navigate("/login");
                auth.signOut();
              }}
              variant="outline"
              className="w-96 mt-4 border-border-error text-status-error hover:bg-status-error/10 hover:border-status-error"
            >
              Logout
            </Button>
          </div>}
        </div>}

        {/* Right Content - Active Setting */}
        <AnimatePresence mode="sync">
          {active !== "" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col -screen overflow-hidden"
            >
              <div className="sticky top-0 z-20 bg-bg-default/80 backdrop-blur-xl border-b border-border-default">
                <div className="flex items-center gap-4 h-[53px] px-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setactive("")}
                    // className="md:hidden p-2 rounded-full hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <KeyboardArrowLeftIcon className="text-xl" />
                  </motion.button>
                  <h1 className="text-xl font-bold text-text-primary flex-1">
                    {settingsItems.find(item => item.id === active)?.label || "Settings"}
                  </h1>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {active === "account" && <Editfuserdata />}
                {active === "password" && (
                  <Resetpassword toggle={() => setactive("")} />
                )}
                {active === "block" && <Block />}
                {active === "developer" && <DeveloperContact />}
                {active === "report" && <Report />}
              </div>
            </motion.div>
)}
        </AnimatePresence>
      </div>
    </Fragment>
  );
}

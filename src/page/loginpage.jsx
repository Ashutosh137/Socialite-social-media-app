import React from "react";
import { motion } from "framer-motion";
import Login from "../layout/login/login";
import { Helmet } from "react-helmet";
import { signinwithemail } from "../service/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export const Loginpage = () => {
  const navigate = useNavigate();
  const handelsubmit = async (email, pass) => {
    const data = await signinwithemail(email, pass);
    data && toast.success("login successfully ");
    data && navigate("/home");
    !data && toast.error("Email adrress and password may be incorrect");
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
      <Helmet>
        <title>Login | Socialite</title>
        <meta name="description" content="Login to Socialite" />
        <link rel="canonical" href="/login" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="login, socialite" />
        <meta name="author" content="Socialite" />
        <meta name="language" content="EN" />
      </Helmet>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Image Section - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <img
              className="w-full max-w-md"
              src="https://cdn.dribbble.com/users/4329662/screenshots/15802739/socialite_v3_final-08_copy.png"
              alt="Socialite"
            />
          </motion.div>
        </div>

        {/* Form Section - 1/2 width on desktop, full on mobile */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col items-center justify-center">
          <Login onenter={handelsubmit} role="login" />
        </div>
      </div>
    </div>
  );
};

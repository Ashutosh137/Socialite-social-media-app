import { motion } from "framer-motion";
import { signupwithemail } from "../service/Auth/index";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Login from "../layout/login/login";
import { toast } from "react-toastify";

const Signuppage = () => {
  const navigate = useNavigate();

  const handelsubmit = async (email, pass) => {
    const sigup = await signupwithemail(email, pass);
    sigup && toast.success("signup successfully ");
    sigup && navigate("/create-account");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
      <Helmet>
        <title>Sign up | Socialite</title>
        <meta name="description" content="Sign up for Socialite" />
        <link rel="canonical" href="/" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="sign up, socialite, register" />
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
          <Login onenter={handelsubmit} role="signup" />
        </div>
      </div>
    </div>
  );
};

export default Signuppage;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth } from "../service/Auth";
import {
  check_data_is_exist,
  check_username_is_exist,
  Create_Account,
  get_userdata,
} from "../service/Auth/database";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useUserdatacontext } from "../service/context/usercontext";
import ProgressBar from "@badrap/bar-of-progress";
import Button from "../ui/button";
import { Input, TextInput } from "../ui/input";

const CreateAccount = () => {
  const pregress = new ProgressBar();
  const navigate = useNavigate();
  const { setuserdata } = useUserdatacontext();
  const [IsUsernameExist, setIsUsernameExist] = useState(false);

  useEffect(() => {
    const data = async () => {
      if (await check_data_is_exist(auth?.currentUser?.uid)) {
        navigate("/home");
      }
    };
    data();
  });

  const [formdata, setformdata] = useState({
    name: "",
    username: "",
    bio: "",
    age: "",
  });

  const checkdata = async () => {
    pregress.start();
    await Create_Account({
      email: auth.currentUser.email,
      uid: auth.currentUser.uid,
      bio: formdata.bio,
      name: formdata.name,
      age: formdata.age,
      username: formdata.username,
      profileimg: auth.currentUser.photoURL || null,
    });
    setuserdata(await get_userdata(auth?.currentUser?.uid));
    pregress.finish();
    navigate("/home");
  };

  const handelchange = (e) => {
    const { name, value } = e.target;
    setformdata((prevData) => ({ ...prevData, [name]: value }));
  };

  const handelusername = async (e) => {
    handelchange(e);
    const data = await check_username_is_exist(
      e.target.value.trim().toLowerCase(),
    );
    const isValidInput = /^[a-zA-Z0-9_]+$/.test(
      e.target.value.trim().toLowerCase(),
    );
    if (data || !isValidInput) {
      setIsUsernameExist(true);
      e.target.style.borderColor = "red";
    } else {
      setIsUsernameExist(false);
      e.target.style.borderColor = "black";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <Helmet>
        <title>Create account | Socialite</title>
        <meta name="description" content="Create account" />
        <link rel="canonical" href="/Create account" />
        <meta name="robots" content="index, follow" />
       
        <meta name="keywords" content="Create account" />
        <meta name="author" content="Create account" />
        <meta name="language" content="EN" />
      </Helmet>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-text-primary mb-8 text-center"
      >
        Create your account
      </motion.h1>
      
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          !IsUsernameExist && checkdata();
        }}
      >
        <Input
          type="text"
          name="username"
          label="Username"
          className="max-w-full"
          placeholder="Enter your unique username..."
          maxLength={20}
          value={formdata.username}
          onChange={handelusername}
          required
        />

        <p className="text-text-tertiary text-sm -mt-4">
          Username should not include any special characters
        </p>

        {IsUsernameExist && (
          <p className="text-status-error text-sm -mt-4">
            Invalid username or already exists
          </p>
        )}

        <Input
          type="text"
          name="name"
          label="Full Name"
          className="max-w-full"
          placeholder="Enter your full name..."
          value={formdata.name}
          onChange={handelchange}
          required
        />

        <Input
          type="date"
          name="age"
          label="Date of Birth"
          className="max-w-full"
          value={formdata.age}
          onChange={handelchange}
          required
        />

        <TextInput
          name="bio"
          label="Bio (Optional)"
          className="max-w-full"
          placeholder="Write about your experience, favorite topics, and more about you..."
          value={formdata.bio}
          onChange={handelchange}
        />
        
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-4"
          size="lg"
          disabled={IsUsernameExist}
        >
          Create Account
        </Button>
      </motion.form>
    </div>
  );
};

export default CreateAccount;

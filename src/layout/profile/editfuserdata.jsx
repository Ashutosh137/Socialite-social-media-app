import React, { useEffect, useState } from "react";
import { useUserdatacontext } from "../../service/context/usercontext";
import ProgressBar from "@badrap/bar-of-progress";
import { MdLinkedCamera as LinkedCameraIcon } from "react-icons/md";
import { toast } from "react-toastify";
import {
  Getimagedownloadlink,
  check_username_is_exist,
} from "../../service/Auth/database";
import { auth } from "../../service/Auth";

export default function Editfuserdata({ toggle = () => {} }) {
  const progress = new ProgressBar();
  const { userdata, setuserdata, defaultprofileimage } = useUserdatacontext();
  const [editformdata, seteditformdata] = useState(userdata);
  const [isusernameexist, setisusernameexist] = useState(false);

  const [profileimage, setprofileimage] = useState(null);
  const [profileimgurl, setprofileimgurl] = useState(
    userdata?.profileImageURL || defaultprofileimage,
  );

  useEffect(() => {
    return () => {
      progress.finish();
    };
  }, []);

  const handelchange = (e) => {
    const { name, value } = e.target;
    name === "bio"
      ? seteditformdata((prevData) => ({ ...prevData, [name]: value }))
      : seteditformdata((prevData) => ({ ...prevData, [name]: value.trim() }));
  };

  return (
    <section className="sm:p-8 post p-4 w-full text-left text-base ">
      <header className="text-center m-auto w-60 font-semibold text-xl capitalize  border-b-2 pb-2 rounded-md border-white">
        <h2>edit profile data</h2>
      </header>
      <form
        className="flex flex-col space-y-2 "
        onSubmit={async (e) => {
          e.preventDefault();
          progress.start();
          if (profileimage) {
            try {
              const data = await Getimagedownloadlink(
                profileimage,
                auth.currentUser.uid,
              );
              if (!isusernameexist) {
                setuserdata(() => ({ ...editformdata, profileImageURL: data }));
              }
              setprofileimgurl(data);
              toast.success("Updated successfully");
            } catch (error) {
              console.error("Error fetching image download link:", error);
              toast.error("Failed to update profile");
            }
          } else {
            if (!isusernameexist && userdata !== editformdata) {
              setuserdata(editformdata);
              setprofileimgurl(editformdata.profileImageURL);
              toast.success("Updated successfully");
            }
          }
          progress.finish();
          toggle();
        }}
      >
        <div className="my-5 flex flex-col m-auto">
          <img
            title="click to change the profile photo"
            className="w-28 object-fill h-28 opacity-90  m-auto rounded-full"
            src={profileimgurl}
            onError={(e) => {
              e.target.src = defaultprofileimage;
            }}
          />
          <i
            onClick={() => {
              document.getElementById("file").click();
            }}
            className=" left-4 z-10 text-black m-auto -mt-16 sticky"
          >
            <LinkedCameraIcon />
          </i>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              setprofileimage(e.target.files[0]);
              setprofileimgurl(URL.createObjectURL(e.target.files[0]));
            }}
            name="profileImageURL"
            id="file"
            className="hidden"
          />
        </div>
        <div className="flex-col flex space-y-2 ">
          <label
            autoFocus
            className="md:text-xl mx-3 border-b-2 border-gray-800"
          >
            {" "}
            username
          </label>
          <input
            type="text"
            name="username"
            placeholder="enter your unique uername..."
            minLength={6}
            value={editformdata?.username}
            className="px-5 placeholder:capitalize bg-black  border-2 border-gray-300  placeholder:text-neutral-500  sm:text-lg text-sm p-2 border-1   rounded-2xl  "
            onChange={async (e) => {
              handelchange(e);
              const data = await check_username_is_exist(e.target.value.trim());
              const isValidInput = /^[a-z0-9]+$/.test(e.target.value.trim());

              if (data[1] || !isValidInput) {
                setisusernameexist(true);
                e.target.style.borderColor = "red";
              } else {
                setisusernameexist(false);
                e.target.style.borderColor = "white";
              }
            }}
            required
          ></input>
        </div>

        {isusernameexist && (
          <label className="text-red-400 mx-3  capitalize">
            invalid username or already exist
          </label>
        )}

        <div className="flex-col flex ">
          <label className="md:text-xl border-b-2 border-gray-800   p-2 mx-3 ">
            {" "}
            full name
          </label>

          <input
            type="text"
            name="name"
            placeholder="full name..."
            value={editformdata?.name}
            className="px-5 placeholder:capitalize bg-black   border-2 border-gray-300  placeholder:text-neutral-500  sm:text-lg text-sm p-2 border-1   rounded-2xl   "
            onChange={handelchange}
            required
          ></input>
        </div>

        <div className="flex-col flex space-y-2">
          <label className="md:text-xl    p-2 mx-3 border-b-2 border-gray-800  ">
            {" "}
            date of birth
          </label>

          <input
            aria-invalid={
              !(
                [editformdata].age > new Date() ||
                editformdata?.age < new Date("1970-1-1")
              )
            }
            type="date"
            name="age"
            value={editformdata?.dateofbirth}
            className="px-5 placeholder:capitalize bg-black   border-2 border-gray-300  w-full placeholder:text-neutral-500    sm:text-lg text-sm p-2 border-1   rounded-2xl    "
            onChange={handelchange}
            required
          ></input>
        </div>
        <div className="flex-col  flex ">
          <label className="md:text-xl    p-2 mx-3 border-b-2 border-gray-800  ">
            bio
          </label>

          <textarea
            type="text"
            name="bio"
            placeholder="write about your exprience , your favirate topics and many more about you "
            value={editformdata?.bio}
            className="px-5 placeholder:capitalize bg-black -white  border-2 border-gray-300  capitalize  placeholder:text-neutral-500 sm:text-lg text-sm p-2 border-1 rounded-2xl   "
            onChange={handelchange}
          ></textarea>
        </div>
        <div className=" m-auto">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 rounded-full m-auto  shadow-lg
          capitalize p-3 px-5 w-60 my-3 font-semibold "
          >
            edit profile
          </button>
        </div>
      </form>
    </section>
  );
}

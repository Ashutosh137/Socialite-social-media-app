import React from "react";
import { useUserdatacontext } from "../../service/context/usercontext";
import { useNavigate } from "react-router-dom";
import { auth } from "../../service/Auth";
import { Popupcenter } from "../../ui/Popupcenter";

function Menu({ setactive, profileuserdata }) {
  const navigate = useNavigate();
  const { userdata, setuserdata } = useUserdatacontext();
  return (
    <Popupcenter
      closefunction={() => {
        setactive("");
      }}
    >
      <div className="flex flex-col space-y-2 divide-y">
        <button
          className="sm:w-40 capitalize  p-1  hover:bg-gray-950 "
          onClick={() => {
            navigator.share({
              title:
                "Spreading the Vibes: Check Out My Latest Socialite Post! ",
              text: "Embark on a journey through elegance and excitement! My newest post on Socialite App is here to dazzle your feed. Swipe up to experience the glitz, glamour, and all things fabulous!",
              url: window.location.href,
            });
            setactive("");
          }}
        >
          share profile{" "}
        </button>
        <button
          className="sm:w-40 capitalize  p-1   hover:bg-gray-950"
          onClick={() => {
            setactive("about");
          }}
        >
          about profile{" "}
        </button>
        {profileuserdata?.username !== userdata?.username ? (
          <>
            <button
              className="sm:w-40 capitalize  p-1  text-red-500 hover:bg-gray-950"
              onClick={() => {
                auth.currentUser && setactive("report");
              }}
            >
              report{" "}
            </button>
            <button
              className="sm:w-40 capitalize  p-1  hover:bg-gray-950 text-red-500 "
              onClick={() => {
                auth.currentUser &&
                  !userdata?.block?.includes(profileuserdata?.uid) &&
                  setactive("block");
                userdata?.block?.includes(profileuserdata?.uid) &&
                  setuserdata((prev) => ({
                    ...prev,
                    block: prev?.block?.filter(
                      (item) => item !== profileuserdata?.uid,
                    ),
                  }));
              }}
            >
              {userdata?.block?.includes(profileuserdata?.uid)
                ? "Unblock"
                : "block"}{" "}
            </button>
          </>
        ) : (
          <>
            <button
              className="sm:w-40 capitalize  p-1   hover:bg-gray-950"
              onClick={() => {
                navigate("/setting");
              }}
            >
              account settings
            </button>
          </>
        )}
      </div>
    </Popupcenter>
  );
}

export default Menu;

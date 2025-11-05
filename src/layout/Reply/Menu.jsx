import React from "react";
import { Popupcenter } from "../../ui/Popupcenter";
import { useNavigate } from "react-router-dom";
import { useUserdatacontext } from "../../service/context/usercontext";

function Menu({ setactive, comment, commentby, delcomment, post }) {
  const navigate = useNavigate();
  const { userdata } = useUserdatacontext();
  return (
    <Popupcenter
      closefunction={() => {
        setactive("");
      }}
    >
      <div className="flex flex-col divide-y space-y-3">
        <button
          className="w-40 p-1  text-white hover:bg-gray-950 "
          onClick={() => {
            navigate(`/profile/${commentby?.username} `);
          }}
        >
          View profile
        </button>
        <button
          className="w-40 p-1  text-red-500 hover:bg-gray-950 "
          onClick={() => {
            setactive("report");
          }}
        >
          Report
        </button>
        {(userdata?.username === commentby?.username ||
          post?.postedby === userdata?.uid) && (
          <button
            className="w-40 p-1  text-red-500 hover:bg-gray-950 "
            onClick={() => {
              delcomment();
            }}
          >
            Delete
          </button>
        )}
      </div>
    </Popupcenter>
  );
}

export default Menu;

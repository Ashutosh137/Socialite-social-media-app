import React from "react";
import { MdVisibilityOff as VisibilityOffIcon } from "react-icons/md";

function HidePost({ sethide, setactive }) {
  return (
    <div className="flex w-full sm:px-5 border-y-2 border-gray-950 rounded-3xl p-2 justify-around align-middle ">
      <div className="flex mx-5 w-full sm:space-x-5 space-x-2">
        <i className="text-gray-500 my-auto px-3 ">
          <VisibilityOffIcon />
        </i>
        <label className="font-semibold text-gray-400  m-auto text-base ">
          Post hidden
        </label>
      </div>

      <button
        onClick={() => {
          sethide(false);
          setactive("");
        }}
        className="px-8 capitalize mr-auto sm:mx-5 p-2 rounded-full text-sm md:text-base text-gray-400 hover:bg-gray-950 bg-gray-900"
      >
        undo
      </button>
    </div>
  );
}

export default HidePost;

import React from "react";
import { MdCameraEnhance as CameraEnhanceIcon } from "react-icons/md";

function FirstPost({ setactive }) {
  return (
    <div className="w-full my-20 flex flex-col  justify-center">
      <i className="rounded-full m-auto text-zinc-800 scale-125 border-2 border-stone-700 p-3  my-2 flex justify-center ">
        <CameraEnhanceIcon />
      </i>
      <h1 className="sm:text-3xl text-lg font-bold text-center my-1">
        share your first post
      </h1>
      <button
        onClick={() => {
          setactive("post");
        }}
        className="rounded-2xl text-lg md:text-xl px-10 border-white my-5 p-2 mr-auto  border-1 capitalize bg-sky-600 hover:scale-105 transition-all m-auto ease"
      >
        post
      </button>
    </div>
  );
}

export default FirstPost;

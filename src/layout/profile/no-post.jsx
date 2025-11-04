import React from "react";
import { MdCameraEnhance as CameraEnhanceIcon } from "react-icons/md";

function NoPost() {
  return (
    <div className="w-full my-12 flex flex-col justify-center">
      <i className="rounded-full m-auto text-zinc-800 border-2 border-stone-700 p-3  flex justify-center ">
        <CameraEnhanceIcon />
      </i>
      <h1 className="text-3xl font-bold text-center my-2">no post yet</h1>
    </div>
  );
}

export default NoPost;

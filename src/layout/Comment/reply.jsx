import React, { useState, useEffect } from "react";
import { useUserdatacontext } from "../../service/context/usercontext";
import { Create_notification, get_userdata } from "../../service/Auth/database";
import { MdFavoriteBorder as FavoriteBorderIcon } from "react-icons/md";
import Time from "../../service/utiles/time";
import { Skeleton } from "../../ui/skeleton";
import { auth } from "../../service/Auth";
import { toast } from "react-toastify";
import { MdMoreVert as MoreVertIcon } from "react-icons/md";
import { Popupitem } from "../../ui/popup";
import { MdFavorite as FavoriteIcon } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Menu from "../Reply/Menu";

export default function Reply({ reply, setcommentpost }) {
  const { userdata, defaultprofileimage } = useUserdatacontext();
  const [commentby, setcommentby] = useState(null);
  const [loadingimg, setloadingimg] = useState(true);
  const navigate = useNavigate();
  const [active, setactive] = useState("");
  const [comment, setcomment] = useState(reply || null);

  useEffect(() => {
    const data = async () => {
      const commentby = await get_userdata(comment?.postedby);
      setcommentby(commentby);
    };
    data();
  }, [comment?.postedby]);

  useEffect(() => {
    setcomment(reply);
  }, [reply]);

  useEffect(() => {
    const data = () => {
      if (comment && auth.currentUser) {
        setcommentpost((prev) => ({
          ...prev,
          reply: prev?.reply.map((repli) => {
            if (repli.replyid === comment?.replyid) return comment;
            else {
              return repli;
            }
          }),
        }));
      }
    };

    data();
  }, [comment]);

  const handellike = async () => {
    auth.currentUser && comment?.likes.includes(userdata?.uid)
      ? setcomment((prev) => ({
          ...prev,
          likes: prev.likes.filter((e) => e !== userdata?.uid),
        }))
      : setcomment((prev) => ({
          ...prev,
          likes: [...prev.likes, userdata?.uid],
        }));

    !comment?.likes.includes(userdata?.uid) &&
      (await Create_notification(commentby?.uid, {
        likeby: userdata?.uid,
        type: "replylike",
        postid: post?.postid,
      }));
  };

  const delcomment = () => {
    setcommentpost((pre) => ({
      ...pre,
      reply: pre.reply.filter((rep) => rep.replyid !== comment?.replyid),
    }));
  };

  if (commentby?.block?.includes(userdata?.uid)) {
    return <></>;
  }
  return (
    <section className="post border border-gray-600 p-4 rounded-xl ml-auto text-xs sm:text-sm  ">
      <div className="capitalize flex w-full  sm:space-x-2 ">
        <img
          className="rounded-full mx-2 bg-gray-400 outline outline-neutral-800 w-5 sm:w-7 h-5 sm:h-7"
          src={commentby?.profileImageURL || defaultprofileimage}
          alt={defaultprofileimage}
          onError={(e) => {
            e.target.src = defaultprofileimage;
          }}
        />
        <div className="flex w-full space-y-1 sm:mx-3 flex-col">
          <div className="flex relative text-sm">
            <label className="font-semibold overflow ">
              {commentby?.name || (
                <Skeleton
                  animation="wave"
                  sx={{ bgcolor: "grey.900" }}
                  variant="text"
                  width={window.innerWidth >= 400 ? 100 : 50}
                />
              )}
            </label>
            <label
              className="text-gray-500 overflow mx-2 flex space-x-3 text-sm"
              onClick={() => {
                navigate(`/profile/${commentby?.username} `);
              }}
            >
              @
              {commentby?.username || (
                <Skeleton
                  animation="wave"
                  sx={{ bgcolor: "grey.900" }}
                  variant="text"
                  width={window.innerWidth >= 400 ? 100 : 50}
                />
              )}
            </label>
            <label className="text-gray-500 ">
              {Time(comment.postedat?.toJSON().seconds)}
            </label>
            <label
              className="ml-auto mx-2"
              onClick={() => {
                active === "menu" ? setactive("") : setactive("menu");
              }}
            >
              <MoreVertIcon />
            </label>
            {active === "menu" && (
              <Menu
                comment={comment}
                commentby={commentby}
                setactive={setactive}
              />
            )}
          </div>

          <div className="flex flex-col my-2">
            <pre className="capitalize whitespace-pre-wrap my-1 text-sm font-sans text-left w-full ">
              {comment?.content}
            </pre>
            <div className="">
              {loadingimg && comment?.image && (
                <Skeleton
                  animation="wave"
                  sx={{ bgcolor: "grey.900" }}
                  variant="rectangular"
                  width={window.innerWidth >= 400 ? 200 : 100}
                  height={window.innerWidth >= 400 ? 200 : 100}
                />
              )}
              {comment?.image && (
                <img
                  onDoubleClick={handellike}
                  onLoadCapture={() => {
                    setloadingimg(false);
                  }}
                  src={comment?.image}
                  className={`w-40 rounded-xl aspect-auto my-2 ${
                    loadingimg ? "hidden" : "block"
                  }  `}
                />
              )}
            </div>
            <div className="flex mr-auto my-2 text-gray-400 space-x-1  ">
              <label className=" text-sm my-auto">{comment.likes.length}</label>
              <div className="flex space-x-3">
                <i onClick={handellike} className="hover:text-red-900">
                  {comment?.likes.includes(userdata?.uid) ? (
                    <FavoriteIcon style={{ color: "rgb(249, 24, 128)" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </i>
              </div>
            </div>
          </div>

          {active === "report" && (
            <Popupitem
              closefunction={() => {
                setactive("");
              }}
            >
              <div className="max-w-sm m-auto mb-10">
                <p className="text-xl text-center my-7 capitalize ">
                  report this comment
                </p>
                <select className="mx-2 w-full my-8 p-3 bg-black capitalize text-white text-base border-2 px-4 border-white rounded-xl ">
                  {" "}
                  <option value="hateSpeech">Hate Speech</option>
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment</option>
                  <option value="violence">Violence</option>
                  <option value="falseInformation">False Information</option>
                  <option value="inappropriateContent">
                    Inappropriate Content
                  </option>
                  <option value="copyrightViolation">
                    Copyright Violation
                  </option>
                  <option value="impersonation">Impersonation</option>
                </select>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      setactive("");
                    }}
                    className="px-8 outline outline-neutral-800 capitalize m-auto p-2 rounded-full hover:bg-gray-950 bg-gray-900 text-white"
                  >
                    cancel
                  </button>
                  <button
                    onClick={() => {
                      setactive("");
                      toast.success("Report sucessfully");
                    }}
                    className="px-8 capitalize m-auto p-2 rounded-full hover:bg-red-700 bg-red-600 text-white"
                  >
                    report
                  </button>
                </div>
              </div>
            </Popupitem>
          )}
        </div>
      </div>
    </section>
  );
}

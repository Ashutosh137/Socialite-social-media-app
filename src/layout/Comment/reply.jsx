import React, { useState, useEffect } from "react";
import { useUserdatacontext } from "../../service/context/usercontext";
import { Create_notification, get_userdata } from "../../service/Auth/database";
import { MdFavoriteBorder as LikeIcon } from "react-icons/md";
import { MdFavorite as LikedIcon } from "react-icons/md";
import { MdMoreVert as MoreIcon } from "react-icons/md";
import Time from "../../service/utiles/time";
import { Skeleton } from "../../ui/skeleton";
import Avatar from "../../ui/avatar";
import ActionButton from "../../ui/action-button";
import { auth } from "../../service/Auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Linkify from "linkify-react";
import Menu from "../Reply/Menu";
import Report from "../profile/report";

export default function Reply({ reply, setcommentpost, cuutcomment }) {
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
    if (!auth?.currentUser) {
      toast.error("Login required");
      return;
    }

    const wasLiked = comment?.likes.includes(userdata?.uid);
    
    // Optimistically update UI
    setcomment((prev) => ({
      ...prev,
      likes: wasLiked
        ? prev.likes.filter((e) => e !== userdata?.uid)
        : [...prev.likes, userdata?.uid],
    }));

    // Send notification if liking (not unliking)
    if (!wasLiked && commentby?.username !== userdata?.username) {
      try {
        await Create_notification(commentby?.uid, {
          likeby: userdata?.uid,
          type: "replylike",
          postid: cuutcomment?.postid || comment?.postid,
        });
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    }
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

  const isLiked = comment?.likes?.includes(userdata?.uid);

  return (
    <article className="relative border-b border-border-default/50 hover:bg-bg-hover/20 transition-all duration-200 ease-out overflow-hidden group">
      {/* Reply Container */}
      <div className="flex gap-3 px-4 py-4 w-full max-w-full overflow-hidden">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <Avatar
            src={commentby?.profileImageURL}
            alt={commentby?.name || "Profile"}
            size="md"
            fallback={defaultprofileimage}
            onClick={(e) => {
              e?.stopPropagation?.();
              navigate(`/profile/${commentby?.username}`);
            }}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${commentby?.username}`);
              }}
              className="flex items-center gap-1.5 cursor-pointer group/header flex-wrap"
            >
              {commentby?.name ? (
                <>
                  <span className="font-semibold text-[15px] text-text-primary hover:underline transition-all duration-200 group-hover/header:text-accent-500">
                    {commentby.name}
                  </span>
                  <span className="text-[15px] text-text-secondary truncate max-w-[120px] md:max-w-none">
                    @{commentby.username}
                  </span>
                  <span className="text-[15px] text-text-secondary">·</span>
                  <span className="text-[15px] text-text-secondary hover:underline transition-colors duration-200">
                    {Time(comment.postedat?.toJSON().seconds)}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-2 w-full">
                  <Skeleton
                    animation="wave"
                    sx={{ bgcolor: "grey.900" }}
                    variant="text"
                    width={120}
                    height={16}
                  />
                  <Skeleton
                    animation="wave"
                    sx={{ bgcolor: "grey.900" }}
                    variant="text"
                    width={80}
                    height={16}
                  />
                </div>
              )}
            </div>

            {/* Menu Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                active === "menu" ? setactive("") : setactive("menu");
              }}
              className="flex-shrink-0 p-1.5 rounded-full hover:bg-accent-500/10 text-text-secondary hover:text-accent-500 transition-all duration-200 active:scale-95"
              aria-label="Reply options"
            >
              <MoreIcon className="text-xl" />
            </button>
            
            {/* Reply Menu */}
            {active === "menu" && (
              <Menu
                comment={comment}
                commentby={commentby}
                setactive={setactive}
                delcomment={delcomment}
                post={cuutcomment}
              />
            )}
          </div>

          {/* Reply Content */}
          {comment?.content && (
            <div className="mb-3 break-long-words max-w-full overflow-hidden">
              <p className="text-[15px] text-text-primary leading-[1.6] whitespace-pre-wrap break-long-words">
                <Linkify 
                  className="text-text-primary break-long-words"
                  linkProps={{
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "text-accent-500 hover:text-accent-400 hover:underline transition-colors duration-200 break-words",
                  }}
                >
                  {comment.content}
                </Linkify>
              </p>
            </div>
          )}

          {/* Reply Image */}
          {comment?.image && (
            <div className="relative rounded-2xl overflow-hidden border border-border-default/50 mb-3 cursor-pointer group/image transition-all duration-300 hover:border-border-hover/50 hover:shadow-lg hover:shadow-black/20">
              {loadingimg && (
                <div className="w-full aspect-video bg-bg-tertiary animate-pulse flex items-center justify-center">
                  <Skeleton
                    animation="wave"
                    sx={{ bgcolor: "grey.900", borderRadius: "1rem" }}
                    variant="rectangular"
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
              <img
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handellike();
                }}
                onLoad={() => setloadingimg(false)}
                src={comment.image}
                className={`${
                  loadingimg ? "hidden" : "block"
                } w-full max-h-[600px] object-cover transition-transform duration-300 group-hover/image:scale-[1.02]`}
                alt="Reply"
                loading="lazy"
              />
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between mt-3 max-w-[500px]">
            {/* Like Button with Count */}
            <div className="flex items-center gap-1.5">
              <ActionButton
                icon={isLiked ? LikedIcon : LikeIcon}
                label="Like"
                variant="like"
                isActive={isLiked}
                onClick={(e) => {
                  e.stopPropagation();
                  handellike();
                }}
              />
              {comment?.likes?.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-[13px] font-medium text-text-secondary hover:text-social-like transition-colors duration-200 cursor-pointer min-w-[20px]"
                >
                  {comment.likes.length}
                </button>
              )}
            </div>
          </div>

          {active === "report" && <Report setactive={setactive} />}
        </div>
      </div>
    </article>
  );
}

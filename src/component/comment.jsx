import { useState, useEffect } from "react";
import { useUserdatacontext } from "../service/context/usercontext";
import { Create_notification, get_userdata } from "../service/Auth/database";
import { MdFavoriteBorder as LikeIcon } from "react-icons/md";
import { MdFavorite as LikedIcon } from "react-icons/md";
import { MdReply as ReplyIcon } from "react-icons/md";
import { MdMoreVert as MoreIcon } from "react-icons/md";
import Time from "../service/utiles/time";
import { Skeleton } from "../ui/skeleton";
import Avatar from "../ui/avatar";
import ActionButton from "../ui/action-button";
import { auth } from "../service/Auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Reply from "../layout/Comment/reply";
import Report from "../layout/profile/report";
import Menu from "../layout/Comment/Menu";
import Linkify from "linkify-react";

export default function Comment({ currentcomment, setpost, post, setactivation }) {
  const { userdata, defaultprofileimage } = useUserdatacontext();
  const [commentby, setcommentby] = useState(null);
  const [loadingimg, setloadingimg] = useState(true);
  const navigate = useNavigate();
  const [active, setactive] = useState("");
  const [comment, setcomment] = useState(currentcomment || null);

  useEffect(() => {
    setcomment(currentcomment);
  }, [currentcomment]);

  useEffect(() => {
    const data = async () => {
      const commentby = await get_userdata(comment?.postedby);
      setcommentby(commentby);
    };
    data();
  }, [comment?.postedby]);

  useEffect(() => {
    const data = async () => {
      if (comment && auth.currentUser) {
        setpost((prev) => ({
          ...prev,
          comments: prev?.comments.map((currcomment) => {
            if (comment.commentid === currcomment?.commentid) {
              return comment;
            } else return currcomment;
          }),
        }));
      }
    };
    data();
  }, [comment]);

  const handellike = async () => {
    if (!auth.currentUser) {
      toast.error("Login required");
      return;
    }

    if (comment?.likes.includes(userdata?.uid)) {
      setcomment((prev) => ({
        ...prev,
        likes: prev.likes.filter((e) => e !== userdata?.uid),
      }));
    } else {
      setcomment((prev) => ({
        ...prev,
        likes: [...prev.likes, userdata?.uid],
      }));
    }

    if (
      !comment?.likes.includes(userdata?.uid) &&
      auth?.currentUser &&
      commentby?.username !== userdata?.username
    ) {
      await Create_notification(commentby?.uid, {
        likeby: userdata?.uid,
        type: "commentlike",
        postid: post?.postid,
      });
    }
  };

  const delcomment = () => {
    setpost((pre) => ({
      ...pre,
      comments: pre?.comments.filter(
        (curr) => curr.commentid !== comment?.commentid,
      ),
    }));
  };

  if (commentby?.block?.includes(userdata?.uid)) {
    return <></>;
  }

  const isLiked = comment?.likes?.includes(userdata?.uid);

  return (
    <article className="relative border-b border-border-default/50 hover:bg-bg-hover/20 transition-all duration-200 ease-out overflow-hidden group">
      {/* Comment Container */}
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
                  {commentby?.uid === post?.postedby && (
                    <>
                      <span className="text-[15px] text-text-secondary">·</span>
                      <span className="text-[13px] text-text-secondary">Author</span>
                    </>
                  )}
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
              aria-label="Comment options"
            >
              <MoreIcon className="text-xl" />
            </button>
            
            {/* Comment Menu */}
            {active === "menu" && (
              <Menu
                delcomment={delcomment}
                setactive={setactive}
                post={post}
                commentby={commentby}
              />
            )}
          </div>

          {/* Comment Content */}
          {comment?.content && (
            <div
              className="mb-3 break-long-words max-w-full overflow-hidden"
            >
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

          {/* Comment Image */}
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
                alt="Comment"
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

            {/* Reply Button */}
            <ActionButton
              icon={ReplyIcon}
              label="Reply"
              variant="comment"
              count={comment?.reply?.length || 0}
              onClick={(e) => {
                e.stopPropagation();
                setactivation({
                  to: commentby?.username,
                  commentid: comment?.commentid,
                });
                setactive("reply");
              }}
            />
          </div>

          {/* Replies */}
          {active === "reply" && comment?.reply?.length > 0 && (
            <div className="mt-4 ml-4 border-l border-border-default/50 pl-4 space-y-0">
              {comment.reply.map((reply, index) => (
                <Reply
                  key={index}
                  cuutcomment={comment}
                  reply={reply}
                  setcommentpost={setcomment}
                />
              ))}
            </div>
          )}

          {active === "report" && <Report setactive={setactive} />}
        </div>
      </div>
    </article>
  );
}

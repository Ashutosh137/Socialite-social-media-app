import { useState, useEffect } from "react";
import { useUserdatacontext } from "../service/context/usercontext";
import { Create_notification, get_userdata } from "../service/Auth/database";
import { MdFavoriteBorder as FavoriteBorderIcon } from "react-icons/md";
import { MdFavorite as FavoriteIcon } from "react-icons/md";
import { MdReply as ReplyIcon } from "react-icons/md";
import { MdMoreVert as MoreVertIcon } from "react-icons/md";
import Time from "../service/utiles/time";
import { Skeleton } from "../ui/skeleton";
import Avatar from "../ui/avatar";
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
    <div className="flex gap-3 px-4 py-4 hover:bg-bg-hover/30 transition-colors">
      {/* Avatar */}
      <Avatar
        src={commentby?.profileImageURL}
        alt={commentby?.name || "Profile"}
        size="md"
        fallback={defaultprofileimage}
        onClick={() => navigate(`/profile/${commentby?.username}`)}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start gap-2 mb-1">
          <div
            onClick={() => navigate(`/profile/${commentby?.username}`)}
            className="flex items-center gap-1 cursor-pointer group flex-1"
          >
            {commentby?.name ? (
              <>
                <span className="font-bold text-[15px] text-text-primary hover:underline">
                  {commentby.name}
                </span>
                <span className="text-[15px] text-text-secondary">
                  @{commentby.username}
                </span>
                <span className="text-[15px] text-text-secondary">·</span>
                <span className="text-[15px] text-text-secondary hover:underline">
                  {Time(comment.postedat?.toJSON().seconds)}
                </span>
                {commentby?.uid === post?.postedby && (
                  <span className="text-[13px] text-text-secondary ml-1">· Author</span>
                )}
              </>
            ) : (
              <Skeleton
                animation="wave"
                sx={{ bgcolor: "grey.900" }}
                variant="text"
                width={200}
                height={20}
              />
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              active === "menu" ? setactive("") : setactive("menu");
            }}
            className="p-2 rounded-full hover:bg-accent-500/10 text-text-secondary hover:text-accent-500 transition-colors"
          >
            <MoreVertIcon className="text-xl" />
          </button>
          
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
        <div className="mb-3">
          <p className="text-[15px] text-text-primary leading-5 whitespace-pre-wrap break-words mb-3">
            <Linkify>{comment?.content}</Linkify>
          </p>
          
          {comment?.image && (
            <div className="mb-3">
              {loadingimg && (
                <Skeleton
                  animation="wave"
                  sx={{ bgcolor: "grey.900", borderRadius: "1rem" }}
                  variant="rectangular"
                  width={320}
                  height={225}
                />
              )}
              <img
                onDoubleClick={handellike}
                onLoad={() => setloadingimg(false)}
                src={comment?.image}
                className={`rounded-2xl max-w-[320px] object-cover ${
                  loadingimg ? "hidden" : "block"
                }`}
                alt="Comment"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handellike}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-social-like/10 text-text-secondary hover:text-social-like transition-colors"
          >
            {isLiked ? (
              <FavoriteIcon className="text-xl text-social-like" />
            ) : (
              <FavoriteBorderIcon className="text-xl" />
            )}
            {comment?.likes?.length > 0 && (
              <span className={`text-[13px] ${isLiked ? "text-social-like" : ""}`}>
                {comment.likes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setactivation({
                to: commentby?.username,
                commentid: comment?.commentid,
              });
              setactive("reply");
            }}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-accent-500/10 text-text-secondary hover:text-accent-500 transition-colors"
          >
            <ReplyIcon className="text-xl" />
            {comment?.reply?.length > 0 && (
              <span className="text-[13px]">{comment.reply.length}</span>
            )}
          </button>
        </div>

        {/* Replies */}
        {active === "reply" && comment?.reply?.length > 0 && (
          <div className="mt-4 ml-4 border-l border-border-default pl-4 space-y-4">
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
  );
}

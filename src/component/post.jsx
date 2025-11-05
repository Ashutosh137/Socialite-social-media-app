import { useCallback, useEffect, useState, useRef } from "react";
import { auth } from "../service/Auth";
import { MdComment as CommentIcon } from "react-icons/md";
import { MdFavoriteBorder as LikeIcon } from "react-icons/md";
import { MdFavorite as LikedIcon } from "react-icons/md";
import { MdBookmarkBorder as BookmarkIcon } from "react-icons/md";
import { MdBookmark as BookmarkedIcon } from "react-icons/md";
import { MdBarChart as ViewsIcon } from "react-icons/md";
import { MdMoreVert as MoreIcon } from "react-icons/md";
import { MdShare as ShareIcon } from "react-icons/md";
import { Skeleton } from "../ui/skeleton";
import { Popupitem } from "../ui/popup";
import Avatar from "../ui/avatar";
import ActionButton from "../ui/action-button";
import Linkify from "linkify-react";
import { useUserdatacontext } from "../service/context/usercontext";
import {
  Create_notification,
  get_userdata,
  updatepost,
} from "../service/Auth/database";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Time, { formatNumber } from "../service/utiles/time";
import Addcomment from "./addcomment";
import PostMenu from "../layout/post/PostMenu";
import HidePost from "../layout/post/HidePost";
import LikePost from "../layout/post/likePost";
import DeletePost from "../layout/post/DeletePost";
import Report from "../layout/post/Report";

export const Post = ({ postdata, popup = true }) => {
  const { userdata, handlesave, delete_post, defaultprofileimage } =
    useUserdatacontext();
  const [active, setactive] = useState("");
  const [post, setpost] = useState(postdata || null);
  const [hide, sethide] = useState(false);
  const [postedby, setpostedby] = useState(null);
  const [loadingimg, setloadingimg] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = async () => {
      const postedby = await get_userdata(post?.postedby);
      setpostedby(postedby);
    };
    data();
  }, [post]);

  // Debounce post updates to prevent excessive database calls
  const updatePostDebounced = useCallback(async () => {
    if (post && postedby?.uid) {
      try {
        await updatepost(post, postedby.uid);
      } catch (error) {
        console.error("Error updating post:", error);
      }
    }
  }, [post, postedby?.uid]);

  const postUpdateRef = useRef(false);

  useEffect(() => {
    // Only update if post actually changed (not on initial mount)
    if (post && postedby?.uid && postUpdateRef.current) {
      const timeoutId = setTimeout(() => {
        updatePostDebounced();
      }, 1000); // Debounce by 1 second

      return () => clearTimeout(timeoutId);
    } else {
      postUpdateRef.current = true;
    }
  }, [post, postedby?.uid, updatePostDebounced]);

  const handleLike = useCallback(async () => {
    if (!auth?.currentUser) {
      toast.error("Login required");
      return;
    }

    const wasLiked = post?.likes.includes(userdata?.uid);
    
    // Optimistically update UI
    setpost((prev) => ({
      ...prev,
      likes: wasLiked
        ? prev.likes.filter((e) => e !== userdata?.uid)
        : [...prev.likes, userdata?.uid],
    }));

    // Send notification if liking (not unliking)
    if (!wasLiked && postedby?.username !== userdata?.username) {
      try {
        await Create_notification(post?.postedby, {
          likeby: userdata?.uid,
          type: "postlike",
          postid: post?.postid,
        });
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    }
  }, [auth, post, userdata, postedby]);

  function handelactive(act) {
    active === act ? setactive("") : setactive(act);
  }

  // Track views only once per session
  useEffect(() => {
    const viewKey = `viewed_${post?.postid}`;
    if (post?.postid && !sessionStorage.getItem(viewKey)) {
      sessionStorage.setItem(viewKey, 'true');
      setpost((prev) => ({ ...prev, views: (prev.views || 0) + 1 }));
    }
  }, [post?.postid]);

  if (postedby?.block?.includes(userdata?.uid)) {
    return <></>;
  }

  if (hide) {
    return <HidePost setactive={setactive} sethide={sethide} />;
  }

  const isLiked = post?.likes?.includes(userdata?.uid);
  const isBookmarked = userdata?.saved?.some(
    (savedpost) => post?.postid === savedpost?.postid,
  );

  return (
    <article
      className="relative border-b border-border-default/50 hover:bg-bg-hover/20 transition-all duration-200 ease-out overflow-hidden group"
      onClick={() => navigate(`/profile/${postedby?.username}/${post?.postid}`)}
    >
      {/* Post Container */}
      <div className="flex gap-3 px-4 py-4 w-full max-w-full overflow-hidden">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <Avatar
            src={postedby?.profileImageURL}
            alt={postedby?.name || "Profile"}
            size="md"
            fallback={defaultprofileimage}
            onClick={(e) => {
              e?.stopPropagation?.();
              navigate(`/profile/${postedby?.username}`);
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
                navigate(`/profile/${postedby?.username}`);
              }}
              className="flex items-center gap-1.5 cursor-pointer group/header flex-wrap"
            >
              {postedby?.name ? (
                <>
                  <span className="font-semibold text-[15px] text-text-primary hover:underline transition-all duration-200 group-hover/header:text-accent-500">
                    {postedby.name}
                  </span>
                  <span className="text-[15px] text-text-secondary truncate max-w-[120px] md:max-w-none">
                    @{postedby.username}
                  </span>
                  <span className="text-[15px] text-text-secondary">·</span>
                  <span className="text-[15px] text-text-secondary hover:underline transition-colors duration-200">
                    {Time(post?.postedat?.toJSON().seconds)}
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
              aria-label="Post options"
            >
              <MoreIcon className="text-xl" />
            </button>
            
            {/* Post Menu */}
            {active === "menu" && (
              <PostMenu
                post={post}
                setactive={setactive}
                popup={popup}
                handlesave={handlesave}
                postedby={postedby}
                sethide={sethide}
              />
            )}
          </div>

          {/* Post Content */}
          {post?.content && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${postedby?.username}/${post?.postid}`);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
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
                  {post.content}
                </Linkify>
              </p>
            </div>
          )}

          {/* Post Image */}
          {post?.img && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${postedby?.username}/${post?.postid}`);
              }}
              className="relative rounded-2xl overflow-hidden border border-border-default/50 mb-3 cursor-pointer group/image transition-all duration-300 hover:border-border-hover/50 hover:shadow-lg hover:shadow-black/20"
            >
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
                  handleLike();
                }}
                onLoad={() => setloadingimg(false)}
                src={post.img}
                className={`${
                  loadingimg ? "hidden" : "block"
                } w-full max-h-[600px] object-cover transition-transform duration-300 group-hover/image:scale-[1.02]`}
                alt="Post"
                loading="lazy"
              />
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between mt-3 max-w-[500px]">
            {/* Comment Button */}
            <ActionButton
              icon={CommentIcon}
              label="Comment"
              variant="comment"
              count={post?.comments?.length || 0}
              onClick={(e) => {
                e.stopPropagation();
                popup && handelactive("comment");
              }}
            />

            {/* Like Button with Count */}
            <div className="flex items-center gap-1.5">
              <ActionButton
                icon={isLiked ? LikedIcon : LikeIcon}
                label="Like"
                variant="like"
                isActive={isLiked}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
              />
              {post?.likes?.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handelactive("like");
                  }}
                  className="text-[13px] font-medium text-text-secondary hover:text-social-like transition-colors duration-200 cursor-pointer min-w-[20px]"
                >
                  {post.likes.length}
                </button>
              )}
            </div>

            {/* Share Button */}
            <ActionButton
              icon={ShareIcon}
              label="Share"
              variant="share"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: `Check out this post by @${postedby?.username}`,
                    text: post?.content?.substring(0, 100),
                    url: `${window.location.origin}/profile/${postedby?.username}/${post?.postid}`,
                  }).catch(() => {});
                }
              }}
            />

            {/* Bookmark Button */}
            <ActionButton
              icon={isBookmarked ? BookmarkedIcon : BookmarkIcon}
              label="Bookmark"
              variant="bookmark"
              isActive={isBookmarked}
              onClick={(e) => {
                e.stopPropagation();
                handlesave(post);
              }}
            />

            {/* Views Counter */}
            {post?.views > 0 && (
              <div className="flex items-center gap-1.5 text-text-secondary">
                <ViewsIcon className="text-lg" />
                <span className="text-[13px] font-medium">
                  {formatNumber(post.views)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals and Popups */}
      {active === "like" && <LikePost post={post} setactive={setactive} />}
      {active === "delete" && (
        <DeletePost
          delete_post={delete_post}
          post={post}
          setactive={setactive}
        />
      )}
      {active === "report" && <Report setactive={setactive} />}

      {/* Comment Popup */}
      {popup && active === "comment" && (
        <Popupitem
          closefunction={() => {
            setactive("");
          }}
        >
          <Post postdata={post} popup={false} />
          <Addcomment cuupost={post} cuusetpost={setpost} />
        </Popupitem>
      )}
    </article>
  );
};

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
      className="py-3 border-border-default hover:bg-bg-hover/30 transition-colors duration-150 cursor-pointer"
      onClick={() => navigate(`/profile/${postedby?.username}/${post?.postid}`)}
    >
      <div className="flex gap-3 px-4 py-3 w-full">
        {/* Avatar */}
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

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start gap-2 mb-1">
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${postedby?.username}`);
              }}
              className="flex items-center gap-1 cursor-pointer group"
            >
              {postedby?.name ? (
                <>
                  <span className="font-bold text-[15px] text-text-primary hover:underline">
                    {postedby.name}
                  </span>
                  <span className="text-[15px] text-text-secondary">
                    @{postedby.username}
                  </span>
                  <span className="text-[15px] text-text-secondary">·</span>
                  <span className="text-[15px] text-text-secondary hover:underline">
                    {Time(post?.postedat?.toJSON().seconds)}
                  </span>
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
              className="ml-auto p-2 rounded-full hover:bg-accent-500/10 text-text-secondary hover:text-accent-500 transition-colors"
            >
              <MoreIcon className="text-xl" />
            </button>
            
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
            <p
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${postedby?.username}/${post?.postid}`);
              }}
              className="text-[15px] text-text-primary leading-5 mb-3 whitespace-pre-wrap break-words"
            >
              <Linkify>{post.content}</Linkify>
            </p>
          )}

          {/* Image */}
          {post?.img && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${postedby?.username}/${post?.postid}`);
              }}
              className="rounded-2xl overflow-hidden border border-border-default mb-3 cursor-pointer"
            >
              {loadingimg && (
                <Skeleton
                  animation="wave"
                  sx={{ bgcolor: "grey.900", borderRadius: "1rem" }}
                  variant="rectangular"
                  width="100%"
                  height={400}
                />
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
                } w-full max-h-[510px] object-cover`}
                alt="Post"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between max-w-[425px] mt-1">
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

            <ActionButton
              icon={isLiked ? LikedIcon : LikeIcon}
              label="Like"
              variant="like"
              count={post?.likes?.length || 0}
              isActive={isLiked}
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            />

            <ActionButton
              icon={ShareIcon}
              label="Share"
              variant="share"
              onClick={(e) => {
                e.stopPropagation();
                navigator.share({
                  title: `Check out this post by @${postedby?.username}`,
                  text: post?.content,
                  url: `${window.location.origin}/profile/${postedby?.username}/${post?.postid}`,
                });
              }}
            />

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

            <ActionButton
              icon={ViewsIcon}
              label="Views"
              variant="default"
              count={post?.views > 0 ? formatNumber(post.views) : ""}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>

      {active === "like" && <LikePost post={post} setactive={setactive} />}
      {active === "delete" && (
        <DeletePost
          delete_post={delete_post}
          post={post}
          setactive={setactive}
        />
      )}
      {active === "report" && <Report setactive={setactive} />}

      {popup && (
        <>
          {active === "comment" && (
            <Popupitem
              closefunction={() => {
                setactive("");
              }}
            >
              <Post postdata={post} popup={false} />
              <Addcomment cuupost={post} cuusetpost={setpost} />
            </Popupitem>
          )}
        </>
      )}
    </article>
  );
};

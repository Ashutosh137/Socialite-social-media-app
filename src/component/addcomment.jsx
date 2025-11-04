import { useEffect, useState } from "react";
import { MdImage as ImageIcon } from "react-icons/md";
import { MdClose as CloseIcon } from "react-icons/md";
import Comment from "./comment";
import ProgressBar from "@badrap/bar-of-progress";
import Createid from "../service/utiles/createid";
import { useUserdatacontext } from "../service/context/usercontext";
import { auth } from "../service/Auth";
import {
  Create_notification,
  Getimagedownloadlink,
} from "../service/Auth/database";
import { toast } from "react-toastify";
import Avatar from "../ui/avatar";
import Button from "../ui/button";

export default function Addcomment({ cuupost, cuusetpost }) {
  const { userdata, defaultprofileimage } = useUserdatacontext();
  const progress = new ProgressBar();
  const [post, setpost] = useState(cuupost || null);
  const [commentfile, setcommentfile] = useState(null);
  const [active, setactive] = useState("comment");
  const [commenttext, setcommenttext] = useState("");

  useEffect(() => {
    cuusetpost(post);
    return () => {
      progress.finish();
    };
  }, [post]);

  const handelcomment = async () => {
    if (!auth.currentUser) {
      toast.error("Login required");
      return;
    }

    if (!commenttext.trim() && !commentfile) {
      return;
    }

    progress.start();
    try {
      const url = await Getimagedownloadlink(commentfile, userdata?.uid);
      if (active === "comment") {
        setpost((prev) => ({
          ...prev,
          comments: [
            ...prev?.comments,
            {
              content: commenttext,
              postedby: userdata?.uid,
              postedat: new Date(),
              commentid: Createid(),
              image: url,
              reply: [],
              likes: [],
            },
          ],
        }));
        if (userdata?.uid !== post.postedby) {
          await Create_notification(post?.postedby, {
            likeby: userdata?.uid,
            type: "addcomment",
            postid: post?.postid,
          });
        }
      } else {
        const newreply = {
          content: commenttext,
          postedby: userdata?.uid,
          postedat: new Date(),
          replyid: Createid(),
          image: url,
          likes: [],
        };
        let comment;
        const newcomment = post?.comments?.map((cuucomment) => {
          if (active?.commentid !== cuucomment?.commentid) {
            return cuucomment;
          } else {
            comment = cuucomment;
            return {
              ...cuucomment,
              reply: [...cuucomment.reply, newreply],
            };
          }
        });
        setpost((prev) => ({ ...prev, comments: newcomment }));
        if (userdata?.uid !== comment?.postedby && comment?.postedby !== post?.postedby) {
          await Create_notification(comment?.postedby, {
            likeby: userdata?.uid,
            type: "addreply",
            postid: post?.postid,
          });
        }
      }
      setcommentfile(null);
      setcommenttext("");
      toast.success(active === "comment" ? "Comment added!" : "Reply added!");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Error:", error);
    } finally {
      progress.finish();
    }
  };

  return (
    <div className="border-t border-border-default">
      {/* Comment Input */}
      <div className="px-4 py-4 border-b border-border-default">
        {active !== "comment" && (
          <div className="flex items-center justify-between mb-3 px-3 py-2 bg-bg-tertiary rounded-xl border border-border-default">
            <span className="text-[15px] text-text-secondary">
              Replying to {active?.to}
            </span>
            <button
              onClick={() => setactive("comment")}
              className="p-2 rounded-full hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors"
            >
              <CloseIcon className="text-xl" />
            </button>
          </div>
        )}
        
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handelcomment();
          }}
          className="flex gap-3"
        >
          <Avatar
            src={userdata?.profileImageURL}
            alt={userdata?.name || "Profile"}
            size="md"
            fallback={defaultprofileimage}
          />
          
          <div className="flex-1 flex flex-col gap-3">
            <textarea
              onChange={(e) => setcommenttext(e.target.value)}
              value={commenttext}
              maxLength={280}
              rows={3}
              className="w-full px-4 py-3 bg-bg-tertiary border border-border-default rounded-xl text-[15px] text-text-primary placeholder:text-text-tertiary resize-none transition-all duration-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 focus:outline-none"
              placeholder="Write a comment..."
            />
            
            {commentfile && (
              <div className="relative inline-block rounded-xl overflow-hidden border border-border-default">
                <img
                  src={URL.createObjectURL(commentfile)}
                  alt="Preview"
                  className="max-w-full max-h-[300px] object-cover"
                />
                <button
                  type="button"
                  onClick={() => setcommentfile(null)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <CloseIcon className="text-xl" />
                </button>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <input
                type="file"
                name="commentfile"
                accept="image/*"
                onChange={(e) => setcommentfile(e.target.files[0])}
                className="hidden"
                id="commentfile"
              />
              <label
                htmlFor="commentfile"
                className="p-2 rounded-full hover:bg-accent-500/10 text-accent-500 cursor-pointer transition-colors"
              >
                <ImageIcon className="text-xl" />
              </label>
              
              <Button
                type="submit"
                disabled={!commenttext.trim() && !commentfile}
                variant="primary"
                size="sm"
              >
                Comment
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="px-4 py-4">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          {post?.comments?.length > 0
            ? `${post.comments.length} ${
                post.comments.length === 1 ? "Comment" : "Comments"
              }`
            : "No comments yet"}
        </h2>
        
        <div className="flex flex-col divide-y divide-border-default">
          {post?.comments?.map((comm, index) => (
            <Comment
              key={comm?.commentid || index}
              setpost={setpost}
              setactivation={setactive}
              currentcomment={comm}
              post={post}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { auth } from "../service/Auth";
import { MdImage as ImageIcon } from "react-icons/md";
import { MdClose as CloseIcon } from "react-icons/md";
import { Getimagedownloadlink } from "../service/Auth/database";
import { toast } from "react-toastify";
import { useUserdatacontext } from "../service/context/usercontext";
import Createid from "../service/utiles/createid";
import ProgressBar from "@badrap/bar-of-progress";
import Avatar from "../ui/avatar";
import Button from "../ui/button";

export const Createpost = ({ toggle = () => {} }) => {
  const { userdata, setuserdata, defaultprofileimage } = useUserdatacontext();
  const [posttext, setposttext] = useState("");
  const [postmedia, setpostmedia] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const progress = new ProgressBar();

  useEffect(() => {
    return () => {
      progress.finish();
    };
  }, []);

  const handelpost = async () => {
    if (auth.currentUser) {
      setIsPosting(true);
      progress.start();
      
      try {
        var url = postmedia ? await Getimagedownloadlink(postmedia) : "";
        const id = Createid();
        const newPost = {
          content: posttext,
          likes: [],
          comments: [],
          postedby: auth?.currentUser?.uid,
          postedat: new Date(),
          views: 0,
          postid: id,
          img: url,
        };
        
        // Update userdata with new post
        const updatedPosts = [newPost, ...(userdata.post || [])];
        setuserdata((pre) => ({ ...pre, post: updatedPosts }));
        
        setposttext("");
        setpostmedia(null);
        toggle();
        toast.success("Successfully posted!");
        
        // Trigger a custom event to refresh home page posts
        window.dispatchEvent(new CustomEvent('postCreated', { detail: newPost }));
      } catch (error) {
        toast.error("Failed to post. Please try again.");
        console.error("Error posting:", error);
      } finally {
        setIsPosting(false);
        progress.finish();
      }
    } else {
      toast.error("Please login first");
    }
  };

  const characterCount = posttext.length;
  const maxCharacters = 280;
  const canPost = (posttext.trim() !== "" || postmedia) && !isPosting && characterCount <= maxCharacters;

  return (
    <div className="flex gap-3 px-4 py-3 border-b border-border-default">
      {/* Avatar */}
      <Avatar
        src={userdata?.profileImageURL}
        alt={userdata?.name || "Profile"}
        size="md"
        fallback={defaultprofileimage}
      />

      {/* Input Area */}
      <div className="flex-1 min-w-0">
        <textarea
          value={posttext}
          onChange={(e) => setposttext(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-transparent text-[20px] text-text-primary placeholder:text-text-secondary resize-none outline-none min-h-[100px] mb-3"
          maxLength={maxCharacters}
          rows={4}
        />

        {/* Image Preview */}
        {postmedia && (
          <div className="relative rounded-2xl overflow-hidden border border-border-default mb-3 group">
            <img
              src={URL.createObjectURL(postmedia)}
              alt="Preview"
              className="w-full max-h-[400px] object-cover"
            />
            <button
              type="button"
              onClick={() => setpostmedia(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
            >
              <CloseIcon className="text-xl" />
            </button>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-border-default">
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setpostmedia(e.target.files[0]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              className="p-2 rounded-full hover:bg-accent-500/10 text-accent-500 transition-colors"
            >
              <ImageIcon className="text-xl" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {characterCount > 0 && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-[13px] ${
                    characterCount > maxCharacters * 0.9
                      ? characterCount >= maxCharacters
                        ? "text-status-error"
                        : "text-status-warning"
                      : "text-text-secondary"
                  }`}
                >
                  {characterCount}
                </span>
                <div className="w-[2px] h-[2px] rounded-full bg-border-default" />
                <span className="text-[13px] text-text-secondary">{maxCharacters}</span>
              </div>
            )}
            <Button
              type="button"
              onClick={handelpost}
              disabled={!canPost}
              size="sm"
              variant="primary"
            >
              {isPosting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

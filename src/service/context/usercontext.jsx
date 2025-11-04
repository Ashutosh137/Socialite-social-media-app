import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../Auth";
import { useNavigate } from "react-router-dom";
import {
  Get_notification,
  get_userdata,
  getallprofile,
  updateuserdata,
} from "../Auth/database";
import image from "/src/assets/defaultprofileimage.png";
import { toast } from "react-toastify";

export const UserDataContext = createContext();

export const UserDataProvider = ({ children, value, setvalue }) => {
  const [postpopup, setpostpopup] = useState(false);
  const [userdata, setuserdata] = useState(value);
  const [userNotifications, setuserNotifications] = useState([]);
  const [GetAllusers, setGetAllusers] = useState([]);
  const [defaultprofileimage, setdefaultprofileimage] = useState(image);

  const delete_post = useCallback(async (postid) => {
    if (userdata) {
      try {
        // Update local state
        setuserdata((prev) => ({
          ...prev,
          post: prev.post.filter((p) => {
            return p.postid !== postid;
          }),
        }));
        
        // Trigger event to refresh home page
        window.dispatchEvent(new CustomEvent('postDeleted', { detail: { postid } }));
        
        toast.success("Post Deleted");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post");
      }
    }
  }, [userdata]);

  useEffect(() => {
    const dataforallusers = async () => {
      const alluser = await getallprofile();
      setGetAllusers(alluser);
    };
    dataforallusers();
  }, []);

  const handlesave = useCallback(
    (post) => {
      if (!auth?.currentUser) {
        toast.error("Login required");
        return;
      }

      if (
        userdata?.saved.some((savedpost) => post?.postid === savedpost?.postid)
      ) {
        setuserdata((prev) => ({
          ...prev,
          saved: prev.saved.filter(
            (savedpost) => post?.postid !== savedpost?.postid,
          ),
        }));
        toast.success("Removed from your Bookmark");
      } else {
        setuserdata((prev) => ({
          ...prev,
          saved: [
            ...prev.saved,
            {
              postedby: post?.postedby,
              postid: post?.postid,
            },
          ],
        }));
        toast.success("Added to your Bookmark");
      }
    },
    [auth, userdata],
  );

  const navigate = useNavigate();

  useEffect(() => {
    const datalogin = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          let data = await get_userdata(user?.uid);
          if (data?.username) {
            setuserdata(data);
            setvalue(data);
          } else {
            navigate("/create-account");
          }
        }
      });
    };
    datalogin();
  }, []);

  useEffect(() => {
    const data = async () => {
      userdata && (await updateuserdata(userdata));
      userdata && setuserNotifications(await Get_notification(userdata?.uid));
    };
    data();
  }, [userdata]);

  const togglepost = () => {
    setpostpopup(!postpopup);
  };
  return (
    <UserDataContext.Provider
      value={{
        postpopup,
        defaultprofileimage,
        userdata,
        handlesave,
        GetAllusers,
        userNotifications,
        setuserNotifications,
        delete_post,
        setuserdata,
        togglepost,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserdatacontext = () => {
  const value = useContext(UserDataContext);
  return value;
};

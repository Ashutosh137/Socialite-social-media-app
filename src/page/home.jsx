import { Fragment, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { getallpost } from "../service/Auth/database";
import { Createpost } from "../component/createpost";
import { Post } from "../component/post";
import { auth } from "../service/Auth";
import { Helmet } from "react-helmet";
import { useUserdatacontext } from "../service/context/usercontext";
import Loading from "../layout/loading";

export const Home = () => {
  const [allpostdata, setallpostdata] = useState(null);
  const [active, setactive] = useState("");
  const [post, setpost] = useState([]);
  const { userdata } = useUserdatacontext();
  const [loading, setloading] = useState(false);

  const fetchData = useCallback(async () => {
    setloading(true);
    try {
      const allPosts = await getallpost();
      const sortedPosts = allPosts.flat().sort((a, b) => {
        // Sort by date (newest first)
        const dateA = a.postedat?.toDate?.() || new Date(a.postedat);
        const dateB = b.postedat?.toDate?.() || new Date(b.postedat);
        return dateB - dateA;
      });
      setallpostdata(sortedPosts);
      setpost(sortedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setloading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for new posts and refresh
  useEffect(() => {
    const handlePostCreated = (event) => {
      const newPost = event.detail;
      // Optimistically add to top of feed
      if (newPost && allpostdata) {
        setallpostdata((prev) => [newPost, ...(prev || [])]);
        setpost((prev) => {
          // If filtering by following, check if user follows themselves
          if (active === "follow" && userdata?.following?.length > 0) {
            if (userdata.following.includes(newPost.postedby)) {
              return [newPost, ...(prev || [])];
            }
            return prev;
          }
          return [newPost, ...(prev || [])];
        });
      }
      // Then refresh from server to ensure consistency
      setTimeout(() => fetchData(), 500);
    };

    const handlePostDeleted = (event) => {
      const { postid } = event.detail;
      // Optimistically remove from local state
      setpost((prev) => prev.filter((p) => p.postid !== postid));
      setallpostdata((prev) => prev?.filter((p) => p.postid !== postid));
      // Then refresh from server
      setTimeout(() => fetchData(), 500);
    };

    window.addEventListener('postCreated', handlePostCreated);
    window.addEventListener('postDeleted', handlePostDeleted);

    return () => {
      window.removeEventListener('postCreated', handlePostCreated);
      window.removeEventListener('postDeleted', handlePostDeleted);
    };
  }, [fetchData, allpostdata, active, userdata]);

  useEffect(() => {
    if (!allpostdata) return;
    
    if (active === "follow" && userdata?.following?.length > 0) {
      const filteredPosts = allpostdata.filter((post) =>
        userdata.following.includes(post.postedby),
      );
      setpost(filteredPosts);
    } else {
      setpost(allpostdata);
    }
  }, [allpostdata, active, userdata]);

  const handleTabChange = (tab) => {
    setpost([]);
    setactive(tab);
  };

  return (
    <Fragment>
      <Helmet>
        <title>Home | Socialite</title>
      </Helmet>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-bg-default/80 backdrop-blur-xl border-b border-border-default">
       
        {/* Tabs */}
        <div className="flex border-b border-border-default">
          <button
                onClick={() => handleTabChange("")}
            className={`flex-1 h-[53px] relative font-semibold text-[15px] transition-colors duration-200 ${
                  active === ""
                    ? "text-text-primary"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                }`}
              >
            For you
                {active === "" && (
                  <motion.div
                    layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-accent-500 rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
          </button>
              {auth?.currentUser && (
            <button
                  onClick={() => handleTabChange("follow")}
              className={`flex-1 h-[53px] relative font-semibold text-[15px] transition-colors duration-200 ${
                    active === "follow"
                      ? "text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                  }`}
                >
                  Following
                  {active === "follow" && (
                    <motion.div
                      layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-accent-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
            </button>
              )}
          </div>
        </div>

      {/* Create Post */}
        <div className=" t">
            <Createpost />
        </div>

        {/* Posts Feed */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          )}
      
          {post?.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-text-secondary text-[15px]">No posts yet</p>
        </div>
          )}

      <div className=" flex flex-col space-y-1 divide-y divide-border-default">
            {post?.map((postarray, index) => (
              <Post key={postarray?.postid || index} postdata={postarray} popup={true} />
            ))}
      </div>
    </Fragment>
  );
};

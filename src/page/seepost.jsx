import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getpostdata, updatepost } from "../service/Auth/database";
import { Post } from "../component/post";
import ProgressBar from "@badrap/bar-of-progress";
import { MdArrowBack as ArrowBack } from "react-icons/md";
import Addcomment from "../component/addcomment";
import NotFoundPost from "../layout/post/not-found";
import { Helmet } from "react-helmet";
import Loading from "../layout/loading";

export default function Seepost() {
  const { username, postid } = useParams();
  const [post, setpost] = useState(null);
  const navigate = useNavigate();
  const [loader, setloader] = useState(true);

  useEffect(() => {
    const progress = new ProgressBar();
    const data = async () => {
      progress.start();
      try {
        const data = await getpostdata(username, postid);
        setpost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setloader(false);
        progress.finish();
      }
    };

    data();

    return () => {
      progress.finish();
    };
  }, [username, postid]);

  useEffect(() => {
    const data = async () => {
      if (post) {
        await updatepost(post, post?.postedby);
      }
    };
    data();
  }, [post]);

  return (
    <Fragment>
      <Helmet>
        <title>Post | {username} | Socialite</title>
        <meta name="description" content={`Post by ${username}`} />
        <link rel="canonical" href={`/profile/${username}/${postid}`} />
      </Helmet>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-bg-default/80 backdrop-blur-xl border-b border-border-default">
        <div className="flex items-center gap-4 h-[53px] px-4">
          <button
            onClick={() => navigate("/home")}
            className="p-2 rounded-full hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowBack className="text-xl" />
          </button>
          <h1 className="text-xl font-bold text-text-primary">Post</h1>
        </div>
      </div>

      {post === undefined && <NotFoundPost />}

      {loader && (
        <div className="flex items-center justify-center py-20">
          <Loading />
        </div>
      )}

      {!loader && post && (
        <div className="border-b border-border-default">
          <Post postdata={post} popup={false} />
          <Addcomment cuupost={post} cuusetpost={setpost} />
        </div>
      )}
    </Fragment>
  );
}

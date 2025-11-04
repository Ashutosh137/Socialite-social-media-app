import React, { Fragment } from "react";
import { useUserdatacontext } from "../service/context/usercontext";
import { useNavigate } from "react-router-dom";
import Postidtopost from "../layout/post/postidtopost";
import { MdBookmarkRemove as BookmarkRemoveSharpIcon } from "react-icons/md";
import { Helmet } from "react-helmet";

export const List = () => {
  const { userdata, setuserdata } = useUserdatacontext();
  const navigate = useNavigate();

  return (
    <Fragment>
      <Helmet>
        <title>Bookmarks | Socialite</title>
      </Helmet>
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-bg-default/80 backdrop-blur-xl border-b border-border-default">
        <div className="flex items-center justify-between h-[53px] px-4">
          <h1 className="text-xl font-bold text-text-primary">Bookmarks</h1>
          {userdata?.saved?.length > 0 && (
            <button
              title="Delete all bookmarks"
              onClick={() => {
                setuserdata((prev) => ({ ...prev, saved: [] }));
              }}
              className="p-2 rounded-full hover:bg-bg-hover text-text-secondary hover:text-status-error transition-colors"
            >
              <BookmarkRemoveSharpIcon className="text-xl" />
            </button>
          )}
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="w-full">
        {userdata?.saved?.length > 0 ? (
          <div className="flex flex-col">
            {userdata.saved.map((item, index) => (
              <Postidtopost
                key={index}
                postedby={item.postedby}
                postid={item?.postid}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="flex flex-col items-center gap-4 max-w-md text-center">
              <BookmarkRemoveSharpIcon className="text-6xl text-text-tertiary" />
              <div className="flex flex-col gap-2">
                <p className="text-[15px] font-medium text-text-primary">
                  No bookmarks yet
                </p>
                <p className="text-[13px] text-text-secondary">
                  Pin your favorite posts to access them quickly.
                </p>
              </div>
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-full text-[15px] transition-colors mt-4"
              >
                Explore Posts
              </button>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

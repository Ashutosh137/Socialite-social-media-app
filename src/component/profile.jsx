import { useState, useEffect, Fragment } from "react";
import { MdArrowBack as ArrowBackIcon } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Post } from "./post";
import { MdEdit as EditIcon } from "react-icons/md";
import { Popupitem } from "../ui/popup";
import { useUserdatacontext } from "../service/context/usercontext";
import {
  Create_notification,
  get_userdatabyname,
  updateprofileuserdata,
} from "../service/Auth/database";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/skeleton";
import { MdMoreVert as MoreVertIcon } from "react-icons/md";
import { Createpost } from "./createpost";
import Editfuserdata from "../layout/profile/editfuserdata";
import { auth } from "../service/Auth";
import Profileviewbox from "../layout/profile/profileviewbox";
import ProgressBar from "@badrap/bar-of-progress";
import Aboutprofile from "../layout/profile/aboutprofile";
import NoPost from "../layout/profile/no-post";
import Private from "../layout/profile/private";
import Loading from "../layout/loading";
import Report from "../layout/profile/report";
import FirstPost from "../layout/profile/firstPost";
import Menu from "../layout/profile/menu";
export const Profile = ({ username }) => {
  const progress = new ProgressBar();
  const [profileuserdata, setprofileuserdata] = useState(null);
  const navigate = useNavigate();
  const { userdata, defaultprofileimage, setuserdata } = useUserdatacontext();
  const [loading, setloading] = useState(false);
  const [active, setactive] = useState("");
  const [mutual, setmutual] = useState([]);

  useEffect(() => {
    const data = async () => {
      progress.start();
      setloading(true);
      if (username === userdata?.username) setprofileuserdata(userdata);
      else {
        const profile = await get_userdatabyname(username);
        setprofileuserdata(profile);
      }
      progress.finish();
      setloading(false);
    };
    data();
    return () => {
      progress.finish();
      setloading(false);
    };
  }, [username]);

  useEffect(() => {
    setactive("");
  }, [username]);

  useEffect(() => {
    if (userdata?.username === profileuserdata?.username) {
      userdata && setprofileuserdata(userdata);
    }
  }, [userdata, profileuserdata?.username]);

  // Listen for post deletions to update profile
  useEffect(() => {
    const handlePostDeleted = (event) => {
      const { postid } = event.detail;
      if (profileuserdata?.post) {
        setprofileuserdata((prev) => ({
          ...prev,
          post: prev.post.filter((p) => p.postid !== postid),
        }));
      }
    };

    window.addEventListener('postDeleted', handlePostDeleted);
    return () => {
      window.removeEventListener('postDeleted', handlePostDeleted);
    };
  }, [profileuserdata]);

  useEffect(() => {
    const data = async () => {
      if (auth.currentUser && profileuserdata) {
        if (userdata?.username !== profileuserdata?.username) {
          await updateprofileuserdata(profileuserdata, username);
        }
      }
    };
    data();
  }, [profileuserdata]);

  useEffect(() => {
    const data = () => {
      setmutual(
        profileuserdata?.follower?.filter((pre) =>
          userdata?.follower?.includes(pre),
        ),
      );
    };
    data();
  }, [userdata, profileuserdata]);

  useEffect(() => {
    if (profileuserdata?.block?.includes(userdata?.uid)) {
      setProfileuserdata(null);
    }
  }, [profileuserdata]);

  const handelfollow = async () => {
    if (auth.currentUser && profileuserdata) {
      profileuserdata?.follower?.includes(userdata?.uid)
        ? setprofileuserdata((prev) => ({
            ...prev,
            follower: profileuserdata?.follower.filter(
              (e) => e !== userdata?.uid,
            ),
          }))
        : setprofileuserdata((prev) => ({
            ...prev,
            follower: [...prev.follower, userdata?.uid],
          }));
      !userdata?.following.includes(profileuserdata?.uid)
        ? setuserdata((prev) => ({
            ...prev,
            following: [...prev.following, profileuserdata?.uid],
          }))
        : setuserdata((prev) => ({
            ...prev,
            following: userdata?.following.filter(
              (e) => e !== profileuserdata?.uid,
            ),
          }));
      !profileuserdata?.follower?.includes(userdata?.uid) &&
        (await Create_notification(profileuserdata?.uid, {
          type: "follow",
          likeby: userdata?.uid,
        }));
    } else navigate("/login");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="  post  w-full p-2 sm:text-2xl text-lg capitalize">
      <div className="flex  relative m-1 sm:m-2 ">
        <i
          onClick={() => {
            navigate("/home");
          }}
        >
          <ArrowBackIcon />
        </i>
        <div className="flex flex-col sm:text-xl text-lg mx-4 capitalize">
          <label>
            {profileuserdata?.name || (
              <Skeleton
                animation="wave"
                sx={{ bgcolor: "grey.900" }}
                variant="text"
                width={150}
              />
            )}
          </label>
          <label className="text-gray-500 text-sm sm:text-base">
            {profileuserdata?.post?.length} Posts
          </label>
        </div>
        <i
          className="ml-auto"
          onClick={() => {
            active === "setting" ? setactive("") : setactive("setting");
          }}
        >
          <MoreVertIcon />
        </i>
        {active === "setting" && profileuserdata && (
          <Menu profileuserdata={profileuserdata} setactive={setactive} />
        )}
      </div>
      <div className="flex post">
        <div className="sm:my-10 sm:space-y-3 aspect-square space-y-1 flex flex-col text-left sm:m-5 m-3">
          <img
            src={profileuserdata?.profileImageURL || defaultprofileimage}
            onError={(e) => {
              e.target.src = defaultprofileimage;
            }}
            className="sm:w-28 sm:h-28 h-20 w-20  rounded-full  border-2 border-neutral-600"
          />
          <div className="flex flex-col ">
            <label className=" text-xl font-semibold">
              {profileuserdata?.name || (
                <Skeleton
                  animation="wave"
                  sx={{ bgcolor: "grey.900" }}
                  variant="text"
                  width={150}
                />
              )}
            </label>
            <label className="flex text-lg  space-x-1 text-gray-400">
              @{profileuserdata?.username || username}
            </label>
          </div>
          {profileuserdata?.bio && (
            <pre className=" text-sm sm:text-base">{profileuserdata?.bio}</pre>
          )}

          <div className="flex space-x-3 sm:text-lg text-base  text-gray-400">
            <label
              onClick={() => {
                ((profileuserdata?.privacy &&
                  profileuserdata?.follower.includes(userdata?.uid)) ||
                  !profileuserdata?.privacy) &&
                  profileuserdata?.follower.length > 0 &&
                  setactive("followers");

                profileuserdata?.username === userdata?.username &&
                  profileuserdata?.follower.length > 0 &&
                  setactive("followers");
              }}
            >
              {profileuserdata?.follower?.length} follower
            </label>
            <label
              onClick={() => {
                ((profileuserdata?.privacy &&
                  profileuserdata?.follower.includes(userdata?.uid)) ||
                  !profileuserdata?.privacy) &&
                  profileuserdata?.following.length > 0 &&
                  setactive("following");

                profileuserdata?.username === userdata?.username &&
                  profileuserdata?.following.length > 0 &&
                  setactive("following");
              }}
            >
              {profileuserdata?.following?.length} following
            </label>
          </div>
          {userdata?.block?.includes(profileuserdata?.uid) && (
            <label className="text-sm my-4  font-serif text-red-400">
              you blocked this account
            </label>
          )}
          {mutual?.length > 0 &&
            userdata?.username !== profileuserdata?.username && (
              <div
                onClick={() => {
                  setactive("mutual");
                }}
                className="text-neutral-400 cursor-pointer text-xs sm:text-sm text-left "
              >
                {mutual?.length} mutual friends also follow{" "}
                <b>{profileuserdata?.name}</b>
              </div>
            )}
        </div>

        {profileuserdata?.username === userdata?.username ? (
          <div
            className={`${
              userdata?.username ? "block" : "hidden"
            } cursor-pointer mr-5 ml-auto`}
          >
            <button
              title="edit profile"
              onClick={() => {
                active === "edit" ? setactive("") : setactive("edit");
              }}
              className="bg-black border-2 relative top-1/3 sm:mr-10 text-xs sm:text-lg  border-sky-200 sm:px-3 p-2 font-semibold capitalize rounded-3xl ml-auto  "
            >
              <span className="flex justify-center sm:justify-start  ">
                <EditIcon />
                <label className="sm:block hidden mx-2">edit profile</label>
              </span>
            </button>
          </div>
        ) : (
          <div
            className={`${
              userdata?.username ? "block" : "hidden"
            } cursor-pointer mr-5 ml-auto`}
          >
            <button
              title="follow"
              onClick={handelfollow}
              className="bg-black border-2 relative top-1/3 sm:mr-10 text-xs sm:text-lg mr-2  border-sky-200 sm:px-3 p-2 font-semibold capitalize rounded-3xl ml-auto  "
            >
              <label className="mx-2">
                {profileuserdata?.follower?.includes(userdata?.uid) ? (
                  <>following</>
                ) : (
                  <>follow</>
                )}
              </label>
            </button>
          </div>
        )}
      </div>

      <hr className="my-1 border-gray-400" />

      {profileuserdata?.uid === userdata?.uid ? (
        <>
          {profileuserdata?.post?.length === 0 ? (
            <FirstPost setactive={setactive} />
          ) : (
            <Fragment>
              {profileuserdata?.post?.map((item, index) => {
                return <Post key={index} postdata={item} popup={true} />;
              })}
            </Fragment>
          )}{" "}
        </>
      ) : (
        <Fragment>
          {profileuserdata?.privacy ? (
            <Fragment>
              {profileuserdata?.follower.includes(userdata?.uid) ? (
                <>
                  {profileuserdata?.post?.length === 0 ? (
                    <NoPost />
                  ) : (
                    <Fragment>
                      {profileuserdata?.post?.map((item, index) => {
                        return (
                          <Post key={index} postdata={item} popup={true} />
                        );
                      })}
                    </Fragment>
                  )}
                </>
              ) : (
                <Private />
              )}
            </Fragment>
          ) : (
            <Fragment>
              {profileuserdata?.post?.length === 0 ? (
                <NoPost />
              ) : (
                <Fragment>
                  {profileuserdata?.post?.map((item, index) => {
                    return <Post key={index} postdata={item} popup={true} />;
                  })}
                </Fragment>
              )}
            </Fragment>
          )}
        </Fragment>
      )}

      {!profileuserdata && !loading && (
        <div className="text-center my-10 font-serif text-2xl border-b border-gray-500 p-5 mx-5  ">
          profile doesnot exist
        </div>
      )}

      {active === "report" && (
        <Popupitem
          closefunction={() => {
            setactive("");
          }}
        >
          {profileuserdata?.report?.includes(userdata.uid) ? (
            <div className="text-xl text-center my-7 capitalize text-red-400 ">
              already reported
            </div>
          ) : (
            <Report
              setactive={setactive}
              setprofileuserdata={setprofileuserdata}
            />
          )}
        </Popupitem>
      )}
      {active === "block" && (
        <Popupitem
          closefunction={() => {
            setactive("");
          }}
        >
          {!profileuserdata?.block?.includes(userdata.uid) && (
            <div className="max-w-sm m-auto mb-10">
              <p className="text-xl text-center my-7 capitalize ">
                block {profileuserdata?.username}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setactive("");
                  }}
                  className="px-8 outline outline-neutral-800 capitalize m-auto p-2 text-base rounded-full hover:bg-gray-950 bg-gray-900 text-white"
                >
                  cancel
                </button>
                <button
                  onClick={() => {
                    setactive("");
                    toast.success(`blocked ${profileuserdata?.username}`);
                    setuserdata((prev) => ({
                      ...prev,
                      block: [profileuserdata?.uid],
                    }));
                  }}
                  className="px-8 capitalize m-auto p-2 rounded-full hover:bg-red-700 bg-red-600 text-base font-semibold text-white"
                >
                  block
                </button>
              </div>
            </div>
          )}
        </Popupitem>
      )}

      {active === "followers" && (
        <Popupitem
          closefunction={() => {
            setactive("");
          }}
        >
          <div className="flex w-full flex-col justify-center align-middle space-y-3">
            <h2 className="text-center text-xl sm:text-2xl my-5 ">followers</h2>
            <div className="m-auto min-w-max">
              {profileuserdata?.follower.map((profile, index) => {
                return <Profileviewbox key={index} profileusername={profile} />;
              })}
            </div>
          </div>
        </Popupitem>
      )}
      {active === "mutual" && (
        <Popupitem
          closefunction={() => {
            setactive("");
          }}
        >
          <div className="flex w-full flex-col justify-center align-middle space-y-3">
            <h2 className="text-center text-xl sm:text-2xl my-5 ">
              mutual friends
            </h2>
            <div className="m-auto">
              {mutual.map((profile, index) => {
                return <Profileviewbox key={index} profileusername={profile} />;
              })}
            </div>
          </div>
        </Popupitem>
      )}
      {active === "about" && (
        <Aboutprofile
          profiledata={profileuserdata}
          close={() => {
            setactive("");
          }}
        />
      )}

      {active === "following" && (
        <div>
          {
            <Popupitem
              closefunction={() => {
                setactive("");
              }}
            >
              <div className="flex flex-col justify-center align-middle space-y-3">
                <h2 className="text-center text-xl sm:text-2xl my-5 ">
                  following
                </h2>
                <div className="m-auto">
                  {profileuserdata.following.map((profile, index) => {
                    return (
                      <Profileviewbox key={index} profileusername={profile} />
                    );
                  })}
                </div>
              </div>
            </Popupitem>
          }
        </div>
      )}

      {active === "edit" && (
        <Popupitem
          closefunction={() => {
            setactive("");
          }}
        >
          <Editfuserdata
            toggle={() => {
              setactive("");
            }}
          />
        </Popupitem>
      )}

      {active === "post" && (
        <Popupitem
          closefunction={() => {
            setactive("");
          }}
        >
          <div className="my-5">
            <Createpost
              toggle={() => {
                setactive("");
              }}
            />
          </div>
        </Popupitem>
      )}
    </div>
  );
};

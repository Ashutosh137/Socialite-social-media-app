import { useState, useEffect, Fragment, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AiFillHome as HomeIcon } from "react-icons/ai";
import { BsSearch as SearchIcon } from "react-icons/bs";
import { MdNotifications as NotificationsIcon } from "react-icons/md";
import { MdPerson as PersonIcon } from "react-icons/md";
import { MdBookmarks as BookmarksIcon } from "react-icons/md";
import { Link } from "react-router-dom";
import { useUserdatacontext } from "../../service/context/usercontext";
import { auth } from "../../service/Auth";
import { useNavigate } from "react-router-dom";
import { Popupitem } from "../../ui/popup";
import { Createpost } from "../../component/createpost";
import Mobilenavbar from "./mobile-navbar";
import Button from "../../ui/button";
import Avatar from "../../ui/avatar";
import Badge from "../../ui/badge";
import { CiSettings } from "react-icons/ci";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userdata, userNotifications, defaultprofileimage } = useUserdatacontext();
  const [post, setpost] = useState(false);
  const [navbar, setnavbar] = useState(true);

  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setnavbar(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  const navItemsDesktop = useMemo(() => [
    { icon: HomeIcon, label: "Home", path: "/home", id: "home" },
    { icon: SearchIcon, label: "Explore", path: userdata?.username ? "/search" : "/login", id: "explore" },
    { icon: NotificationsIcon, label: "Notifications", path: userdata?.username ? "/notification" : "/login", id: "notifications", badge: userNotifications?.length > userdata?.notification ? userNotifications.length - userdata.notification : null },
    { icon: BookmarksIcon, label: "Lists", path: userdata?.username ? "/lists" : "/login", id: "lists" },
    { icon: PersonIcon, label: "Profile", path: userdata?.username ? `/profile/${userdata.username}` : "/login", id: "profile" },
    { icon: CiSettings, label: "Settings", path: userdata?.username ? "/setting" : "/login", id: "settings" },
  ], [userdata?.username, userNotifications, userdata?.notification]);

  const isActive = (path) => {
    if (path === "/home") return location.pathname === "/home";
    return location.pathname.startsWith(path);
  };
  return (
    <Fragment>
      {/* Desktop Navbar - Sticky */}
      <header className="sticky top-0 hidden md:flex  h-screen w-[275px] flex-col z-40">
        <nav className="flex flex-col h-full px-3">
          {/* Logo */}
          <div className="px-3 py-3 mb-4">
            <Link to="/home">
              <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-bg-hover transition-colors duration-200 cursor-pointer">
                <span className="text-2xl font-bold text-text-primary">Socialite</span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 flex flex-col">
            {navItemsDesktop.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link key={item.id} to={item.path}>
                  <div
                    className={`relative flex items-center gap-4 px-4 py-3 mb-1 rounded-full transition-colors duration-200 hover:bg-bg-hover ${
                      active
                        ? "font-bold"
                        : "font-normal"
                    }`}
                  >
                    <div className="relative">
                      <Icon className={`text-2xl ${active ? "text-text-primary" : "text-text-secondary"}`} />
                      {item.badge && (
                        <Badge count={item.badge} variant="default" size="sm" />
                      )}
                    </div>
                    <span className={`text-xl ${active ? "text-text-primary" : "text-text-secondary"}`}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* Post Button */}
            <Button
              onClick={() => setpost(true)}
              className="w-[90%] mx-auto mb-5 mt-auto"
            >
              Post
            </Button>
          </nav>

          {/* User Profile */}
          <div className="mt-auto mb-4">
            {auth.currentUser && userdata ? (
              <div
                onClick={() => navigate(`/profile/${userdata.username}`)}
                className="flex items-center gap-3 px-4 py-3 rounded-full cursor-pointer transition-colors duration-200 hover:bg-bg-hover"
              >
                <Avatar
                  src={userdata.profileImageURL}
                  alt={userdata.name || "Profile"}
                  size="md"
                  fallback={defaultprofileimage}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[15px] text-text-primary truncate">{userdata.name}</p>
                  <p className="text-[15px] text-text-secondary truncate">@{userdata.username}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-transparent border border-border-default text-text-primary font-bold py-3 rounded-full hover:bg-bg-hover transition-colors duration-200"
              >
                Sign In
              </button>
            )}

            {auth.currentUser && (
              <button
                onClick={async () => {
                  await auth.signOut();
                  navigate("/");
                }}
                className="w-full mt-2 text-text-secondary hover:text-text-primary text-[15px] py-2 rounded-full hover:bg-bg-hover transition-colors duration-200"
              >
                Sign Out
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Create Post Modal */}
      {post && (
        <Popupitem
          closefunction={() => {
            setpost(false);
          }}
        >
          <div className="my-5">
            <Createpost
              toggle={() => {
                setpost(false);
              }}
            />
          </div>
        </Popupitem>
      )}

      {/* Mobile Navbar */}
    <div className="md:hidden">
      <Mobilenavbar setpost={setpost} navbar={navbar} />
    </div>
    </Fragment>
  );
};

export default Navbar;

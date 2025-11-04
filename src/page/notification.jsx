import React, { Fragment } from "react";
import { useUserdatacontext } from "../service/context/usercontext";
import Notify from "../layout/notification/notify";
import { MdArrowBack as ArrowBack } from "react-icons/md";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Notification() {
  const { setuserdata, userNotifications } = useUserdatacontext();
  const navigate = useNavigate();

  useEffect(() => {
    userNotifications &&
      setuserdata((prev) => ({
        ...prev,
        notification: userNotifications.length,
      }));
  }, []);

  return (
    <Fragment>
      <Helmet>
        <title>Notifications | Socialite</title>
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
          <h1 className="text-xl font-bold text-text-primary">Notifications</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div className="w-full">
        {userNotifications?.map((notification, index) => (
          <Notify key={index} notification={notification} />
        ))}
        {userNotifications?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <p className="text-text-secondary text-[15px] font-medium">
              No notifications yet
            </p>
            <p className="text-text-tertiary text-[13px] mt-2">
              You'll see notifications here when you get them
            </p>
          </div>
        )}
      </div>
    </Fragment>
  );
}

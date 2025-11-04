import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUserdatacontext } from "../../service/context/usercontext";
import { MdRemoveCircleOutline as RemoveCircleOutlineIcon } from "react-icons/md";
import { MdPublic as PublicIcon } from "react-icons/md";
import { MdLock as LockIcon } from "react-icons/md";
import Profileviewbox from "../profile/profileviewbox";
import Card from "../../ui/card";
import Button from "../../ui/button";

export default function Block() {
  const { userdata, setuserdata } = useUserdatacontext();
  const [privacy, setprivacy] = useState(userdata?.privacy ? 1 : 0);

  useEffect(() => {
    const data = () => {
      setuserdata((prev) => ({
        ...prev,
        privacy: privacy == 1,
      }));
    };
    data();
  }, [privacy, setuserdata]);

  const isPrivate = privacy == 1;

  return (
    <section className="w-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        Who Can See Your Content
      </h1>

      {/* Privacy Toggle */}
      <Card variant="elevated" padding="lg" className="w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPrivate ? (
                <LockIcon className="text-xl text-accent-500" />
              ) : (
                <PublicIcon className="text-xl text-text-secondary" />
              )}
              <label className="text-[15px] font-semibold text-text-primary">
                Account Privacy
              </label>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">
                {isPrivate ? "Private" : "Public"}
              </span>
              <input
                type="range"
                className="w-20 accent-accent-500"
                value={privacy}
                onChange={(e) => {
                  setprivacy(e.target.value);
                }}
                max={1}
                min={0}
                step={1}
                name="privacy"
              />
            </div>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            When your account is public, your profile and posts can be seen by
            anyone, on or off Socialite, even if they don't have a Socialite
            account.
          </p>
        </div>
      </Card>

      {/* Blocked Accounts */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-text-primary">
            Blocked Accounts
          </h2>
          <span className="text-[15px] text-text-secondary font-semibold">
            ({userdata?.block?.length || 0})
          </span>
        </div>

        {userdata?.block?.length > 0 ? (
          <div className="flex flex-col gap-3">
            {userdata?.block?.map((profile, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-bg-tertiary border border-border-default hover:bg-bg-elevated transition-colors"
                >
                  <div className="flex-1">
                    <Profileviewbox profileusername={profile} />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setuserdata((prev) => ({
                        ...prev,
                        block: prev.block.filter((_, i) => i !== index),
                      }));
                    }}
                    className="p-2 rounded-full hover:bg-status-error/10 text-status-error hover:text-status-error transition-colors"
                  >
                    <RemoveCircleOutlineIcon className="text-xl" />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card variant="outline" padding="md" className="text-center">
            <p className="text-text-secondary text-[15px]">
              No blocked accounts
            </p>
          </Card>
        )}
      </div>
    </section>
  );
}

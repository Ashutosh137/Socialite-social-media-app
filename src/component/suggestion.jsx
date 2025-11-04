import { useState } from "react";
import Profileviewbox from "../layout/profile/profileviewbox";
import Search from "../layout/explore/search";
import { useUserdatacontext } from "../service/context/usercontext";
import Loading from "../layout/loading";

export default function Suggestion({ bio = false }) {
  const { userdata, GetAllusers } = useUserdatacontext();
  const [showAll, setShowAll] = useState(false);

  if (GetAllusers == []) {
    return <></>;
  }

  const filteredUsers = GetAllusers.filter(
    (profile) => profile?.username !== userdata?.username,
  );

  const displayedUsers = showAll ? filteredUsers : filteredUsers.slice(0, 5);
  const hasMore = filteredUsers.length > 5;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full">
        <Search bio={bio} />
      </div>
      
      <div className="bg-bg-tertiary rounded-2xl overflow-hidden border border-border-default">
        <div className="px-4 py-3 border-b border-border-default">
          <h2 className="text-xl font-bold text-text-primary">Who to follow</h2>
        </div>
        
        <div className="divide-y divide-border-default">
          {GetAllusers.length === 0 && (
            <div className="flex justify-center py-8">
              <Loading />
            </div>
          )}
          
          {filteredUsers.length === 0 && GetAllusers.length > 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-text-secondary text-[15px]">
                No more suggestions available
              </p>
            </div>
          ) : (
            displayedUsers.map((profile, index) => (
              <Profileviewbox key={profile?.uid || index} bio={bio} profile={profile} />
            ))
          )}
        </div>
        
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full px-4 py-3 text-left text-accent-500 hover:bg-bg-hover text-[15px] font-medium transition-colors"
          >
            {showAll ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
}

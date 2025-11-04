import React, { useEffect, useState, useCallback } from "react";
import { BsSearch as SearchIcon } from "react-icons/bs";
import Profileviewbox from "../profile/profileviewbox";
import { getallprofile } from "../../service/Auth/database";
import { Link } from "react-router-dom";

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function Search({ bio = false }) {
  const [searchtext, setsearchtext] = useState("");
  const [relaventusers, setrelaventusers] = useState([]);

  const fetchRelevantUsers = async (query) => {
    try {
      const allusers = await getallprofile();
      const filteredUsers = allusers.filter((user) => {
        return (
          new RegExp(query, "i").test(user?.username) ||
          new RegExp(query, "i").test(user?.name)
        );
      });
      setrelaventusers([...filteredUsers]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const debouncedFetchRelevantUsers = useCallback(
    debounce(fetchRelevantUsers, 500),
    [],
  );

  useEffect(() => {
    if (searchtext) {
      debouncedFetchRelevantUsers(searchtext);
    } else {
      setrelaventusers([]);
    }
  }, [searchtext, debouncedFetchRelevantUsers]);

  return (
    <div className="relative mb-4">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl pointer-events-none" />
        <input
          type="search"
          value={searchtext}
          name="search"
          onChange={(e) => setsearchtext(e.target.value)}
          className="w-full bg-bg-tertiary border-0 rounded-full pl-12 pr-4 py-3 text-[15px] text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-500"
          placeholder="Search"
        />
      </div>

      {searchtext !== "" && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-bg-tertiary rounded-2xl shadow-large overflow-hidden z-50 max-h-96 overflow-y-auto scroll-hidden border border-border-default">
          <div className="p-4">
            {relaventusers?.length === 0 && searchtext !== "" && (
              <Link
                to={`/profile/${searchtext}`}
                className="block px-4 py-3 hover:bg-bg-hover rounded-lg transition-colors"
              >
                <span className="text-[15px] text-text-primary">
                  Search for <span className="font-bold">"{searchtext}"</span>
                </span>
              </Link>
            )}
            
            <div>
              {relaventusers?.map((profile, index) => (
                <Profileviewbox key={index} profile={profile} bio={bio} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from "react";
import TinderCard from "react-tinder-card";
import avatar from "./avatar.png";
import { useMatchStore } from "../store/useMatchStore";
const SwipeArea = () => {
  const { userProfiles, getUserProfiles, swipeLeft, swipeRight } = useMatchStore();
  const handleSwipe = (dir, user) => {
    if (dir === "left") swipeLeft(user);
    else if (dir === "right") swipeRight(user);
  };
  return (
    <div className="relative w-full max-w-sm h-[28rem] shadow-md">
      {userProfiles.map((user) => (
        <TinderCard
          className="absolute shadow-none"
          key={user._id}
          onSwipe={(dir) => handleSwipe(dir, user)}
          swipeRequirementType="position"
          swipeThreshold={100}
          preventSwipe={["up", "down"]}
        >
          <div
            className="flex flex-col bg-white w-96 h-[28rem] select-none rounded-lg overflow-hidden border
					 border-gray-200"
          >
            <figure className="px-4 pt-4 h-3/4 flex justify-center">
              <img
                src={user.image || avatar}
                alt={user.name}
                className="rounded-lg object-cover h-full pointer-events-none"
              />
            </figure>
            <div className="bg-gradient-to-b from-white to-pink-50 px-8 py-4 h-1/4 ">
              <h2 className=" text-2xl text-gray-800 font-semibold">
                {user.name}, {user.age}
              </h2>
              <p className="text-gray-600 mt-1">{user.bio}</p>
            </div>
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default SwipeArea;

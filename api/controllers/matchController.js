import User from "../models/User.js";
import { getConnectedUsers, getIO } from "../socket/socket.server.js";

export const swipeRight = async (req, res) => {
    try {
        const {likedUserId} = req.params;
        const currUser = await User.findById(req.user._id);
        const likedUser = await User.findById(likedUserId);

        if(!likedUser){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(!currUser.likes.includes(likedUserId)){
            currUser.likes.push(likedUserId);
            await currUser.save();
            if(likedUser.likes.includes(currUser._id)) {
                currUser.matches.push(likedUserId);
                likedUser.matches.push(currUser._id);
                await Promise.all([
                    await currUser.save(),
                    await likedUser.save(),
                ])
                const connectedUsers = getConnectedUsers();
                const io = getIO();
                const likedUserSocketId = connectedUsers.get(likedUserId);
                if(likedUserSocketId){
                  io.to(likedUserSocketId).emit("newMatch", {
                    _id: currUser._id,
                    name: currUser.name,
                    image: currUser.image,
                  });
                }
                const currentUserSocketId = connectedUsers.get(currUser._id.toString());
                if(currentUserSocketId){
                  io.to(currentUserSocketId).emit("newMatch", {
                    _id: likedUser._id,
                    name: likedUser.name,
                    image: likedUser.image,
                  });
                }
            }; 
        }

        res.status(200).json({  
            success: true,  
            user: currUser  
        });
    } catch (error) {
        console.log(error);     
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const swipeLeft = async (req, res) => {
  try {
    const { dislikedUserId } = req.params;
    const currUser = await User.findById(req.user._id);

    if (!currUser.likes.includes(dislikedUserId)) {
      currUser.dislikes.push(dislikedUserId);
      await currUser.save();
    }

    res.status(200).json({
      success: true,
      user: currUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "matches",
      "name image"
    );

    res.status(200).json({
      success: true,
      matches: user.matches,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserProfiles = async (req, res) => {
  try {
    const currUser = await User.findById(req.user._id);
    const users = await User.find({
      $and: [
        { _id: { $ne: currUser._id } },
        { _id: { $nin: currUser.likes } },
        { _id: { $nin: currUser.dislikes } },
        { _id: { $nin: currUser.matches } },
        {
          gender:
            currUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currUser.genderPreference,
        },
        {
          genderPreference: { $in: [currUser.gender, "both"] },
        },
      ],
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { image, ...otherData } = req.body;
    let updateData = { ...otherData };

    if (image) {
      if (image.startsWith("data:image")) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(image,{
            upload_preset: 'ml_default',
            allowed_formats: ['png', 'jpg', 'jpeg', 'svg', 'ico', 'webp'],
            max_file_size: 10000000 
          });
          updateData.image = uploadResponse.secure_url;
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "Internal server error - image upload failed",
          });
        }
      }
    }else{
      updateData.image = image;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {new: true, runValidators: true});

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
    }); 
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

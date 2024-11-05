import User from "../models/User.js";
import jwt from "jsonwebtoken";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export const signup = async (req, res) => {
  const { name, email, password, age, gender, genderPreference } = req.body;
  try {
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "Your age must be greater or equal to 18",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be greater than 6 characters",
      });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });

    const token = signToken(newUser._id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({email}).select("+password");
    console.log('User found:', !!user);  
    
    if(!user){
        console.log('No user found with email:', email);
        return res.status(401).json({
            success: false,
            message: "No user found with this email"
        });
    }

    const isPasswordValid = await user.matchPassword(password);
    console.log('Password valid:', isPasswordValid);
    
    if(!isPasswordValid){
        console.log('Invalid password for user:', email);
        return res.status(401).json({
            success: false,
            message: "Incorrect password"
        });
    }

    const token = signToken(user._id);
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

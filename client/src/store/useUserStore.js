import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set) => ({
  loading: false,

  updateProfile: async (data) => {
    try {
      set({ loading: true });
      if (data.image && data.image.startsWith("data:image")) {
        const base64Length = data.image.length;
        if (base64Length > 13000000) {
          // Roughly 10MB in base64
          throw new Error("Image size too large (max 10MB)");
        }
      }
      const res = await axiosInstance.put("/users/update", data);
      useAuthStore.getState().setAuthUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update profile error:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Server error. Please try again later.";

      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
}));

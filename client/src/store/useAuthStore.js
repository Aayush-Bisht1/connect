import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";
export const useAuthStore = create((set) => ({
  authUser: null,
  checkingAuth: true,
  loading: false,
  signup: async (signupdata) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/auth/signup", signupdata);
      set({ authUser: res.data.user });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  login: async (loginData) => {
    try {
      set({ loading: true });
      console.log("Attempting login with data:", {
        ...loginData,
        password: "[REDACTED]", 
      });

      const res = await axiosInstance.post("/auth/login", loginData);
      console.log("Login response:", res.data);

      if (res.data.success) {
        set({ authUser: res.data.user });
        initializeSocket(res.data.user._id);
        toast.success("Logged in successfully");
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      set({
        authUser: null,
        loading: false,
      });

      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      disconnectSocket();
      if (res.status === 200) set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  },
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ checkingAuth: false });
    }
  },
  setAuthUser: (user) => set({ authUser: user }),
}));

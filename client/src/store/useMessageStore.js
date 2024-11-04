import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket, initializeSocket } from "../socket/socket.client";
import { useAuthStore } from "./useAuthStore";

export const useMessageStore = create((set) => ({
    messages: [],
    loading: false,
    sendingMessage: false,
    sendMessage: async (receiverId,content) => {
      try {
        set({ sendingMessage: true });
        set(state => ({messages: [...state.messages, {
            _id: Date.now(),
            sender: useAuthStore.getState().authUser._id,
            content
        }]}));
        const res = await axiosInstance.post("/messages/send", {receiverId,content});
        return res.data;
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong");
        throw error;
      }finally{
        set({ sendingMessage: false });
      }
    }, 
    getMessages: async (userId) => {
        try {
            set({ loading: true });
            const res = await axiosInstance.get(`/messages/conversation/${userId}`);
            set({ messages: res.data.Messages , loading: false });
        } catch (error) {
            console.log(error);
            set({ messages: [], loading: false });
            toast.error(error.response.data.message || "Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
    subscribeToMessages: async () => {
        try {
            const userId = useAuthStore.getState().authUser?._id;
            if (!userId) throw new Error("User not authenticated");

            await initializeSocket(userId);
            const socket = getSocket();
            
            if (!socket) throw new Error("Failed to initialize socket");

            socket.on("newMessage", ({ message }) => {
                set((state) => ({ messages: [...state.messages, message] }));
            });
        } catch (error) {
            console.error("Socket subscription error:", error);
            toast.error("Failed to connect to chat service");
        }
    },
    unsubscribeFromMessages: async () => {
        const socket = getSocket();
        if (socket) {
            socket.off("newMessage");
        }
    }
}))
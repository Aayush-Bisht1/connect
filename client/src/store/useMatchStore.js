import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getSocket } from "../socket/socket.client";

export const useMatchStore = create((set) => ({
    isloadingMatches: false,
    isloadinguserProfiles: false,   
    matches: [],
    userProfiles: [],
    SwipeFeedback: null,
    getMatches: async () => {
        try {
            set({ isloadingMatches: true });
            const res = await axiosInstance.get("/matches");
            set({ matches: res.data.matches});
        } catch (error) {
            console.log(error);
            set({ matches: [] });
            toast.error(error.response.data.message || "Something went wrong");
        }finally{
            set({ isloadingMatches: false });
        }
    },
    getUserProfiles: async () => {
        try {
            set({ isloadinguserProfiles: true });
            const res = await axiosInstance.get("/matches/user-profiles");
            set({ userProfiles: res.data.users});
        } catch (error) {
            console.log(error);
            set({ userProfiles: [] });
            toast.error(error.response.data.message || "Something went wrong");
        }finally{
            set({ isloadinguserProfiles: false });
        }
    },
    swipeLeft: async (user) => {
        try {
            set({ SwipeFeedback: 'Passed' });
            await axiosInstance.post("/matches/swipe-left/" + user._id );
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        }finally{
            setTimeout(()=> set({ SwipeFeedback: null }), 1500);
        }
    },
    swipeRight: async (user) => {
        try {
            set({ SwipeFeedback: 'Liked' });
            await axiosInstance.post("/matches/swipe-right/" + user._id );
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        }finally{
            setTimeout(()=> set({ SwipeFeedback: null }), 1500);
        }
    },
    subscribeToNewMatches: async () => {
        try {
            const socket = getSocket();
            socket.on("newMatch", (newMatch) => {
                set((state) => ({ matches: [newMatch, ...state.matches] }));
                toast.success("You got a new match! Let's chat!"); 
            });
        } catch (error) {
            console.log(error);
        }
    },
    unsubscribeFromNewMatches: async () => {
        try {
            const socket = getSocket();
            socket.off("newMatch");
        } catch (error) {
            console.log(error);
        }
    } 

}))
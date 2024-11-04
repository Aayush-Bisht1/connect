import io from "socket.io-client";

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

let socket = null;

export const initializeSocket = (userId) => {
    return new Promise((resolve, reject) => {
        if (!userId) {
            reject(new Error("User ID is required"));
            return;
        }

        if (socket?.connected) {
            resolve(socket);
            return;
        }

        socket = io(SOCKET_URL, {
            auth: { userId },
        });

        socket.on("connect", () => resolve(socket));
        socket.on("connect_error", (err) => reject(err));
    });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
	if (socket?.connected) {
        socket.disconnect();
        socket = null;
    }
};
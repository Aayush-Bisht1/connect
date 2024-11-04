import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/usersRoutes.js";
import messageRoute from "./routes/messageRoutes.js";
import matchRoute from "./routes/matchRoutes.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./socket/socket.server.js";
import path from "path";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

initializeSocket(httpServer);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,  
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/matches", matchRoute);
app.use("/api/messages", messageRoute);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
	});
}

httpServer.listen(PORT, () => {
  console.log("running on " + PORT);
  connectDB();
});

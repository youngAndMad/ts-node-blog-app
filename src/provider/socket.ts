import { Server } from "socket.io";
import http from "http";
import express from "express";
import {
  getAllOnlineUsers,
  setOffline,
  setOnline,
} from "../service/user-status.service";
import { setUserSocket, clearUserSocket } from "../service/user-socket.service";
import { verifyToken } from "./jwt";
import { TokenType } from "../model/enum/token-type";
import { findUser } from "../service/user.service";
import { UserDto } from "../model/dto/user.dto";
import { getLogger } from "./logger";

const log = getLogger("socket");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "DELETE"],
  },
});

io.on("connection", async (socket) => {
  let token = socket.handshake.auth.token;
  verifyToken(token.substring("Bearer ".length), TokenType.ACCESS)
    .then(async (val) => {
      console.log(val);
      const user = (await findUser(val.id)) as UserDto;

      if (user == null) {
        log.error("invalid credentials to open socket connection");
        socket.disconnect();
      }

      setOnline(user.id);
      await setUserSocket(user.id, socket.id);

      io.emit("getOnlineUsers", await getAllOnlineUsers());
      socket.emit("greeting", `Hello, ${user.username}! Welcome to the chat.`);

      socket.on("newMessage", (message: any) => {
        console.log("new message", message);
      });

      socket.on("disconnect", async () => {
        console.log("user disconnected", user.id);
        setOffline(user.id);
        clearUserSocket(user.id);
        io.emit("getOnlineUsers", await getAllOnlineUsers());
      });
    })
    .catch((err) => {
      console.error(err);
      socket.emit("error", err);
      socket.disconnect();
    });
});

export { app, io, server };

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
    origin: ["*"],
    methods: ["GET", "POST", "DELETE"],
  },
});

io.on("connection", async (socket) => {
  let token = socket.handshake.auth.token;
  verifyToken(token.substring("Bearer ".length), TokenType.ACCESS)
    .then(async (val) => {
      const user = (await findUser(val.id)) as UserDto;

      if (user == null) {
        log.error("invalid credentials to open socket connection");
        socket.disconnect();
      }

      setOnline(user.id);
      await setUserSocket(user.id, socket.id);

      io.emit("getOnlineUsers", await getAllOnlineUsers());

      socket.on("newMessage", (message: any) => {
        log.info(`new message  = ${message}`);
      });

      socket.on("disconnect", async () => {
        log.info("user disconnected", user.id);
        setOffline(user.id);
        clearUserSocket(user.id);
      });
    })
    .catch((err) => {
      log.error("an error ", err);
      socket.emit("error", err);
      socket.disconnect();
    });
});

export { app, io, server };

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io("/", { path: "/api/sync/socket" });
  }
  return socket;
};

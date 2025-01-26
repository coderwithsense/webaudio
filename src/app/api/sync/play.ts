import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";

interface ExtendedSocket extends NetSocket {
  server: HTTPServer;
}

interface ExtendedServer extends HTTPServer {
  io?: SocketIOServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as ExtendedSocket;

  if (!socket.server) {
    res.status(500).json({ error: "Server not available on socket" });
    return;
  }

  const httpServer: ExtendedServer = socket.server;

  if (!httpServer.io) {
    const io = new SocketIOServer(httpServer, {
      path: "/api/sync/socket",
    });

    httpServer.io = io;

    io.on("connection", (socket) => {
      console.log("New connection:", socket.id);

      socket.on("joinRoom", ({ roomId }: { roomId: string }) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
      });

      socket.on(
        "play",
        ({ roomId, timestamp }: { roomId: string; timestamp: number }) => {
          io.to(roomId).emit("play", { timestamp });
        }
      );

      socket.on("pause", ({ roomId }: { roomId: string }) => {
        io.to(roomId).emit("pause");
      });

      socket.on("seek", ({ roomId, time }: { roomId: string; time: number }) => {
        io.to(roomId).emit("seek", { time });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    console.log("WebSocket server initialized");
  }

  res.end();
}

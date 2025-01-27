import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL
  },
});

// Handles client connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

});


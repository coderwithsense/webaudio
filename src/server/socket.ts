import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface DeviceInfo {
  deviceName: string;
  ipAddress: string;
}

interface RoomDevice {
  deviceInfo: DeviceInfo;
  socketId: string;
}

const io = new Server({
  cors: {
    origin: "*", // Frontend URL will be here
  },
});


const rooms: Record<string, RoomDevice[]> = {}

// Handles client connections
io.on("connection", (socket) => {
  let socketClients = io.engine.clientsCount;
  console.log("User connected:", socket.id, socketClients);

  socket.on("disconnect", () => {
    // Remove disconnected device from all rooms
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((device) => device.socketId !== socket.id);

      // Notify remaining users in the room
      io.to(room).emit("update-devices", rooms[room]);
    }
  });

  socket.on("join-room", (roomCode: string, deviceInfo: DeviceInfo, socketId: string) => {
    socket.join(roomCode);

    if(!rooms[roomCode]){
      rooms[roomCode] = [];
    }

     // Add new device to the room if not already present
     if (!rooms[roomCode].some((device) => device.socketId === socketId)) {
      rooms[roomCode].push({ deviceInfo, socketId });
    }

    // Broadcast updated device list to all users in the room
    io.to(roomCode).emit("update-devices", rooms[roomCode]);
  });
  
  socket.on("get-stream-url", (streamUrl) => {
    socket.broadcast.emit("set-stream-url", streamUrl); // send the url to all connected devices except who sent url
  })

});

io.listen(4000)
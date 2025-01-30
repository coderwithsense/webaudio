import { Server } from "socket.io";

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
  
  socket.on("get-stream-url", (roomCode, streamUrl) => {
    socket.broadcast.to(roomCode).emit("set-stream-url", streamUrl); // send the url to all connected devices except who sent url
  });

  socket.on("get-volume-value", (roomCode, newVolume) => {
    socket.broadcast.to(roomCode).emit("set-volume-value", newVolume)
  })

  socket.on("get-changed-duration", (roomCode, newTime, duration) => {
    socket.broadcast.to(roomCode).emit("set-changed-duration", newTime, duration)
  })

  // In Progress
  socket.on("get-play-value", (roomCode, value: boolean) => {
    socket.broadcast.to(roomCode).emit("set-play-value", value)
  })

});

io.listen(4000)
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface DeviceInfo{
  deviceName: string;
  ipAddress: string
}

const io = new Server({
  cors: {
    origin: "*", // Frontend URL
  },
});




// Handles client connections
io.on("connection", (socket) => {
  let socketClients = io.engine.clientsCount;
  console.log("User connected:", socket.id, socketClients);

  socket.on("disconnect", () => {
    socketClients--
    console.log("User disconnected", socketClients)
  });

  socket.on("join-room", (roomCode, deviceInfo) => {
    socket.join(roomCode);
    socket.emit("device-info", deviceInfo)
  });
  
  socket.on("get-stream-url", (streamUrl) => {
    socket.broadcast.emit("set-stream-url", streamUrl); // send the url to all connected devices except who sent url
  })

});

io.listen(4000)
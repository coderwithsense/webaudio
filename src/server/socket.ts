import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

interface DeviceInfo{
  deviceName: string;
  ipAddress: string
}

const io = new Server({
  cors: {
    origin: "http://localhost:3000", // Frontend URL
  },
});

// Handles client connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id, io.engine.clientsCount);

  socket.on("disconnect", () => {
    console.log("User disconnected", io.engine.clientsCount)
  });

  socket.on("get-device-info", (deviceInfo: DeviceInfo) => {
    console.log("Device Info received on server:", deviceInfo.deviceName)
  })

});

io.listen(4000)
// Server-side (Socket.io) - Room Creation
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid'; // For generating unique room codes

const io = new Server();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Room Creation
  socket.on('create-room', () => {
    const roomCode = uuidv4(); // Unique room code
    socket.join(roomCode); // Add the user to the newly created room
    console.log(`Room created with code: ${roomCode}`);

    // Emit the room code to the user
    socket.emit('room-created', roomCode);
  });

  // Room Joining
  socket.on('join-room', (roomCode) => {
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (room) {
      socket.join(roomCode); // Join the room with the provided code
      console.log(`User joined room: ${roomCode}`);
      socket.emit('room-joined', roomCode);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

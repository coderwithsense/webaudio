"use client";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ArrowRight } from "lucide-react";
import { generateRandomCode, getDeviceInfo, getSocket } from "@/lib/utils";

interface DeviceInfo{
  deviceName: string;
  ipAddress: string;
}

interface RoomDevice {
  deviceInfo: DeviceInfo;
  socketId: string;
}

const RoomControl = () => {
  const { toast } = useToast();
  const [roomCode, setRoomCode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const socket = getSocket()

  socket.on("connect", () => {
    console.log(socket.id)
  })


  const handleCreateRoom = async () => {
    const deviceInfo: DeviceInfo = await getDeviceInfo()  // get the device info    
    const newRoomCode = generateRandomCode();
    setRoomCode(newRoomCode);
    socket.emit("join-room", newRoomCode, deviceInfo, socket.id) // and send device info to the websocket server 
      toast({
        variant: "default",
        title: "Room Created",
        description: `Room Created with id: ${newRoomCode}`,
      });
  };

  const handleJoinRoom = async() => {
    if(!roomCode){
      toast({
        variant: "destructive",
        title: "Invalid Room Code",
        description: `Enter a valid room code`,
      });
      return;
    }
    setIsDialogOpen(false)
    const deviceInfo = await getDeviceInfo()  // get the device info    
    socket.emit("join-room", roomCode, deviceInfo, socket.id); // and send it to the websocket server
    toast({
      variant: "default",
      title: "Room Joined",
      description: `Room Joined with id: ${roomCode}`,
    });

  };

  return (
    <>
    <div className="flex items-center justify-center gap-5">
      <div className="text-center pt-4">
        <Button
          onClick={handleCreateRoom}
          variant="outline"
          className="hover-scale"
        >
          Create Room
        </Button>
      </div>
      <div className="text-center pt-4">
        <Dialog open={isDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="hover-scale">
              Join Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enter Room Code</DialogTitle>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Input
                  type="text"
                  placeholder="Room Code"
                  onChange={(e) => setRoomCode(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <Button
                type="button"
                variant="outline"
                className="mx-auto rounded-2xl"
                onClick={handleJoinRoom}
              >
                <ArrowRight />
              </Button>
              <DialogClose asChild/>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
      {roomCode && <p className="text-center">Room id: {roomCode}</p>}
    </>
  );
};

export default RoomControl;

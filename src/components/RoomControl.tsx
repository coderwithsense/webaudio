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
import { getDeviceInfo, getSocket } from "@/lib/utils";
import { useDeviceList } from "@/context/DeviceListContext";


const RoomControl = () => {
  const { toast } = useToast();
  const { devices, setDevices } = useDeviceList()
  const [roomCode, setRoomCode] = useState("")
  const socket = getSocket()

  socket.on("connect", () => {
    console.log(socket.id)
  })

  const handleCreateRoom = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Device info is not available",
      });
  };

  const handleJoinRoom = async() => {
  const deviceInfo = await getDeviceInfo() 
  setDevices([deviceInfo])
  socket.emit("get-device-info", deviceInfo)
      toast({
        variant: "destructive",
        title: "Error",
        description: `device info is : ${deviceInfo.deviceName} and ${deviceInfo.ipAddress}`,
      });
  };

  return (
    <div className="flex items-center justify-center gap-5">
      your id is {socket.id}
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="hover-scale">
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
                  value={roomCode}
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
              <DialogClose asChild />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RoomControl;

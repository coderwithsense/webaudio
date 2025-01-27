"use client";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
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


const RoomControl = () => {
  const { toast } = useToast();
  const [roomCode, setRoomCode] = useState("")

  const handleCreateRoom = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Device info is not available",
      });
  };

  const handleJoinRoom = () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Room code or device info is not available",
      });
  };

  return (
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

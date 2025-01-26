"use client";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const RoomControl = () => {
  const { toast } = useToast();


  const createRoom = () => {
    toast({
      title: "Creating a Room",
      description: "Room would me created in a moment",
    });
  };
  const joinRoom = () => {
    toast({
      title: "Join a Room",
      description: "Room would me joined in a moment",
    });
  };
  return (
    <div className="flex items-center justify-center gap-5">
      <div className="text-center pt-4">
        <Button onClick={createRoom} variant="outline" className="hover-scale">
          Create Room
        </Button>
      </div>
      <div className="text-center pt-4">
        <Button onClick={joinRoom} variant="outline" className="hover-scale">
          Join Room
        </Button>
      </div>
    </div>
  );
};

export default RoomControl;

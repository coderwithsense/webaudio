"use client"
import { createContext, useContext, useState, ReactNode } from "react";

interface RoomContextType {
  roomCode: string;
  setRoomCode: (code: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomCode, setRoomCode] = useState("");

  return (
    <RoomContext.Provider value={{ roomCode, setRoomCode }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider only");
  }
  return context;
};

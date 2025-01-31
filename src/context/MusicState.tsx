"use client"
import { createContext, useContext, useState, ReactNode } from "react";

interface MusicStateContextType {
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
}

const MusicStateContext = createContext<MusicStateContextType | undefined>(undefined);

export const MusicStateProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <MusicStateContext.Provider value={{ isPlaying, setIsPlaying }}>
      {children}
    </MusicStateContext.Provider>
  );
};

export const useMusicState = () => {
  const context = useContext(MusicStateContext);
  if (!context) {
    throw new Error("useMusicState must be used within a MusicState Provider only");
  }
  return context;
};

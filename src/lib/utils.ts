import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { publicIp } from "public-ip";
import { io, Socket} from "socket.io-client";
import { useEffect } from "react";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getDeviceInfo = async () => {
  const deviceName = navigator.userAgent;
  const ipAddress = await publicIp();

  return {
    deviceName,
    ipAddress
  };
};


let socket:Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("http://localhost:4000");
  }
  useEffect(() => {
    return () => {
      if(socket){
      socket.disconnect();
      }
    };
  }, []);
  return socket;
};


export const generateRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}
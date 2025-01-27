import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { publicIp } from "public-ip";

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
"use client"
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSocket } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useMusicState } from '@/context/MusicState';
import { Audio } from 'react-loader-spinner';
import { Button } from './ui/button';

interface DeviceInfo{
  deviceName: string;
  ipAddress: string
}

interface RoomDevice{
  deviceInfo: DeviceInfo;
  ipAddress: string;
}

export function DeviceList() {
  const socket = getSocket()
  const [devices, setDevices] = useState<RoomDevice[]>([]);
  const { isPlaying, setIsPlaying } = useMusicState()

  useEffect(() => {
    const handleUpdateDevices = (updatedDevices: RoomDevice[]) => {
      setDevices(updatedDevices);
    };

    socket.on("update-devices", handleUpdateDevices);

    return () => {
      socket.off("update-devices", handleUpdateDevices);
    };
  }, []);
  return (
    <Card className="glass-card p-6">
      <h2 className="text-2xl font-semibold mb-4">Connected Devices</h2>
      
      <div className="space-y-3">
        {devices.map((device, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-medium">{device.deviceInfo.deviceName}</span>
              <span className="text-sm text-muted-foreground">{device.ipAddress}</span>
            </div>
            {isPlaying ? 
                <Audio 
                  color="#3b82f6"
                  width={30}
                  height={30}
                  ariaLabel="audio-playing"
                />
                :
                <Button
                  variant="outline"
                  className="text-md cursor-pointer hover:text-white hover:bg-black"
                  // Implement on Click function to play on the device 
                >
                Play
                </Button>
            }
          </div>
        ))}
      </div>
    </Card>
  );
}
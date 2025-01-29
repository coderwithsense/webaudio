"use client"
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSocket } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface DeviceInfo{
  deviceName: string;
  ipAddress: string
}

export function DeviceList() {
  const socket = getSocket()
  const [devices, setDevices] = useState<DeviceInfo[]>([]);

  useEffect(() => {
    const handleDeviceInfo = (deviceInfo: DeviceInfo) => {
      if (deviceInfo) {
        setDevices((prevDevices) => [...prevDevices, deviceInfo]);
      }
    };

    socket.on("device-info", handleDeviceInfo);

    return () => {
      socket.off("device-info", handleDeviceInfo);
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
              <span className="font-medium">{device.deviceName}</span>
              <span className="text-sm text-muted-foreground">{device.ipAddress}</span>
            </div>
            <Badge
              variant="outline"
              className=' text-green-500 hover:text-white hover:bg-black'
            >
              Connected
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
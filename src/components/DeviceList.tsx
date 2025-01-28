"use client"
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDeviceList } from '@/context/DeviceListContext';

export function DeviceList() {
  const {devices} = useDeviceList()

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
              variant={'default'}
              className={'bg-success hover:bg-success'}
            >
              Connected
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
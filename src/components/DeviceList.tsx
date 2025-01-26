import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Device {
  id: string;
  name: string;
  ip: string;
  status: 'connected' | 'disconnected';
}

const mockDevices: Device[] = [
  { id: '1', name: 'Device 1', ip: '192.168.1.2', status: 'connected' },
  { id: '2', name: 'Device 2', ip: '192.168.1.3', status: 'connected' },
  { id: '3', name: 'Device 3', ip: '192.168.1.4', status: 'disconnected' },
];

export function DeviceList() {
  return (
    <Card className="glass-card p-6">
      <h2 className="text-2xl font-semibold mb-4">Connected Devices</h2>
      
      <div className="space-y-3">
        {mockDevices.map((device) => (
          <div
            key={device.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-medium">{device.name}</span>
              <span className="text-sm text-muted-foreground">{device.ip}</span>
            </div>
            <Badge
              variant={device.status === 'connected' ? 'default' : 'secondary'}
              className={
                device.status === 'connected'
                  ? 'bg-success hover:bg-success'
                  : ''
              }
            >
              {device.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
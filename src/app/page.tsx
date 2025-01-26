"use client"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AudioControls } from '@/components/AudioControls';
import { DeviceList } from '@/components/DeviceList';
import { Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const { toast } = useToast();
  const [streamUrl, setStreamUrl] = useState('');
  const [volume, setVolume] = useState([50]);
  
  const handleSync = () => {
    toast({
      title: "Syncing devices...",
      description: "Attempting to synchronize all connected devices",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold gradient-bg text-transparent bg-clip-text">
            Multi-Device Audio Stream
          </h1>
          <p className="text-muted-foreground">
            Stream synchronized audio to multiple devices over Wi-Fi
          </p>
        </div>

        {/* Audio Controls Card */}
        <Card className="glass-card p-6 space-y-6">
          <h2 className="text-2xl font-semibold">Audio Controls</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="streamUrl" className="text-sm font-medium">
                Stream URL
              </label>
              <Input
                id="streamUrl"
                placeholder="Enter the audio stream URL"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                className="w-full"
              />
            </div>

            <AudioControls
              streamUrl={streamUrl}
            />

            <div className="flex items-center gap-4">
              <Volume2 className="w-5 h-5" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={handleSync}
                variant="outline"
                className="hover-scale"
              >
                Sync Devices
              </Button>
            </div>
          </div>
        </Card>

        {/* Device List */}
        <DeviceList />
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from './ui/slider';

interface AudioControlsProps {
  streamUrl: string;
}

export function AudioControls({ streamUrl }: AudioControlsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState([0.2])

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  useEffect(() => {
    if (audioRef.current && volume.length > 0) {
      audioRef.current.volume = volume[0];
    }
  }), [volume]

  const togglePlayback = () => {
    if (!streamUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid stream URL",
      });
      return;
    }

    if (!isPlaying) {
      if(audioRef.current){
        if(audioRef.current.src !== streamUrl){ //Optimise
          audioRef.current.src = streamUrl;
        }
        audioRef.current.play().catch((error) => {
          toast({
            variant: "destructive",
            title: "Playback Error",
            description: "Failed to play audio stream",
          });
        });
      }
    } else {
      if(audioRef.current){
        audioRef.current.pause();
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className='flex flex-col gap-y-4'>
      <div className="flex justify-center items-center">
        <Button
        onClick={togglePlayback}
        size="lg"
        className="hover-scale w-32"
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </Button>
      </div>
      

      <div className='flex justify-center items-center gap-3'>
              <Volume2 className="w-5 h-5" />
              <Slider
                value={volume}
                onValueChange={(newVolume: number | number[] ) => {
                  if(Array.isArray(newVolume)){
                    setVolume(newVolume)
                  }else{
                    setVolume([newVolume])
                  }
                }}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
    </div>
  );
}
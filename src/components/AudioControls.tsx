"use client";

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioControlsProps {
  streamUrl: string;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export function AudioControls({ streamUrl, isPlaying, setIsPlaying }: AudioControlsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

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
      if (audioRef.current) {
        audioRef.current.src = streamUrl;
        audioRef.current.play().catch((error) => {
          toast({
            variant: "destructive",
            title: "Playback Error",
            description: "Failed to play audio stream",
          });
        });
      }
    } else {
      audioRef.current?.pause();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex justify-center">
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
  );
}
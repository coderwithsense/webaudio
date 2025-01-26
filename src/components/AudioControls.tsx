"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioControlsProps {
  streamUrl: string;
}

export function AudioControls({ streamUrl }: AudioControlsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  useEffect(() => {
    if(audioRef.current && streamUrl){
      audioRef.current.src = streamUrl;
     // audioRef.current = new Audio();
    }
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

    const audio = audioRef.current;
    if(!audio) return

    if (!isPlaying) {
        audio.play().catch((error) => {
          setIsPlaying(false)
          toast({
            variant: "destructive",
            title: "Playback Error",
            description: "Failed to play audio stream",
          });
        });
        setIsPlaying(true)
    } else {
        audio.pause()
        setIsPlaying(false)
      }
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
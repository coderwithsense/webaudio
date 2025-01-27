"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";

export function AudioControls() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState([0.2]);
  const [streamUrl, setStreamUrl] = useState("");

  useEffect(() => {
    if(!audioRef.current){
      audioRef.current = new Audio();
    }
  }, []);

  useEffect(() => {
    if (audioRef.current && volume.length > 0) {
      audioRef.current.volume = volume[0];
    }
  }, [volume])

  const togglePlayback = () => {
  if (!streamUrl) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Please enter a valid stream URL",
    });
    return;
  }

  if (!audioRef.current) return;

  // Set stream URL only if it's not already set or has changed
  if (audioRef.current.src !== streamUrl) {
    audioRef.current.src = streamUrl;
  }

  if (!isPlaying) {
    audioRef.current
      .play()
      .then(() => {
        console.log("Playing audio");
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error("Playback error:", error);
        toast({
          variant: "destructive",
          title: "Playback Error",
          description: "Failed to play audio stream",
        });
      });
  } else {
    audioRef.current.pause();
    setIsPlaying(false);
  }
  };

  return (
    <>
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

      <div className="flex flex-col gap-y-4">
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

        <div className="flex justify-center items-center gap-3">
          <Volume2 className="w-5 h-5" />
          <Slider
            value={volume}
            onValueChange={(newVolume: number | number[]) => {
              if (Array.isArray(newVolume)) {
                setVolume(newVolume);
              } else {
                setVolume([newVolume]);
              }
            }}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}

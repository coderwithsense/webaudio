"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { getSocket } from "@/lib/utils";
import { useRoom } from "@/context/RoomContext";

export function AudioControls() {
  const socket = getSocket();
  const { roomCode } = useRoom();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState([0.2]);
  const [duration, setDuration] = useState<number>(0);
  const [currentPlayingDuration, setCurrentPlayingDuration] = useState<number>(0);
  const [streamUrl, setStreamUrl] = useState("");
  const [displayDuration, setDisplayDuration] = useState<string>("00:00 / 00:00");

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const updateTime = () => {
      const currentTime = audioRef.current!.currentTime;
      setCurrentPlayingDuration(currentTime);
      setDisplayDuration(
        `${formatTime(currentTime)} / ${formatTime(duration)}`
      );
    };

    const updateMetadata = () => {
      if (audioRef.current) {
        const audioDuration = audioRef.current.duration || 0;
        setDuration(audioDuration);
        setDisplayDuration(`00:00 / ${formatTime(audioDuration)}`);
      }
    };

    audioRef.current.addEventListener("timeupdate", updateTime);
    audioRef.current.addEventListener("loadedmetadata", updateMetadata);

    return () => {
      audioRef.current?.removeEventListener("timeupdate", updateTime);
      audioRef.current?.removeEventListener("loadedmetadata", updateMetadata);
    };
  }, [duration, volume, isPlaying]);

  useEffect(() => {
    if (audioRef.current && volume.length > 0) {
      audioRef.current.volume = volume[0];
    }
  }, [volume]);

  socket.on("set-audio-duration", (currentAudioTime: number) => {
    setCurrentPlayingDuration(currentAudioTime);
    if (audioRef.current) {
      audioRef.current.currentTime = currentAudioTime;
    }
  });

  socket.on("set-stream-url", (Url) => {
    setStreamUrl(Url); // Sync URL for all users
  });

  socket.on("set-volume-value", (newVolume) => {
    setVolume(Array.isArray(newVolume) ? newVolume : [newVolume]);
  });

  socket.on("set-changed-duration", (newTime, duration) => {
    setDisplayDuration(`${formatTime(newTime)} / ${formatTime(duration)}`);
    setCurrentPlayingDuration(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  });

  // In Progress
  socket.on("set-play-value", (value: boolean) => {
    setIsPlaying(value);
    if (audioRef.current) {
      if (!value) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  });

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentPlayingDuration(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      socket.emit("get-changed-duration", roomCode, newTime, duration);
    }
  };

  const togglePlayback = async () => {
    if (!audioRef.current) return;
    const decodedUrl = decodeURIComponent(audioRef.current.src);

    if (!streamUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid stream URL",
      });
      return;
    }

    if (decodedUrl !== streamUrl) {
      audioRef.current.src = streamUrl;
      socket.emit("get-stream-url", roomCode, streamUrl);
    }

    if (!isPlaying) {
      await audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          socket.emit("get-play-value", roomCode, true);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Playback Error",
            description: `${error.message}`,
          });
          setIsPlaying(false);
        });
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      socket.emit("get-play-value", roomCode, false);
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
          <div className="flex flex-col items-center justify-center gap-y-3">
            <Slider
              orientation="vertical"
              value={volume}
              onValueChange={(newVolume) => {
                setVolume(Array.isArray(newVolume) ? newVolume : [newVolume]);
                socket.emit("get-volume-value", roomCode, newVolume);
              }}
              max={1}
              step={0.01}
              className="h-32 bg-black rounded-2xl flex items-center justify-center py-2 outline cursor-pointer"
            />
            <Volume2 className="w-5 h-5" />
          </div>

          <div className="w-full flex flex-col items-center gap-y-4">
            <input
              type="range"
              max={duration}
              value={currentPlayingDuration}
              className="w-full bg-blue-300 cursor-pointer"
              onChange={handleDurationChange}
            />
            <span className="text-sm font-medium text-gray-600">
              {displayDuration}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AudioControls } from "@/components/AudioControls";
import { DeviceList } from "@/components/DeviceList";
import RoomControl from "@/components/RoomControl";
import { io } from "socket.io-client";

export default function Index() {




  return (
    <div className="min-h-screen bg-background p-4 md:p-8 ">
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
            

            <AudioControls/>

            <RoomControl />
          </div>
        </Card>

        {/* Device List */}
        <DeviceList />
      </div>
    </div>
  );
}

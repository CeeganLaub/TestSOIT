'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Monitor,
  MessageSquare,
  Users,
  Settings,
  Maximize,
  Minimize,
  Circle,
  Square,
} from 'lucide-react';

type VideoRoomProps = {
  roomUrl: string;
  token?: string;
  userName: string;
  isHost?: boolean;
  onLeave?: () => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
};

type Participant = {
  id: string;
  name: string;
  videoOn: boolean;
  audioOn: boolean;
  isLocal: boolean;
  isHost: boolean;
};

export function VideoRoom({
  roomUrl,
  token,
  userName,
  isHost = false,
  onLeave,
  onRecordingStart,
  onRecordingStop,
}: VideoRoomProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Simulate connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setParticipants([
        { id: 'local', name: userName, videoOn: true, audioOn: true, isLocal: true, isHost },
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, [userName, isHost]);

  const toggleVideo = useCallback(() => {
    setVideoEnabled((prev) => !prev);
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabled((prev) => !prev);
  }, []);

  const toggleScreenShare = useCallback(() => {
    setIsScreenSharing((prev) => !prev);
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      onRecordingStop?.();
    } else {
      setIsRecording(true);
      onRecordingStart?.();
    }
  }, [isRecording, onRecordingStart, onRecordingStop]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleLeave = useCallback(() => {
    setIsConnected(false);
    onLeave?.();
  }, [onLeave]);

  // Loading state
  if (isConnecting) {
    return (
      <Card className="w-full h-full min-h-[500px] flex items-center justify-center bg-gray-900">
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
          <p className="text-white text-lg">Connecting to consultation...</p>
          <p className="text-gray-400 text-sm mt-2">Please allow camera and microphone access</p>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full h-full min-h-[500px] flex items-center justify-center bg-gray-900">
        <CardContent className="text-center">
          <VideoOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg">Unable to connect</p>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] bg-gray-900 rounded-lg overflow-hidden"
    >
      {/* Main Video Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* In production, this would be replaced with actual Daily.co iframe/SDK */}
        <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {videoEnabled ? (
            <div className="w-full h-full flex items-center justify-center">
              {/* Placeholder for video feed */}
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-law-navy text-white flex items-center justify-center text-4xl font-bold mx-auto mb-4">
                  {userName.split(' ').map(n => n[0]).join('')}
                </div>
                <p className="text-white text-lg">{userName}</p>
                <p className="text-gray-400 text-sm">Video preview</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <VideoOff className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Camera is off</p>
            </div>
          )}
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full text-white text-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Recording
          </div>
        )}

        {/* Participant Count */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded-full text-white text-sm">
          <Users className="h-4 w-4" />
          {participants.length}
        </div>
      </div>

      {/* Self View (Picture-in-Picture) */}
      {isConnected && (
        <div className="absolute bottom-24 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
          {videoEnabled ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-law-navy text-white flex items-center justify-center text-xl font-bold">
                {userName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <VideoOff className="h-8 w-8 text-gray-500" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-0.5 rounded">
            You
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center justify-center gap-3">
          {/* Audio Toggle */}
          <Button
            variant={audioEnabled ? 'outline' : 'destructive'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleAudio}
          >
            {audioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>

          {/* Video Toggle */}
          <Button
            variant={videoEnabled ? 'outline' : 'destructive'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleVideo}
          >
            {videoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          {/* Screen Share */}
          <Button
            variant={isScreenSharing ? 'default' : 'outline'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleScreenShare}
          >
            <Monitor className="h-6 w-6" />
          </Button>

          {/* Recording (Host only) */}
          {isHost && (
            <Button
              variant={isRecording ? 'destructive' : 'outline'}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={toggleRecording}
            >
              {isRecording ? <Square className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
            </Button>
          )}

          {/* Chat */}
          <Button
            variant={showChat ? 'default' : 'outline'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={() => setShowChat(!showChat)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>

          {/* Participants */}
          <Button
            variant={showParticipants ? 'default' : 'outline'}
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <Users className="h-6 w-6" />
          </Button>

          {/* Fullscreen */}
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </Button>

          {/* Leave Call */}
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full w-14 h-14"
            onClick={handleLeave}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="absolute top-0 right-0 bottom-20 w-80 bg-white dark:bg-gray-800 shadow-lg border-l">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Chat</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto h-[calc(100%-120px)]">
            <p className="text-sm text-gray-500 text-center">No messages yet</p>
          </div>
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>
        </div>
      )}

      {/* Participants Panel */}
      {showParticipants && (
        <div className="absolute top-0 right-0 bottom-20 w-80 bg-white dark:bg-gray-800 shadow-lg border-l">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Participants ({participants.length})</h3>
          </div>
          <div className="p-4 space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-law-navy text-white flex items-center justify-center text-sm font-bold">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {participant.name}
                      {participant.isLocal && ' (You)'}
                    </p>
                    {participant.isHost && (
                      <p className="text-xs text-gray-500">Host</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {participant.audioOn ? (
                    <Mic className="h-4 w-4 text-green-500" />
                  ) : (
                    <MicOff className="h-4 w-4 text-gray-400" />
                  )}
                  {participant.videoOn ? (
                    <Video className="h-4 w-4 text-green-500" />
                  ) : (
                    <VideoOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoRoom;

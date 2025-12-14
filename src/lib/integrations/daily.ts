/**
 * Daily.co Video Consultation Integration
 * HIPAA-compliant video calls for legal consultations
 */

type DailyConfig = {
  apiKey: string;
  domain: string;
};

type RoomConfig = {
  name?: string;
  privacy?: 'public' | 'private';
  expiresInMinutes?: number;
  maxParticipants?: number;
  enableKnocking?: boolean;
  enableScreenShare?: boolean;
  enableRecording?: boolean;
  enableChat?: boolean;
  enableWaitingRoom?: boolean;
  startVideoOff?: boolean;
  startAudioOff?: boolean;
  lang?: string;
};

type Room = {
  id: string;
  name: string;
  url: string;
  privacy: string;
  createdAt: string;
  config: RoomConfig;
};

type MeetingToken = {
  token: string;
  room_name: string;
  exp: number;
  user_name?: string;
  user_id?: string;
  is_owner?: boolean;
  enable_recording?: boolean;
};

type Participant = {
  user_id: string;
  user_name: string;
  joined_at: string;
  duration: number;
  session_id: string;
};

type RecordingInfo = {
  recording_id: string;
  room_name: string;
  start_ts: number;
  duration: number;
  status: string;
  download_link?: string;
  expires_at?: string;
};

type ScheduledMeeting = {
  id: string;
  roomName: string;
  roomUrl: string;
  scheduledTime: Date;
  duration: number;
  participants: {
    email: string;
    name: string;
    role: 'host' | 'participant';
  }[];
  caseId?: string;
  clientId?: string;
  attorneyId?: string;
  status: 'scheduled' | 'started' | 'completed' | 'cancelled';
};

export class DailyService {
  private config: DailyConfig;
  private baseUrl = 'https://api.daily.co/v1';

  constructor() {
    this.config = {
      apiKey: process.env.DAILY_API_KEY || '',
      domain: process.env.DAILY_DOMAIN || 'your-domain.daily.co',
    };
  }

  /**
   * Create a new video room
   */
  async createRoom(options: RoomConfig = {}): Promise<Room> {
    const roomName = options.name || this.generateRoomName();

    const roomConfig = {
      name: roomName,
      privacy: options.privacy || 'private',
      properties: {
        exp: options.expiresInMinutes
          ? Math.round(Date.now() / 1000) + options.expiresInMinutes * 60
          : Math.round(Date.now() / 1000) + 86400, // Default 24 hours
        max_participants: options.maxParticipants || 10,
        enable_knocking: options.enableKnocking ?? true,
        enable_screenshare: options.enableScreenShare ?? true,
        enable_recording: options.enableRecording ?? 'cloud',
        enable_chat: options.enableChat ?? true,
        enable_prejoin_ui: options.enableWaitingRoom ?? true,
        start_video_off: options.startVideoOff ?? false,
        start_audio_off: options.startAudioOff ?? false,
        lang: options.lang || 'en',
      },
    };

    // Mock API call - in production, make actual request to Daily.co API
    console.log('Creating Daily.co room:', JSON.stringify(roomConfig, null, 2));

    const room: Room = {
      id: 'room_' + Date.now(),
      name: roomName,
      url: `https://${this.config.domain}/${roomName}`,
      privacy: roomConfig.privacy,
      createdAt: new Date().toISOString(),
      config: options,
    };

    return room;
  }

  /**
   * Generate a unique room name
   */
  private generateRoomName(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `consultation-${timestamp}-${random}`;
  }

  /**
   * Get room details
   */
  async getRoom(roomName: string): Promise<Room | null> {
    console.log(`Getting room details for: ${roomName}`);

    // Mock implementation
    return {
      id: 'room_123',
      name: roomName,
      url: `https://${this.config.domain}/${roomName}`,
      privacy: 'private',
      createdAt: new Date().toISOString(),
      config: {},
    };
  }

  /**
   * Delete a room
   */
  async deleteRoom(roomName: string): Promise<void> {
    console.log(`Deleting room: ${roomName}`);
  }

  /**
   * Create a meeting token for a participant
   */
  async createMeetingToken(
    roomName: string,
    options: {
      userName?: string;
      userId?: string;
      isOwner?: boolean;
      expiresInMinutes?: number;
      enableRecording?: boolean;
    } = {}
  ): Promise<MeetingToken> {
    const exp = options.expiresInMinutes
      ? Math.round(Date.now() / 1000) + options.expiresInMinutes * 60
      : Math.round(Date.now() / 1000) + 3600; // Default 1 hour

    const tokenConfig = {
      properties: {
        room_name: roomName,
        user_name: options.userName,
        user_id: options.userId,
        is_owner: options.isOwner ?? false,
        enable_recording: options.enableRecording,
        exp,
      },
    };

    console.log('Creating meeting token:', JSON.stringify(tokenConfig, null, 2));

    return {
      token: 'token_' + Date.now() + '_' + Math.random().toString(36).substring(2),
      room_name: roomName,
      exp,
      user_name: options.userName,
      user_id: options.userId,
      is_owner: options.isOwner,
    };
  }

  /**
   * Get room URL with optional meeting token
   */
  async getRoomUrl(roomName: string, token?: string): Promise<string> {
    const baseUrl = `https://${this.config.domain}/${roomName}`;
    return token ? `${baseUrl}?t=${token}` : baseUrl;
  }

  /**
   * Get meeting recordings
   */
  async getRecordings(roomName?: string): Promise<RecordingInfo[]> {
    console.log(`Getting recordings${roomName ? ` for room: ${roomName}` : ''}`);

    // Mock implementation
    return [];
  }

  /**
   * Get recording download link
   */
  async getRecordingDownloadLink(recordingId: string): Promise<string> {
    console.log(`Getting download link for recording: ${recordingId}`);

    // This would return a signed URL valid for a limited time
    return `https://recordings.daily.co/${recordingId}/download?signed=true`;
  }

  /**
   * Delete a recording
   */
  async deleteRecording(recordingId: string): Promise<void> {
    console.log(`Deleting recording: ${recordingId}`);
  }

  /**
   * Get room participants (for active meetings)
   */
  async getParticipants(roomName: string): Promise<Participant[]> {
    console.log(`Getting participants for room: ${roomName}`);

    // Mock implementation
    return [];
  }

  /**
   * Schedule a meeting and create the room
   */
  async scheduleMeeting(
    meeting: {
      scheduledTime: Date;
      duration: number; // in minutes
      participants: {
        email: string;
        name: string;
        role: 'host' | 'participant';
      }[];
      caseId?: string;
      clientId?: string;
      attorneyId?: string;
    }
  ): Promise<ScheduledMeeting> {
    // Create a room that expires after the meeting
    const bufferMinutes = 30; // Allow joining 30 min early, stay 30 min after
    const expiresInMinutes =
      Math.round((meeting.scheduledTime.getTime() - Date.now()) / 60000) +
      meeting.duration +
      bufferMinutes * 2;

    const room = await this.createRoom({
      expiresInMinutes: Math.max(expiresInMinutes, 60), // At least 1 hour
      enableWaitingRoom: true,
      enableRecording: true,
      maxParticipants: meeting.participants.length + 2, // Buffer for technical issues
    });

    const scheduledMeeting: ScheduledMeeting = {
      id: 'meeting_' + Date.now(),
      roomName: room.name,
      roomUrl: room.url,
      scheduledTime: meeting.scheduledTime,
      duration: meeting.duration,
      participants: meeting.participants,
      caseId: meeting.caseId,
      clientId: meeting.clientId,
      attorneyId: meeting.attorneyId,
      status: 'scheduled',
    };

    console.log('Meeting scheduled:', scheduledMeeting);

    return scheduledMeeting;
  }

  /**
   * Generate join links for all participants
   */
  async generateParticipantLinks(
    meeting: ScheduledMeeting
  ): Promise<Map<string, string>> {
    const links = new Map<string, string>();

    for (const participant of meeting.participants) {
      const token = await this.createMeetingToken(meeting.roomName, {
        userName: participant.name,
        userId: participant.email,
        isOwner: participant.role === 'host',
        expiresInMinutes: meeting.duration + 60, // 1 hour buffer
        enableRecording: participant.role === 'host',
      });

      const url = await this.getRoomUrl(meeting.roomName, token.token);
      links.set(participant.email, url);
    }

    return links;
  }

  /**
   * Check room status
   */
  async isRoomActive(roomName: string): Promise<boolean> {
    const participants = await this.getParticipants(roomName);
    return participants.length > 0;
  }

  /**
   * End an active meeting
   */
  async endMeeting(roomName: string): Promise<void> {
    console.log(`Ending meeting in room: ${roomName}`);
    // In production, this would kick all participants and close the room
  }
}

// Export singleton instance
export const daily = new DailyService();

// React component helpers for embedding Daily.co
export const dailyHelpers = {
  /**
   * Generate props for Daily.co iframe
   */
  getIframeProps(roomUrl: string, token?: string) {
    const url = token ? `${roomUrl}?t=${token}` : roomUrl;
    return {
      src: url,
      allow: 'camera; microphone; fullscreen; display-capture; autoplay',
      style: {
        width: '100%',
        height: '100%',
        border: 'none',
        borderRadius: '8px',
      },
    };
  },

  /**
   * Generate script tag for Daily.co SDK
   */
  getSdkScript() {
    return 'https://unpkg.com/@daily-co/daily-js';
  },
};

export default daily;

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VideoRoom } from '@/components/video/VideoRoom';
import {
  Video,
  Clock,
  User,
  FileText,
  Calendar,
  ArrowLeft,
  Download,
} from 'lucide-react';

type ConsultationDetails = {
  id: string;
  roomUrl: string;
  token?: string;
  title: string;
  clientName: string;
  clientId: string;
  caseTitle?: string;
  caseId?: string;
  scheduledTime: string;
  duration: number;
  status: 'waiting' | 'active' | 'ended';
  notes?: string;
  documents?: { id: string; name: string }[];
};

// Mock consultation data
const mockConsultation: ConsultationDetails = {
  id: 'consult-123',
  roomUrl: 'https://demo.daily.co/consultation-room',
  title: 'Case Strategy Discussion',
  clientName: 'John Smith',
  clientId: 'c1',
  caseTitle: 'Smith v. ABC Corp',
  caseId: 'case-1',
  scheduledTime: new Date().toISOString(),
  duration: 60,
  status: 'waiting',
  notes: 'Discuss settlement offer and next steps',
  documents: [
    { id: '1', name: 'Settlement Offer Letter.pdf' },
    { id: '2', name: 'Case Summary.pdf' },
  ],
};

export default function ConsultationPage() {
  const router = useRouter();
  const params = useParams();
  const [consultation, setConsultation] = useState<ConsultationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Simulate fetching consultation details
    setTimeout(() => {
      setConsultation(mockConsultation);
      setIsLoading(false);
    }, 1000);
  }, [params.roomId]);

  const handleJoin = () => {
    setHasJoined(true);
    setConsultation((prev) => prev ? { ...prev, status: 'active' } : prev);
  };

  const handleLeave = () => {
    setHasJoined(false);
    setConsultation((prev) => prev ? { ...prev, status: 'ended' } : prev);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-law-navy mx-auto mb-4" />
          <p className="text-gray-500">Loading consultation...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Consultation Not Found</h2>
          <p className="text-gray-500 mb-4">This consultation may have ended or doesn't exist.</p>
          <Button variant="navy" onClick={() => router.push('/calendar')}>
            Back to Calendar
          </Button>
        </div>
      </div>
    );
  }

  // Pre-join screen
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push('/calendar')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calendar
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Preview */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-law-navy text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                      RA
                    </div>
                    <p className="text-white">Camera preview</p>
                  </div>
                </div>

                <div className="flex justify-center gap-4 mb-4">
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Camera
                  </Button>
                  <Button variant="outline" size="sm">
                    Microphone
                  </Button>
                  <Button variant="outline" size="sm">
                    Settings
                  </Button>
                </div>

                <Button variant="navy" className="w-full" size="lg" onClick={handleJoin}>
                  <Video className="h-5 w-5 mr-2" />
                  Join Consultation
                </Button>
              </CardContent>
            </Card>

            {/* Consultation Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{consultation.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{consultation.clientName}</p>
                      <p className="text-sm text-gray-500">Client</p>
                    </div>
                  </div>

                  {consultation.caseTitle && (
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{consultation.caseTitle}</p>
                        <p className="text-sm text-gray-500">Related Case</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">
                        {new Date(consultation.scheduledTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(consultation.scheduledTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{consultation.duration} minutes</p>
                      <p className="text-sm text-gray-500">Duration</p>
                    </div>
                  </div>

                  {consultation.notes && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium mb-1">Notes</p>
                      <p className="text-sm text-gray-600">{consultation.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents */}
              {consultation.documents && consultation.documents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Related Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {consultation.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{doc.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active consultation view
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold">{consultation.title}</h1>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">{consultation.clientName}</span>
          {isRecording && (
            <span className="flex items-center gap-2 px-2 py-1 bg-red-600 rounded-full text-white text-xs">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Recording
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <Clock className="h-4 w-4" />
          <span>{consultation.duration} min scheduled</span>
        </div>
      </div>

      {/* Video Room */}
      <div className="flex-1 p-4">
        <VideoRoom
          roomUrl={consultation.roomUrl}
          token={consultation.token}
          userName="Robert Anderson"
          isHost={true}
          onLeave={handleLeave}
          onRecordingStart={() => setIsRecording(true)}
          onRecordingStop={() => setIsRecording(false)}
        />
      </div>
    </div>
  );
}

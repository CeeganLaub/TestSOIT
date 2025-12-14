'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  MapPin,
  User,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

type Appointment = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'phone' | 'in-person';
  attorney: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  location?: string;
  meetingLink?: string;
};

// Mock appointments
const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Case Strategy Discussion',
    date: '2024-01-25',
    time: '2:00 PM',
    duration: '1 hour',
    type: 'video',
    attorney: 'Robert Anderson',
    status: 'confirmed',
    notes: 'Discuss settlement offer and next steps',
    meetingLink: 'https://daily.co/demo-room',
  },
  {
    id: '2',
    title: 'Document Review',
    date: '2024-02-01',
    time: '10:00 AM',
    duration: '30 minutes',
    type: 'phone',
    attorney: 'Robert Anderson',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Initial Consultation',
    date: '2023-08-15',
    time: '3:00 PM',
    duration: '1 hour',
    type: 'in-person',
    attorney: 'Robert Anderson',
    status: 'completed',
    location: '123 Legal Ave, Suite 500',
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  video: <Video className="h-5 w-5 text-purple-600" />,
  phone: <Phone className="h-5 w-5 text-blue-600" />,
  'in-person': <MapPin className="h-5 w-5 text-green-600" />,
};

const typeLabels: Record<string, string> = {
  video: 'Video Call',
  phone: 'Phone Call',
  'in-person': 'In-Person',
};

export default function ClientAppointmentsPage() {
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'video' | 'phone' | 'in-person'>('video');

  const upcomingAppointments = mockAppointments.filter(
    (apt) => apt.status !== 'completed' && apt.status !== 'cancelled'
  );
  const pastAppointments = mockAppointments.filter(
    (apt) => apt.status === 'completed'
  );

  const availableSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-500">Schedule and manage your appointments</p>
        </div>
        <Button variant="navy" size="sm" onClick={() => setShowSchedule(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
      </div>

      {/* Next Appointment Card */}
      {upcomingAppointments.length > 0 && (
        <Card className="mb-6 bg-law-navy text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Your Next Appointment</span>
            </div>
            <h3 className="text-xl font-bold mb-2">{upcomingAppointments[0].title}</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(upcomingAppointments[0].date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {upcomingAppointments[0].time} ({upcomingAppointments[0].duration})
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {upcomingAppointments[0].attorney}
              </span>
            </div>
            {upcomingAppointments[0].type === 'video' && (
              <Button variant="gold" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Join Video Call
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt) => (
              <Card key={apt.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">{typeIcons[apt.type]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{apt.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            apt.status
                          )}`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(apt.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {apt.time}
                        </span>
                        <span>{typeLabels[apt.type]}</span>
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {apt.attorney}
                        </span>
                      </div>
                      {apt.notes && <p className="text-sm text-gray-600">{apt.notes}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      {apt.type === 'video' && apt.status !== 'cancelled' && (
                        <Button variant="navy" size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-1">No upcoming appointments</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Schedule a meeting with your attorney
                </p>
                <Button variant="navy" size="sm" onClick={() => setShowSchedule(true)}>
                  Schedule Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Past Appointments */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Past Appointments</h2>
        <div className="space-y-4">
          {pastAppointments.map((apt) => (
            <Card key={apt.id} className="opacity-75">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">{typeIcons[apt.type]}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{apt.title}</h3>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span>{new Date(apt.date).toLocaleDateString()}</span>
                      <span>{apt.time}</span>
                      <span>{apt.attorney}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {showSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Schedule Appointment</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowSchedule(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appointment Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Appointment Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['video', 'phone', 'in-person'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        selectedType === type
                          ? 'border-law-navy bg-law-navy/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-center mb-2">{typeIcons[type]}</div>
                      <span className="text-sm font-medium">{typeLabels[type]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i + 1);
                    const dateStr = date.toISOString().split('T')[0];
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    return (
                      <button
                        key={dateStr}
                        disabled={isWeekend}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-2 rounded-lg text-center transition-colors ${
                          selectedDate === dateStr
                            ? 'bg-law-navy text-white'
                            : isWeekend
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-xs">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="font-semibold">{date.getDate()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Times</label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-center transition-colors ${
                          selectedTime === time
                            ? 'bg-law-navy text-white'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for Appointment</label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select a reason...</option>
                  <option value="case_update">Case Update</option>
                  <option value="document_review">Document Review</option>
                  <option value="settlement_discussion">Settlement Discussion</option>
                  <option value="general_questions">General Questions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes (optional)</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg min-h-[80px]"
                  placeholder="Any specific topics you&apos;d like to discuss..."
                />
              </div>

              {/* Info */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Appointments are typically confirmed within 24 hours. You&apos;ll receive an email
                  confirmation with joining instructions.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowSchedule(false)}>
                  Cancel
                </Button>
                <Button
                  variant="navy"
                  disabled={!selectedDate || !selectedTime}
                >
                  Request Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

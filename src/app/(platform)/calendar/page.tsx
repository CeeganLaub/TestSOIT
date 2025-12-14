'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Video,
  MapPin,
  Phone,
  User,
  Filter,
  X,
} from 'lucide-react';

type Appointment = {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  type: 'consultation' | 'court' | 'meeting' | 'call' | 'video' | 'deposition';
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
  caseTitle?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
};

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Initial Consultation',
    clientName: 'John Smith',
    clientId: 'c1',
    type: 'video',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    caseTitle: 'Smith v. ABC Corp',
    status: 'confirmed',
    notes: 'Discuss case strategy',
  },
  {
    id: '2',
    title: 'Court Hearing',
    clientName: 'Sarah Johnson',
    clientId: 'c2',
    type: 'court',
    date: new Date(),
    startTime: '14:00',
    endTime: '16:00',
    location: 'District Court, Room 302',
    caseTitle: 'Johnson Divorce',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Document Review',
    clientName: 'Michael Brown',
    clientId: 'c3',
    type: 'meeting',
    date: new Date(Date.now() + 86400000),
    startTime: '10:00',
    endTime: '11:30',
    caseTitle: 'Brown Estate Planning',
    status: 'scheduled',
  },
  {
    id: '4',
    title: 'Deposition',
    clientName: 'Emily Davis',
    clientId: 'c4',
    type: 'deposition',
    date: new Date(Date.now() + 86400000 * 2),
    startTime: '13:00',
    endTime: '17:00',
    location: 'Conference Room A',
    caseTitle: 'Davis Personal Injury',
    status: 'confirmed',
  },
  {
    id: '5',
    title: 'Phone Follow-up',
    clientName: 'John Smith',
    clientId: 'c1',
    type: 'call',
    date: new Date(Date.now() + 86400000 * 3),
    startTime: '11:00',
    endTime: '11:30',
    status: 'scheduled',
  },
];

const typeColors: Record<string, string> = {
  consultation: 'bg-blue-100 text-blue-700 border-blue-300',
  court: 'bg-red-100 text-red-700 border-red-300',
  meeting: 'bg-green-100 text-green-700 border-green-300',
  call: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  video: 'bg-purple-100 text-purple-700 border-purple-300',
  deposition: 'bg-orange-100 text-orange-700 border-orange-300',
};

const typeIcons: Record<string, React.ReactNode> = {
  consultation: <User className="h-3 w-3" />,
  court: <MapPin className="h-3 w-3" />,
  meeting: <User className="h-3 w-3" />,
  call: <Phone className="h-3 w-3" />,
  video: <Video className="h-3 w-3" />,
  deposition: <User className="h-3 w-3" />,
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add days from previous month to start on Sunday
    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  const getAppointmentsForDate = (date: Date) => {
    return mockAppointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return (
        aptDate.toDateString() === date.toDateString() &&
        (!filterType || apt.type === filterType)
      );
    });
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-500">Manage appointments and schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <Button variant="navy" size="sm" onClick={() => setShowNewAppointment(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Filters and Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (view === 'month' ? navigateMonth(-1) : navigateWeek(-1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold min-w-[200px] text-center">
            {formatMonthYear(currentDate)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (view === 'month' ? navigateMonth(1) : navigateWeek(1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex rounded-lg border overflow-hidden">
            {(['month', 'week', 'day'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm capitalize ${
                  view === v
                    ? 'bg-law-navy text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {filterType ? filterType : 'All Types'}
            </Button>
          </div>
        </div>
      </div>

      {/* Week View */}
      {view === 'week' && (
        <Card>
          <CardContent className="p-0">
            {/* Week Header */}
            <div className="grid grid-cols-8 border-b">
              <div className="p-3 text-center text-sm text-gray-500 border-r">Time</div>
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`p-3 text-center border-r last:border-r-0 ${
                    isToday(day) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="text-xs text-gray-500">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      isToday(day) ? 'text-law-navy' : ''
                    }`}
                  >
                    {day.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="max-h-[600px] overflow-y-auto">
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                  <div className="p-2 text-xs text-gray-500 border-r text-center">
                    {hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}
                  </div>
                  {weekDays.map((day) => {
                    const dayAppointments = getAppointmentsForDate(day).filter((apt) => {
                      const startHour = parseInt(apt.startTime.split(':')[0]);
                      return startHour === hour;
                    });

                    return (
                      <div
                        key={day.toISOString()}
                        className={`p-1 border-r last:border-r-0 min-h-[60px] ${
                          isToday(day) ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        {dayAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`p-1.5 rounded text-xs mb-1 border ${
                              typeColors[apt.type]
                            }`}
                          >
                            <div className="flex items-center gap-1 font-medium">
                              {typeIcons[apt.type]}
                              <span className="truncate">{apt.title}</span>
                            </div>
                            <div className="text-xs opacity-75 truncate">
                              {apt.clientName}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Month View */}
      {view === 'month' && (
        <Card>
          <CardContent className="p-0">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-medium text-gray-500 border-r last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {daysInMonth.map((day, index) => {
                const appointments = getAppointmentsForDate(day);
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedDate(day);
                      setView('day');
                    }}
                    className={`min-h-[100px] p-2 border-r border-b last:border-r-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !isCurrentMonth(day) ? 'bg-gray-50 text-gray-400' : ''
                    } ${isToday(day) ? 'bg-blue-50' : ''}`}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isToday(day)
                          ? 'bg-law-navy text-white w-6 h-6 rounded-full flex items-center justify-center'
                          : ''
                      }`}
                    >
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {appointments.slice(0, 2).map((apt) => (
                        <div
                          key={apt.id}
                          className={`text-xs px-1.5 py-0.5 rounded truncate border ${
                            typeColors[apt.type]
                          }`}
                        >
                          {apt.startTime} {apt.title}
                        </div>
                      ))}
                      {appointments.length > 2 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{appointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Day View */}
      {view === 'day' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Day Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {(selectedDate || currentDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {isToday(selectedDate || currentDate) && (
                  <span className="text-sm bg-law-navy text-white px-2 py-1 rounded">
                    Today
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {hours.map((hour) => {
                  const appointments = getAppointmentsForDate(
                    selectedDate || currentDate
                  ).filter((apt) => {
                    const startHour = parseInt(apt.startTime.split(':')[0]);
                    return startHour === hour;
                  });

                  return (
                    <div key={hour} className="flex gap-4">
                      <div className="w-16 text-sm text-gray-500 pt-2">
                        {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                      </div>
                      <div className="flex-1 min-h-[60px] border-l pl-4">
                        {appointments.map((apt) => (
                          <div
                            key={apt.id}
                            className={`p-3 rounded-lg mb-2 border ${typeColors[apt.type]}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2 font-medium">
                                {typeIcons[apt.type]}
                                {apt.title}
                              </div>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  apt.status === 'confirmed'
                                    ? 'bg-green-100 text-green-700'
                                    : apt.status === 'cancelled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>
                            <div className="text-sm">{apt.clientName}</div>
                            {apt.caseTitle && (
                              <div className="text-xs opacity-75">{apt.caseTitle}</div>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {apt.startTime} - {apt.endTime}
                              </span>
                              {apt.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {apt.location}
                                </span>
                              )}
                            </div>
                            {apt.type === 'video' && (
                              <Button variant="outline" size="sm" className="mt-2">
                                <Video className="h-3 w-3 mr-1" />
                                Join Video Call
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAppointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 rounded-lg border hover:shadow-sm transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`p-1 rounded ${typeColors[apt.type].split(' ')[0]}`}
                      >
                        {typeIcons[apt.type]}
                      </span>
                      <span className="font-medium text-sm truncate">{apt.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(apt.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      at {apt.startTime}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{apt.clientName}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>New Appointment</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewAppointment(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Appointment title" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Client</label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option value="">Select a client...</option>
                  <option value="c1">John Smith</option>
                  <option value="c2">Sarah Johnson</option>
                  <option value="c3">Michael Brown</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.keys(typeColors).map((type) => (
                    <button
                      key={type}
                      className={`px-3 py-2 rounded-lg border text-sm capitalize ${typeColors[type]}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input type="time" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <select className="w-full px-4 py-2 border rounded-lg">
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location / Notes</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg min-h-[80px]"
                  placeholder="Add location or notes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewAppointment(false)}>
                  Cancel
                </Button>
                <Button variant="navy">Create Appointment</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Send,
  Paperclip,
  Check,
  CheckCheck,
  User,
  Clock,
} from 'lucide-react';

type Message = {
  id: string;
  content: string;
  isFromClient: boolean;
  createdAt: string;
  isRead: boolean;
  senderName: string;
};

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hi, I wanted to check on the status of my case.',
    isFromClient: true,
    createdAt: '2024-01-18T10:00:00Z',
    isRead: true,
    senderName: 'John Smith',
  },
  {
    id: '2',
    content: 'Hello John, thank you for reaching out. I reviewed your case this morning and have some updates for you.',
    isFromClient: false,
    createdAt: '2024-01-18T10:15:00Z',
    isRead: true,
    senderName: 'Robert Anderson',
  },
  {
    id: '3',
    content: 'We received a settlement offer from the opposing counsel. I would like to schedule a call to discuss your options. The offer is $50,000, which is lower than we expected, but we have room to negotiate.',
    isFromClient: false,
    createdAt: '2024-01-18T10:16:00Z',
    isRead: true,
    senderName: 'Robert Anderson',
  },
  {
    id: '4',
    content: 'That sounds great. What times work for you this week?',
    isFromClient: true,
    createdAt: '2024-01-18T10:25:00Z',
    isRead: true,
    senderName: 'John Smith',
  },
  {
    id: '5',
    content: "I'm available Thursday at 2 PM or Friday morning. Would either of those work for you? We can do a video call through the client portal.",
    isFromClient: false,
    createdAt: '2024-01-18T10:30:00Z',
    isRead: true,
    senderName: 'Robert Anderson',
  },
  {
    id: '6',
    content: 'Thursday at 2 PM works perfectly for me. I\'ll make sure to be available.',
    isFromClient: true,
    createdAt: '2024-01-18T10:35:00Z',
    isRead: false,
    senderName: 'John Smith',
  },
];

export default function ClientMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isFromClient: true,
      createdAt: new Date().toISOString(),
      isRead: false,
      senderName: 'John Smith',
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-law-navy text-white flex items-center justify-center font-bold">
            RA
          </div>
          <div>
            <h1 className="font-semibold text-lg">Robert Anderson</h1>
            <p className="text-sm text-gray-500">Your Lead Attorney</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {/* Date Separator */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex-1 h-px bg-gray-200" />
          <span>Today</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isFromClient ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-end gap-2 max-w-[80%]">
              {!message.isFromClient && (
                <div className="h-8 w-8 rounded-full bg-law-navy text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  RA
                </div>
              )}
              <div
                className={`rounded-lg p-3 ${
                  message.isFromClient
                    ? 'bg-law-navy text-white'
                    : 'bg-white dark:bg-gray-800 border'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div
                  className={`flex items-center gap-1 mt-1 text-xs ${
                    message.isFromClient ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  <span>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {message.isFromClient && (
                    message.isRead ? (
                      <CheckCheck className="h-3 w-3" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Response Time Notice */}
      <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Clock className="h-4 w-4" />
          <span>Typical response time: within 24 hours during business days</span>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button variant="navy" size="sm" onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          For urgent matters, please call the office directly at (555) 123-4567
        </p>
      </div>
    </div>
  );
}

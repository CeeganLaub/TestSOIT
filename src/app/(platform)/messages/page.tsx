'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Brain,
  User,
} from 'lucide-react';

type Message = {
  id: string;
  content: string;
  isFromClient: boolean;
  createdAt: string;
  isRead: boolean;
  sentiment?: string;
};

type Conversation = {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  caseTitle?: string;
};

// Mock data
const mockConversations: Conversation[] = [
  {
    id: '1',
    clientId: 'c1',
    clientName: 'John Smith',
    lastMessage: 'Thank you for the update on my case.',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    caseTitle: 'Smith v. ABC Corp',
  },
  {
    id: '2',
    clientId: 'c2',
    clientName: 'Sarah Johnson',
    lastMessage: 'When is my next court date?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    caseTitle: 'Johnson Divorce',
  },
  {
    id: '3',
    clientId: 'c3',
    clientName: 'Michael Brown',
    lastMessage: "I've uploaded the documents you requested.",
    lastMessageTime: 'Monday',
    unreadCount: 1,
    caseTitle: 'Brown Estate Planning',
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hi, I wanted to check on the status of my case.',
    isFromClient: true,
    createdAt: '2024-01-15T10:00:00Z',
    isRead: true,
  },
  {
    id: '2',
    content: 'Hello John, thank you for reaching out. I reviewed your case this morning and have some updates for you.',
    isFromClient: false,
    createdAt: '2024-01-15T10:15:00Z',
    isRead: true,
  },
  {
    id: '3',
    content: 'The opposing counsel has responded to our motion. We should schedule a call to discuss the next steps.',
    isFromClient: false,
    createdAt: '2024-01-15T10:16:00Z',
    isRead: true,
  },
  {
    id: '4',
    content: 'That sounds great. What times work for you this week?',
    isFromClient: true,
    createdAt: '2024-01-15T10:25:00Z',
    isRead: true,
  },
  {
    id: '5',
    content: 'Thank you for the update on my case.',
    isFromClient: true,
    createdAt: '2024-01-15T10:30:00Z',
    isRead: false,
    sentiment: 'positive',
  },
];

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0]
  );
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
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
      isFromClient: false,
      createdAt: new Date().toISOString(),
      isRead: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage('');
    setShowAiSuggestion(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const aiSuggestedResponse = "I'm available Thursday at 2 PM or Friday morning. Would either of those work for you? We can do a video call through the client portal.";

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r bg-white dark:bg-gray-800 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                selectedConversation?.id === conversation.id
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : ''
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-law-navy text-white flex items-center justify-center font-semibold flex-shrink-0">
                {conversation.clientName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate">{conversation.clientName}</span>
                  <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                </div>
                {conversation.caseTitle && (
                  <p className="text-xs text-gray-500 truncate">{conversation.caseTitle}</p>
                )}
                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unreadCount > 0 && (
                <span className="bg-law-gold text-white text-xs px-2 py-0.5 rounded-full">
                  {conversation.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-white dark:bg-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-law-navy text-white flex items-center justify-center font-semibold">
                {selectedConversation.clientName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h2 className="font-semibold">{selectedConversation.clientName}</h2>
                {selectedConversation.caseTitle && (
                  <p className="text-sm text-gray-500">{selectedConversation.caseTitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromClient ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.isFromClient
                      ? 'bg-white dark:bg-gray-800 border'
                      : 'bg-law-navy text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs ${
                      message.isFromClient ? 'text-gray-400' : 'text-blue-200'
                    }`}
                  >
                    <span>
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {!message.isFromClient && (
                      message.isRead ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )
                    )}
                    {message.sentiment && (
                      <span
                        className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
                          message.sentiment === 'positive'
                            ? 'bg-green-100 text-green-700'
                            : message.sentiment === 'negative'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {message.sentiment}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Suggestion */}
          {showAiSuggestion && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-800 mb-1">AI Suggested Response:</p>
                  <p className="text-sm text-blue-700">{aiSuggestedResponse}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      setNewMessage(aiSuggestedResponse);
                      setShowAiSuggestion(false);
                    }}
                  >
                    Use
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
                    onClick={() => setShowAiSuggestion(false)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button variant="navy" size="sm" onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}

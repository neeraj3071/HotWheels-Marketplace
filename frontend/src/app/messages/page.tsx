'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageCircle, Send } from 'lucide-react';
import { api } from '@/lib/api';
import { MessageThread, Message } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

function MessagesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessageCountRef = useRef<number>(0);

  // Play notification sound using Web Audio API
  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure the sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Frequency in Hz
      oscillator.type = 'sine'; // Sine wave for a pleasant tone
      
      // Fade in and out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      // Play the sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Notification sound error:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchThreads();
  }, [user]);

  useEffect(() => {
    const sellerId = searchParams.get('sellerId');
    if (sellerId && user) {
      createOrOpenThread(sellerId);
    }
  }, [searchParams, user]);

  // Auto-refresh messages every 5 seconds when a thread is selected
  useEffect(() => {
    if (!selectedThread) return;
    
    const interval = setInterval(() => {
      fetchMessages(selectedThread.id, true); // Pass true to indicate this is a polling request
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedThread, messages]);

  const fetchThreads = async () => {
    try {
      const response = await api.get<MessageThread[]>('/messages/threads');
      const allThreads = Array.isArray(response.data) ? response.data : [];
      
      // Deduplicate threads by participants (keep most recent for each unique pair)
      const threadMap = new Map<string, MessageThread>();
      
      allThreads.forEach((thread) => {
        const otherUser = thread.participants?.find((p) => p.id !== user?.id);
        if (otherUser) {
          const key = otherUser.id; // Use other user's ID as key
          const existing = threadMap.get(key);
          
          // Keep the thread with the most recent message or most recent update
          if (!existing || 
              (thread.lastMessage && (!existing.lastMessage || 
                new Date(thread.lastMessage.createdAt) > new Date(existing.lastMessage.createdAt)))) {
            threadMap.set(key, thread);
          }
        }
      });
      
      // Convert map back to array and sort by most recent
      const uniqueThreads = Array.from(threadMap.values()).sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.updatedAt;
        const bTime = b.lastMessage?.createdAt || b.updatedAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
      
      setThreads(uniqueThreads);
    } catch (error) {
      console.error('Failed to fetch threads:', error);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrOpenThread = async (otherUserId: string) => {
    // Prevent user from messaging themselves
    if (user && user.id === otherUserId) {
      alert('You cannot start a conversation with yourself.');
      return;
    }

    try {
      const response = await api.post<MessageThread>('/messages/threads', {
        participantId: otherUserId,
      });
      setSelectedThread(response.data);
      fetchMessages(response.data.id);
      if (!threads.find((t) => t.id === response.data.id)) {
        setThreads([response.data, ...threads]);
      }
    } catch (error: any) {
      console.error('Failed to create/open thread:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  const fetchMessages = async (threadId: string, isPolling: boolean = false) => {
    try {
      const response = await api.get<Message[]>(`/messages/threads/${threadId}/messages`);
      const newMessages = Array.isArray(response.data) ? response.data : [];
      
      // Check if there are new messages from other users (not sent by current user)
      if (isPolling && messages.length > 0 && newMessages.length > messages.length) {
        const latestMessage = newMessages[newMessages.length - 1];
        // Only play sound if the new message is from someone else
        if (latestMessage.senderId !== user?.id) {
          playNotificationSound();
        }
      }
      
      setMessages(newMessages);
      previousMessageCountRef.current = newMessages.length;
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!selectedThread || !newMessage.trim()) return;

    // Validate message length (backend requires 1-2000 characters)
    if (newMessage.trim().length < 1 || newMessage.trim().length > 2000) {
      alert('Message must be between 1 and 2000 characters');
      return;
    }

    setSendingMessage(true);
    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    try {
      const response = await api.post<Message>(`/messages/threads/${selectedThread.id}/messages`, {
        body: messageText,
      });
      setMessages([...messages, response.data]);
      
      // Update thread list
      setThreads((prev) =>
        prev.map((t) =>
          t.id === selectedThread.id ? { ...t, lastMessage: response.data, updatedAt: new Date().toISOString() } : t
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(messageText); // Restore message on error
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const selectThread = (thread: MessageThread) => {
    setSelectedThread(thread);
    previousMessageCountRef.current = 0; // Reset counter when switching threads
    fetchMessages(thread.id, false); // Initial fetch, don't check for notifications
  };

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-50">
      <div className="container mx-auto px-4 h-full">
        <div className="grid grid-cols-12 gap-4 h-full py-4">
          {/* Threads List */}
          <Card className="col-span-12 md:col-span-4 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Messages
              </h2>
            </div>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {loading ? (
                <div className="p-4">Loading...</div>
              ) : threads.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Start a conversation with a seller!</p>
                </div>
              ) : (
                <div>
                  {threads.map((thread) => {
                    const otherUser = thread.participants?.find((p) => p.id !== user.id);
                    return (
                      <button
                        key={thread.id}
                        onClick={() => selectThread(thread)}
                        className={`w-full p-4 border-b hover:bg-gray-50 text-left transition-colors ${
                          selectedThread?.id === thread.id ? 'bg-orange-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={otherUser?.avatarUrl} />
                            <AvatarFallback>
                              {otherUser?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {otherUser?.displayName || otherUser?.username}
                            </p>
                            {thread.lastMessage && (
                              <p className="text-sm text-gray-500 truncate">
                                {thread.lastMessage.body}
                              </p>
                            )}
                          </div>
                          {thread.lastMessage && (
                            <span className="text-xs text-gray-400">
                              {formatDate(thread.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages View */}
          <Card className="col-span-12 md:col-span-8 overflow-hidden flex flex-col">
            {selectedThread ? (
              <>
                {/* Header */}
                <div className="p-4 border-b">
                  {selectedThread.listing && (
                    <p className="text-sm text-gray-500">
                      About: {selectedThread.listing.title}
                    </p>
                  )}
                </div>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {Array.isArray(messages) && messages.map((message) => {
                    const isOwn = message.senderId === user.id;
                    return (
                      <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isOwn ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.body}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-orange-100' : 'text-gray-500'}`}>
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      disabled={sendingMessage}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim() || sendingMessage}>
                      {sendingMessage ? '...' : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    }>
      <MessagesPageContent />
    </Suspense>
  );
}

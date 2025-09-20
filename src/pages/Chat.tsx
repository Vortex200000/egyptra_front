import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { API_URL } from "@/config/api";
import {
  MessageCircle,
  Send,
  User,
  Shield,
  Phone,
  Mail,
  Trash2,
  ArrowLeft,
  Users,
  Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

// WebSocket URL
const getWebSocketURL = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = API_URL.replace('http://', '').replace('https://', '');
  return `${API_URL}/ws/chat/`;
};

interface Message {
  id: string | number;
  conversation: number;
  message: string;
  sender: number;
  sender_name: string;
  sender_username: string;
  sender_email: string;
  is_from_admin: boolean;
  is_read: boolean;
  created_at: string;
}

interface Conversation {
  id: number;
  user: number;
  user_name: string;
  user_username: string;
  user_email: string;
  user_avatar: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  is_active: boolean;
  created_at: string;
}

const Chat = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State management
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  const role = localStorage.getItem("role");
  const isAdmin =  role === "admin";

  // Check authentication
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthChecked(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Initialize WebSocket and load data
  useEffect(() => {
    if (!authChecked || !user) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    // Load data based on user type
    if (isAdmin) {
      loadConversations();
    } else {
      loadMyMessages();
    }

    // Setup WebSocket
    const wsUrl = getWebSocketURL();
    wsRef.current = new WebSocket(`${wsUrl}?token=${token}`);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message" && data.data) {
          handleNewMessage(data.data, data.conversation_id, data.is_new_user_message);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user, authChecked, isAdmin]);

  const handleNewMessage = (messageData: Message, conversationId: number, isNewUserMessage?: boolean) => {
    // Always update messages if viewing this conversation
    if (selectedConversation === conversationId || (!isAdmin && !selectedConversation)) {
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === messageData.id);
        if (exists) return prev;
        return [...prev, messageData];
      });
      scrollToBottom();
    }

    // Update conversations list for admin
    if (isAdmin) {
      setConversations((prev) => {
        const updatedConversations = prev.map((conv) => 
          conv.id === conversationId
            ? {
                ...conv,
                last_message: messageData.message,
                last_message_at: messageData.created_at,
                unread_count: isNewUserMessage && selectedConversation !== conversationId ? conv.unread_count + 1 : conv.unread_count,
              }
            : conv
        );
        
        // Sort conversations by last message time
        return updatedConversations.sort((a, b) => 
          new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
        );
      });
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_URL}/api/chat/conversations/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMyMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_URL}/api/chat/my-messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (conversationId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_URL}/api/chat/conversation/${conversationId}/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
        setSelectedConversation(conversationId);
        
        // Mark as read
        markConversationAsRead(conversationId);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to load conversation messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markConversationAsRead = async (conversationId: number) => {
    try {
      const token = localStorage.getItem("access");
      await fetch(`${API_URL}/api/chat/mark-read/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversation_id: conversationId }),
      });

      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || sending) return;
    setSending(true);

    try {
      const messageData: any = { message: message.trim() };
      
      if (isAdmin && selectedConversation) {
        const conversation = conversations.find(c => c.id === selectedConversation);
        if (conversation) {
          messageData.user_id = conversation.user;
        }
      }

      if (wsRef.current && connected) {
        wsRef.current.send(JSON.stringify(messageData));
      } else {
        // HTTP fallback
        const token = localStorage.getItem("access");
        const response = await fetch(`${API_URL}/api/chat/send/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setMessages((prev) => [...prev, data.data]);
            scrollToBottom();
          }
        }
      }

      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages = React.useMemo(() => {
    return messages.reduce((groups: Record<string, Message[]>, message) => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  }, [messages]);

  // Loading state
  if (!authChecked || (authChecked && user && loading && messages.length === 0)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading chat...</p>
        </div>
      </div>
    );
  }

  // Auth required state
  if (authChecked && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access the chat
            </p>
            <Button onClick={() => (window.location.href = "/auth")}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Interface
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <section className="bg-gradient-sky py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  <MessageCircle className="inline-block h-8 w-8 mr-3 text-primary" />
                  Admin Chat Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage customer conversations
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`}></div>
                <span className="text-foreground text-sm">
                  {connected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Conversations List */}
              <div className="lg:col-span-4">
                <Card className="h-[calc(100vh-200px)] flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Conversations ({conversations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 min-h-0">
                    {conversations.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground h-full flex items-center justify-center">
                        <div>
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No conversations yet</p>
                        </div>
                      </div>
                    ) : (
                      <ScrollArea className="h-full">
                        <div className="divide-y">
                          {conversations.map((conv) => (
                            <div
                              key={conv.id}
                              className={`p-4 cursor-pointer hover:bg-muted transition-colors ${
                                selectedConversation === conv.id ? "bg-muted border-r-2 border-primary" : ""
                              }`}
                              onClick={() => loadConversationMessages(conv.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                  {conv.user_avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium truncate">
                                      {conv.user_name || conv.user_username}
                                    </h4>
                                    {conv.unread_count > 0 && (
                                      <Badge variant="destructive" className="text-xs flex-shrink-0">
                                        {conv.unread_count}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {conv.last_message || "No messages"}
                                  </p>
                                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTime(conv.last_message_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-8">
                {selectedConversation ? (
                  <Card className="h-[calc(100vh-200px)] flex flex-col">
                    <CardHeader className="flex-shrink-0 border-b">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedConversation(null);
                            setMessages([]);
                          }}
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                            {conversations.find(c => c.id === selectedConversation)?.user_avatar}
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {conversations.find(c => c.id === selectedConversation)?.user_name ||
                               conversations.find(c => c.id === selectedConversation)?.user_username}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {conversations.find(c => c.id === selectedConversation)?.user_email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <div className="flex-1 min-h-0 flex flex-col">
                      <ScrollArea className="flex-1 px-6 py-4">
                        <div className="space-y-6">
                          {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                            <div key={date}>
                              <div className="flex justify-center my-6">
                                <Badge variant="outline" className="bg-background">
                                  {formatDate(dayMessages[0].created_at)}
                                </Badge>
                              </div>
                              <div className="space-y-4">
                                {dayMessages.map((msg) => {
                                  const isMyMessage = msg.sender === user.id;
                                  const isFromAdmin = msg.is_from_admin;

                                  return (
                                    <div
                                      key={msg.id}
                                      className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                                    >
                                      <div
                                        className={`max-w-[70%] p-4 rounded-lg ${
                                          isMyMessage
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted border"
                                        }`}
                                      >
                                        <div className="flex items-start space-x-3">
                                          <div className="flex-shrink-0">
                                            {isFromAdmin ? (
                                              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                                <Shield className="h-4 w-4 text-white" />
                                              </div>
                                            ) : (
                                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <User className="h-4 w-4 text-white" />
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                              <p className="text-xs font-medium">
                                                {msg.sender_name || msg.sender_username}
                                                {isFromAdmin && (
                                                  <Badge variant="destructive" className="ml-2 text-xs">
                                                    Admin
                                                  </Badge>
                                                )}
                                              </p>
                                              <span className="text-xs opacity-70">
                                                {formatTime(msg.created_at)}
                                              </span>
                                            </div>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                              {msg.message}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      <div className="border-t bg-background p-4 flex-shrink-0">
                        <div className="flex space-x-3">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Reply to customer..."
                            disabled={sending}
                            className="flex-1"
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!message.trim() || sending}
                            className="flex-shrink-0"
                          >
                            {sending ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="h-[calc(100vh-200px)] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
                      <p>Choose a conversation from the left to start chatting</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // User Interface (Simple Chat)
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-sky py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                <MessageCircle className="inline-block h-8 w-8 mr-3 text-primary" />
                Customer Support
              </h1>
              <p className="text-muted-foreground">
                Get help with your bookings and questions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`}></div>
              <span className="text-foreground text-sm">
                {connected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Chat Interface */}
            <div className="lg:col-span-3">
              <Card className="h-[calc(100vh-200px)] shadow-glow flex flex-col">
                <CardHeader className="bg-gradient-ocean text-white flex-shrink-0">
                  <CardTitle className="flex items-center text-primary-foreground">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat with Support
                  </CardTitle>
                </CardHeader>

                <div className="flex-1 min-h-0 flex flex-col">
                  <ScrollArea className="flex-1 px-6 py-4">
                    <div className="space-y-6">
                      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                        <div key={date}>
                          <div className="flex justify-center my-6">
                            <Badge variant="outline" className="bg-background">
                              {formatDate(dayMessages[0].created_at)}
                            </Badge>
                          </div>
                          <div className="space-y-4">
                            {dayMessages.map((msg) => {
                              const isMyMessage = msg.sender === Number(user.id);
                              const isFromAdmin = msg.is_from_admin;

                              return (
                                <div
                                  key={msg.id}
                                  className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                                >
                                  <div
                                    className={`max-w-[70%] p-4 rounded-lg ${
                                      isMyMessage
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted border"
                                    }`}
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div className="flex-shrink-0">
                                        {isFromAdmin ? (
                                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-white" />
                                          </div>
                                        ) : (
                                          <div className="w-8 h-8 bg-primary-glow rounded-full flex items-center justify-center">
                                            <User className="h-4 w-4 text-white" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                          <p className="text-xs font-medium">
                                            {msg.sender_name || msg.sender_username}
                                            {isFromAdmin && (
                                              <Badge variant="destructive" className="ml-2 text-xs">
                                                Support
                                              </Badge>
                                            )}
                                          </p>
                                          <span className="text-xs opacity-70">
                                            {formatTime(msg.created_at)}
                                          </span>
                                        </div>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                          {msg.message}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {messages.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-2">No messages yet</p>
                          <p className="text-sm">Send a message to get started!</p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="border-t bg-background p-4 flex-shrink-0">
                    <div className="flex space-x-3">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        disabled={sending}
                        className="flex-1"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!message.trim() || sending}
                        className="flex-shrink-0"
                      >
                        {sending ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="font-medium">
                      {connected ? "Online" : "Offline"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {connected ? "Real-time messaging active" : "Reconnecting..."}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Call Us</p>
                      <p className="text-xs text-muted-foreground">+20 109 370 6046</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Email Us</p>
                      <p className="text-xs text-muted-foreground">mimmosafari56@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Chat;
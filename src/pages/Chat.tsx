// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";
// import { API_URL } from "@/config/api";
// import {
//   MessageCircle,
//   Send,
//   User,
//   Shield,
//   Phone,
//   Mail,
//   Trash2,
// } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import { useAuth } from "@/hooks/useAuth";

// const WS_URL = "ws://127.0.0.1:8000/ws/chat/"; // WebSocket URL

// interface Message {
//   id: string | number;
//   message: string;
//   sender: number;
//   sender_name?: string;
//   sender_username?: string;
//   is_from_admin: boolean;
//   created_at: string;
// }

// const Chat = () => {
//   const { t } = useTranslation();
//   const { user } = useAuth(); // Use your actual auth hook
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const wsRef = useRef<WebSocket | null>(null);

//   // State management
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState<Message[]>([]); // Initialize as empty array
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [connected, setConnected] = useState(false);
//   const role = localStorage.getItem("role");
//   // Initialize WebSocket connection
//   useEffect(() => {
//     if (!user) return;

//     const token = localStorage.getItem("access");
//     if (!token) return;

//     // Connect to WebSocket
//     wsRef.current = new WebSocket(`${WS_URL}?token=${token}`);

//     wsRef.current.onopen = () => {
//       console.log("WebSocket connected");
//       setConnected(true);
//     };

//     wsRef.current.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === "message" && data.data) {
//           setMessages((prev) => {
//             // Check if the message already exists
//             const exists = prev.some((msg) => msg.id === data.data.id);
//             if (exists) return prev; // skip duplicate
//             return [...prev, data.data];
//           });
//           scrollToBottom();
//         }
//       } catch (error) {
//         console.error("Error parsing WebSocket message:", error);
//       }
//     };

//     wsRef.current.onclose = () => {
//       console.log("WebSocket disconnected");
//       setConnected(false);
//     };

//     wsRef.current.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setConnected(false);
//     };

//     // Load existing messages
//     loadMessages();

//     return () => {
//       if (wsRef.current) {
//         wsRef.current.close();
//       }
//     };
//   }, [user]);

//   const loadMessages = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("access");
//       const response = await fetch(`${API_URL}/api/chat/messages/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         // Ensure we always set an array
//         if (Array.isArray(data)) {
//           setMessages(data);
//         } else if (data && Array.isArray(data.results)) {
//           setMessages(data.results);
//         } else if (data && Array.isArray(data.data)) {
//           setMessages(data.data);
//         } else {
//           console.warn("API returned unexpected data format:", data);
//           setMessages([]); // Fallback to empty array
//         }
//       } else {
//         console.error("Failed to load messages:", response.statusText);
//         setMessages([]);
//       }
//     } catch (error) {
//       console.error("Failed to load messages:", error);
//       setMessages([]); // Ensure messages is always an array
//     } finally {
//       setLoading(false);
//     }
//   };
//   const sendMessage = async () => {
//     if (!message.trim() || sending) return;

//     setSending(true);

//     try {
//       // Send via WebSocket for real-time
//       if (wsRef.current && connected) {
//         wsRef.current.send(
//           JSON.stringify({
//             message: message.trim(),
//           })
//         );
//         // Don't add to state here - let WebSocket response handle it
//       } else {
//         // Fallback to HTTP API
//         const token = localStorage.getItem("access");
//         const response = await fetch(`${API_URL}/api/chat/send/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             message: message.trim(),
//           }),
//         });

//         if (response.ok) {
//           const data = await response.json();
//           if (data.data) {
//             // Only add to state when using HTTP fallback
//             setMessages((prev) => [...prev, data.data]);
//           }
//         } else {
//           console.error("Failed to send message:", response.statusText);
//         }
//       }

//       setMessage("");
//       scrollToBottom();
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const deleteMessage = async (messageId: string | number) => {
//     if (role !== "admin") return;

//     try {
//       const token = localStorage.getItem("access");
//       const response = await fetch(`${API_URL}/api/chat/delete/${messageId}/`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
//       }
//     } catch (error) {
//       console.error("Failed to delete message:", error);
//     }
//   };

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       if (scrollRef.current) {
//         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//       }
//     }, 100);
//   };

//   const formatTime = (dateString: string) => {
//     return new Date(dateString).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     if (date.toDateString() === today.toDateString()) {
//       return "Today";
//     } else if (date.toDateString() === yesterday.toDateString()) {
//       return "Yesterday";
//     } else {
//       return date.toLocaleDateString();
//     }
//   };

//   // Group messages by date - with proper type checking
//   const groupedMessages = React.useMemo(() => {
//     if (!Array.isArray(messages)) {
//       return {};
//     }

//     return messages.reduce((groups: Record<string, Message[]>, message) => {
//       const date = new Date(message.created_at).toDateString();
//       if (!groups[date]) {
//         groups[date] = [];
//       }
//       groups[date].push(message);
//       return groups;
//     }, {});
//   }, [messages]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
//           <p className="text-lg">Loading chat...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Card className="w-full max-w-md">
//           <CardContent className="p-6 text-center">
//             <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
//             <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
//             <p className="text-muted-foreground mb-4">
//               Please sign in to access the chat
//             </p>
//             <Button onClick={() => (window.location.href = "/auth")}>
//               Sign In
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />

//       {/* Header */}
//       <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-8">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-white mb-2">
//                 <MessageCircle className="inline-block h-8 w-8 mr-3" />
//                 {role === "admin" ? "Admin Chat" : "Customer Support"}
//               </h1>
//               <p className="text-blue-100">
//                 {role === "admin"
//                   ? "Manage customer messages"
//                   : "Get help with your bookings"}
//               </p>
//             </div>

//             <div className="flex items-center space-x-2">
//               <div
//                 className={`w-3 h-3 rounded-full ${
//                   connected ? "bg-green-400" : "bg-red-400"
//                 }`}
//               ></div>
//               <span className="text-white text-sm">
//                 {connected ? "Connected" : "Disconnected"}
//               </span>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//             {/* Chat Interface */}
//             <div className="lg:col-span-3">
//               <Card className="h-[600px] flex flex-col">
//                 <CardHeader className="bg-gray-50 border-b">
//                   <CardTitle className="flex items-center justify-between">
//                     <span className="flex items-center">
//                       <MessageCircle className="h-5 w-5 mr-2" />
//                       Chat Messages
//                     </span>
//                     {role === "admin" && (
//                       <Badge variant="secondary">
//                         {messages.length} Total Messages
//                       </Badge>
//                     )}
//                   </CardTitle>
//                 </CardHeader>

//                 <CardContent className="flex-1 p-0 flex flex-col">
//                   {/* Messages */}
//                   <ScrollArea className="flex-1 p-4" ref={scrollRef}>
//                     <div className="space-y-4">
//                       {Object.entries(groupedMessages).map(
//                         ([date, dayMessages]) => (
//                           <div key={date}>
//                             {/* Date separator */}
//                             <div className="flex justify-center my-4">
//                               <Badge
//                                 variant="outline"
//                                 className="bg-background"
//                               >
//                                 {formatDate(dayMessages[0].created_at)}
//                               </Badge>
//                             </div>

//                             {/* Messages for this day */}
//                             {dayMessages.map((msg) => {
//                               const isMyMessage = msg.sender === user.id;
//                               const isFromAdmin = msg.is_from_admin;

//                               return (
//                                 <div
//                                   key={msg.id}
//                                   className={`flex ${
//                                     isMyMessage
//                                       ? "justify-end"
//                                       : "justify-start"
//                                   }`}
//                                 >
//                                   <div
//                                     className={`max-w-[70%] p-3 rounded-lg ${
//                                       isMyMessage
//                                         ? "bg-primary text-primary-foreground"
//                                         : "bg-muted"
//                                     }`}
//                                   >
//                                     <div className="flex items-start space-x-2">
//                                       <div className="flex-shrink-0">
//                                         {isFromAdmin ? (
//                                           <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
//                                             <Shield className="h-3 w-3 text-white" />
//                                           </div>
//                                         ) : (
//                                           <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                                             <User className="h-3 w-3 text-white" />
//                                           </div>
//                                         )}
//                                       </div>

//                                       <div className="flex-1 min-w-0">
//                                         <div className="flex items-center justify-between mb-1">
//                                           <p className="text-xs font-medium">
//                                             {msg.sender_name ||
//                                               msg.sender_username ||
//                                               "Unknown User"}
//                                             {isFromAdmin && (
//                                               <Badge
//                                                 variant="destructive"
//                                                 className="ml-2 text-xs"
//                                               >
//                                                 Admin
//                                               </Badge>
//                                             )}
//                                           </p>
//                                           <div className="flex items-center space-x-1">
//                                             <span className="text-xs opacity-70">
//                                               {formatTime(msg.created_at)}
//                                             </span>
//                                             {role === "admin" && (
//                                               <Button
//                                                 variant="ghost"
//                                                 size="sm"
//                                                 className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
//                                                 onClick={() =>
//                                                   deleteMessage(msg.id)
//                                                 }
//                                               >
//                                                 <Trash2 className="h-3 w-3" />
//                                               </Button>
//                                             )}
//                                           </div>
//                                         </div>
//                                         <p className="text-sm whitespace-pre-wrap break-words">
//                                           {msg.message}
//                                         </p>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         )
//                       )}

//                       {messages.length === 0 && (
//                         <div className="text-center py-12 text-muted-foreground">
//                           <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                           <p className="text-lg mb-2">No messages yet</p>
//                           <p className="text-sm">
//                             {role === "admin"
//                               ? "When customers send messages, they will appear here"
//                               : "Send a message to get started!"}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   </ScrollArea>

//                   {/* Message Input */}
//                   <div className="p-4 border-t bg-gray-50">
//                     <div className="flex space-x-2">
//                       <Input
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                         placeholder={
//                           role === "admin"
//                             ? "Reply to customer..."
//                             : "Type your message..."
//                         }
//                         disabled={sending}
//                         className="flex-1"
//                       />
//                       <Button
//                         onClick={sendMessage}
//                         disabled={!message.trim() || sending}
//                       >
//                         {sending ? (
//                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                         ) : (
//                           <Send className="h-4 w-4" />
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Sidebar */}
//             <div className="space-y-4">
//               {/* Connection Status */}
//               <Card>
//                 <CardContent className="p-4">
//                   <div className="flex items-center space-x-2">
//                     <div
//                       className={`w-3 h-3 rounded-full ${
//                         connected ? "bg-green-500" : "bg-red-500"
//                       }`}
//                     ></div>
//                     <span className="font-medium">
//                       {connected ? "Online" : "Offline"}
//                     </span>
//                   </div>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     {connected
//                       ? "Real-time messaging active"
//                       : "Reconnecting..."}
//                   </p>
//                 </CardContent>
//               </Card>

//               {/* User Info */}
//               <Card>
//                 <CardContent className="p-4">
//                   <div className="flex items-center space-x-2 mb-3">
//                     {role === "admin" ? (
//                       <Shield className="h-5 w-5 text-red-500" />
//                     ) : (
//                       <User className="h-5 w-5 text-blue-500" />
//                     )}
//                     <span className="font-medium">
//                       {role === "admin" ? "Admin" : "Customer"}
//                     </span>
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     {user.first_name} {user.last_name}
//                   </p>
//                   <p className="text-xs text-muted-foreground">{user.email}</p>
//                 </CardContent>
//               </Card>

//               {/* Contact Info (for customers) */}
//               {role !== "admin" && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Need Help?</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     <div className="flex items-center space-x-2">
//                       <Phone className="h-4 w-4 text-primary" />
//                       <div>
//                         <p className="text-sm font-medium">Call Us</p>
//                         <p className="text-xs text-muted-foreground">
//                           +20 109 370 6046
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Mail className="h-4 w-4 text-primary" />
//                       <div>
//                         <p className="text-sm font-medium">Email Us</p>
//                         <p className="text-xs text-muted-foreground">
//                           mimmosafari56@gmail.com
//                         </p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Admin Stats */}
//               {role === "admin" && (
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Chat Stats</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span>Total Messages</span>
//                         <Badge>{messages.length}</Badge>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>From Customers</span>
//                         <Badge variant="outline">
//                           {messages.filter((m) => !m.is_from_admin).length}
//                         </Badge>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>From Admins</span>
//                         <Badge variant="outline">
//                           {messages.filter((m) => m.is_from_admin).length}
//                         </Badge>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Chat;
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
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
const getWebSocketURL = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}/ws/chat/`;
};
const WS_URL = "ws://4ig3t_xSGHqlAnC9PtwrtqG9gmLU_ZADVwJn_oDLUrKJDvvv7mgEPqLdWHB2gRZT@egypt-ra-5303.redis.c.osc-fr1.scalingo-dbs.com:32758/ws/chat/"; // WebSocket URL

interface Message {
  id: string | number;
  message: string;
  sender: number;
  sender_name?: string;
  sender_username?: string;
  is_from_admin: boolean;
  created_at: string;
}

const Chat = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); // Use your actual auth hook
  const scrollRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State management
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const role = localStorage.getItem("role");

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    // Connect to WebSocket
    wsRef.current = new WebSocket(`${WS_URL}?token=${token}`);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "message" && data.data) {
          setMessages((prev) => {
            const exists = prev.some((msg) => msg.id === data.data.id);
            if (exists) return prev;
            return [...prev, data.data];
          });
          scrollToBottom();
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

    // Load existing messages
    loadMessages();
    scrollToBottom();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_URL}/api/chat/messages/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data && Array.isArray(data.results)) {
          setMessages(data.results);
        } else if (data && Array.isArray(data.data)) {
          setMessages(data.data);
        } else {
          console.warn("API returned unexpected data format:", data);
          setMessages([]);
        }
        scrollToBottom();
      } else {
        console.error("Failed to load messages:", response.statusText);
        setMessages([]);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
      scrollToBottom();
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);

    try {
      if (wsRef.current && connected) {
        wsRef.current.send(
          JSON.stringify({
            message: message.trim(),
          })
        );
        scrollToBottom();
      } else {
        const token = localStorage.getItem("access");
        const response = await fetch(`${API_URL}/api/chat/send/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: message.trim(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setMessages((prev) => [...prev, data.data]);
          }
        } else {
          console.error("Failed to send message:", response.statusText);
        }
      }

      setMessage("");
      scrollToBottom();
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
      scrollToBottom();
    }
  };

  const deleteMessage = async (messageId: string | number) => {
    if (role !== "admin") return;

    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${API_URL}/api/chat/delete/${messageId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      return t("today");
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t("yesterday");
    } else {
      return date.toLocaleDateString();
    }
  };

  const groupedMessages = React.useMemo(() => {
    if (!Array.isArray(messages)) {
      return {};
    }

    return messages.reduce((groups: Record<string, Message[]>, message) => {
      const date = new Date(message.created_at).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg">{t("loading_chat")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {t("sign_in_required")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("sign_in_to_access_chat")}
            </p>
            <Button onClick={() => (window.location.href = "/auth")}>
              {t("sign_in")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-sky py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                <MessageCircle className="inline-block h-8 w-8 mr-3 text-primary" />
                {role === "admin" ? t("admin_chat") : t("customer_support")}
              </h1>
              <p className="text-muted-foreground">
                {role === "admin"
                  ? t("manage_customer_messages")
                  : t("get_help_with_bookings")}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  connected ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              <span className="text-foreground text-sm">
                {connected ? t("connected") : t("disconnected")}
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
              <Card className="h-[600px] shadow-glow flex flex-col">
                <CardHeader className="bg-gradient-ocean text-white flex-shrink-0">
                  <CardTitle className="flex items-center justify-between text-primary-foreground">
                    <span className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      {t("chat_messages")}
                    </span>
                    {role === "admin" && (
                      <Badge variant="secondary">
                        {messages.length} {t("total_messages")}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                  <div className="flex-1 min-h-0 flex flex-col">
                    <ScrollArea className="flex-1 px-6 py-4">
                      <div className="space-y-6">
                        {Object.entries(groupedMessages).map(
                          ([date, dayMessages]) => (
                            <div key={date}>
                              <div className="flex justify-center my-6">
                                <Badge
                                  variant="outline"
                                  className="bg-background"
                                >
                                  {formatDate(dayMessages[0].created_at)}
                                </Badge>
                              </div>

                              <div className="space-y-4">
                                {dayMessages.map((msg) => {
                                  const isMyMessage =
                                    msg.sender === Number(user.id);
                                  const isFromAdmin = msg.is_from_admin;

                                  return (
                                    <div
                                      key={msg.id}
                                      className={`flex ${
                                        isMyMessage
                                          ? "justify-end"
                                          : "justify-start"
                                      }`}
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
                                                {msg.sender_name ||
                                                  msg.sender_username ||
                                                  t("unknown_user")}
                                                {isFromAdmin && (
                                                  <Badge
                                                    variant="destructive"
                                                    className="ml-2 text-xs"
                                                  >
                                                    {t("admin")}
                                                  </Badge>
                                                )}
                                              </p>
                                              <div className="flex items-center space-x-2">
                                                <span className="text-xs opacity-70">
                                                  {formatTime(msg.created_at)}
                                                </span>
                                                {role === "admin" && (
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                                                    onClick={() =>
                                                      deleteMessage(msg.id)
                                                    }
                                                  >
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                )}
                                              </div>
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
                          )
                        )}

                        {messages.length === 0 && (
                          <div className="text-center py-12 text-muted-foreground">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg mb-2">
                              {t("no_messages_yet")}
                            </p>
                            <p className="text-sm">
                              {role === "admin"
                                ? t("admin_no_messages_yet")
                                : t("customer_no_messages_yet")}
                            </p>
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
                          placeholder={
                            role === "admin"
                              ? t("reply_to_customer")
                              : t("type_your_message")
                          }
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
                        {t("enter_to_send_shift_enter_new_line")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        connected ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="font-medium">
                      {connected ? t("online") : t("offline")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {connected
                      ? t("real_time_messaging_active")
                      : t("reconnecting")}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    {role === "admin" ? (
                      <Shield className="h-5 w-5 text-red-500" />
                    ) : (
                      <User className="h-5 w-5 text-blue-500" />
                    )}
                    <span className="font-medium">
                      {role === "admin" ? t("admin") : t("customer")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.first_name || t("user")}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </CardContent>
              </Card>

              {role !== "admin" && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{t("need_help")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{t("call_us")}</p>
                        <p className="text-xs text-muted-foreground">
                          +20 109 370 6046
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{t("email_us")}</p>
                        <p className="text-xs text-muted-foreground">
                          mimmosafari56@gmail.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {role === "admin" && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{t("chat_stats")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t("total_messages")}</span>
                        <Badge>{messages.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("from_customers")}</span>
                        <Badge variant="outline">
                          {messages.filter((m) => !m.is_from_admin).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("from_admins")}</span>
                        <Badge variant="outline">
                          {messages.filter((m) => m.is_from_admin).length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Chat;

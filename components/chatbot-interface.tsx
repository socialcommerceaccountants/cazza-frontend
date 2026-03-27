"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Sparkles, Zap } from "lucide-react";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hi! I'm your Cazza.ai assistant. How can I help you today?",
    sender: "ai",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    text: "Can you show me last month's revenue breakdown?",
    sender: "user",
    timestamp: "10:02 AM",
  },
  {
    id: 3,
    text: "Sure! Last month's revenue was £42,850. Top categories: Services (£28,500), Products (£12,350), Subscriptions (£2,000). Want me to create a detailed report?",
    sender: "ai",
    timestamp: "10:03 AM",
  },
];

const quickPrompts = [
  "Revenue report",
  "Pending invoices",
  "Team tasks",
  "Schedule meeting",
];

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: "I've processed your request. Let me gather the latest data and prepare a response.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Ask me anything about your business</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat messages */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="h-8 w-8">
                {message.sender === "ai" ? (
                  <>
                    <AvatarImage src="/bot-avatar.jpg" />
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/user-avatar.jpg" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.sender === "ai"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick prompts */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Quick prompts:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => handleQuickPrompt(prompt)}
                className="text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                {prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <Input
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-xs text-muted-foreground">Tasks completed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">98%</p>
            <p className="text-xs text-muted-foreground">Accuracy rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
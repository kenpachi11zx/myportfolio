"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Sahil Islam's AI assistant. I can help you learn about his skills, projects, experience, or provide contact details. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Portfolio context data - structured for AI assistant
    const portfolioContext = {
      owner: {
        name: "Sahil Islam",
        title: "Full Stack Developer",
        location: "Guwahati, Assam, India",
        education: "Bachelor of Technology in Computer Science & Engineering at The Assam Kaziranga University (2022-2026)",
      },
      personalDetails: {
        dateOfBirth: "30 April, 2004",
        hometown: "Guwahati, Assam",
        nationality: "India",
      },
      projects: [
        {
          name: "CuraAI – Virtual AI Health Assistant",
          description: "A production-ready Flask-based AI health assistant.",
          type: "AI Integration / Production-Ready Flask App",
          liveUrl: "https://curaai-ky7e.onrender.com/",
        },
        {
          name: "Moon Films Portfolio – Creative Agency Website",
          description: "A modern video-editing/visual storytelling portfolio website.",
          type: "Frontend Development / Creative Agency Website",
          liveUrl: "https://moonfilms.netlify.app/",
        },
        {
          name: "GitHub Profile Explorer",
          description: "A real-time GitHub profile viewer with API integration.",
          type: "Frontend Development / API Integration",
          liveUrl: "https://gitfetchprofile.netlify.app/",
        },
        {
          name: "Developer Portfolio Website",
          description: "A personal, responsive developer portfolio.",
          type: "Frontend Development / Modern Web Technologies",
          liveUrl: "https://devxfolio.netlify.app/",
        },
        {
          name: "IOCL HSE Compliance Portal",
          description: "An enterprise-grade ASP.NET Core MVC compliance system.",
          type: "Enterprise Development / ASP.NET Core MVC",
          codeUrl: "https://github.com/kenpachi11zx/IOCLCompliancePortalV1.2",
        },
      ],
      technologies: {
        languages: ["C#", "Python", "JavaScript", "TypeScript"],
        frontend: ["HTML", "CSS", "Tailwind CSS", "React", "Next.js"],
        backend: [".NET Core", "Flask"],
        databases: ["MySQL", "Microsoft SQL Server"],
        tools: ["Git", "GitHub", "Visual Studio", "VS Code"],
        other: ["API integration", "BeautifulSoup", "AWS basics"],
      },
      softSkills: [
        "Teamwork",
        "Problem Solving",
        "Time Management",
        "Adaptability",
        "Quick Learner",
        "Communication",
      ],
      extraCurricular: [
        "Cricket",
        "Video Editing",
        "Graphic Designing",
      ],
      languages: [
        "English (Read/Write/Speak)",
        "Hindi (Read/Write/Speak)",
        "Assamese (Read/Write/Speak)",
      ],
      certificates: [
        {
          name: "AWS Academy Graduate - Machine Learning Foundations",
          issuer: "AWS Academy",
          date: "February 2024",
        },
        {
          name: "Hands-On Web Development with JavaScript",
          issuer: "Infosys Springboard",
          date: "May 2024",
        },
        {
          name: "Python 101 for Data Science",
          issuer: "IBM (Cognitive Class)",
          date: "April 2025",
        },
      ],
      contact: {
        email: "sahilislam619@gmail.com",
        phone: "+91 6003021379",
        linkedin: "https://www.linkedin.com/in/sahil-islam-b1955825a/",
        github: "https://github.com/kenpachi11zx",
      },
    };

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage, 
          history: messages,
          context: portfolioContext,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        const errMsg = err?.error || "Failed to fetch response from server.";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Error: ${errMsg}`,
          },
        ]);
        return;
      }

      const data = await resp.json();
      const assistantText = data?.message || data?.reply || "(no response)";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: String(assistantText),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Network error: Unable to reach the chat server. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick suggestion buttons (like the example UI your friend has)
  const suggestions = [
    "What projects have you built?",
    "What technologies do you use?",
    "How can I contact you?",
  ];

  const handleSuggestion = (text: string) => {
    // set input and send immediately for quick UX
    setInput(text);
    // small timeout to ensure state updates before sending
    setTimeout(() => {
      handleSend();
    }, 50);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const firstMessage = messages.length > 0 ? messages[0] : null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-primary to-secondary text-primary-foreground",
          "shadow-lg shadow-primary/20 border border-primary/30",
          "hover:shadow-xl hover:shadow-primary/30 hover:scale-110",
          "transition-all duration-300 backdrop-blur-sm"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className={cn(
              "fixed bottom-24 right-6 z-40 flex h-[600px] w-[400px] flex-col",
              "rounded-2xl border border-muted/30 bg-card/95 backdrop-blur-xl",
              "shadow-2xl shadow-primary/10",
              "overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-muted/30 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                <span className="text-xs text-muted-foreground">Gemini Flash</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {/* Render first (welcome) message first, then suggestions, then remaining messages */}
              {firstMessage && (
                <motion.div
                  key={`first-msg`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    firstMessage.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      firstMessage.role === "user"
                        ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                        : "bg-muted/50 text-foreground border border-muted/30"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {firstMessage.content}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Quick suggestions (shown after welcome message) */}
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s)}
                    className={cn(
                      "rounded-full border border-muted/20 px-3 py-1 text-xs",
                      "bg-background/60 hover:bg-primary/5 text-foreground",
                      "transition"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Render remaining messages (skip index 0) */}
              {messages.slice(1).map((message, idx) => (
                <motion.div
                  key={idx + 1}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2.5",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                        : "bg-muted/50 text-foreground border border-muted/30"
                    )}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted/50 border border-muted/30 rounded-2xl px-4 py-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-muted/30 bg-background/50 backdrop-blur-sm p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className={cn(
                    "flex-1 rounded-lg border border-muted/30 bg-card/50 px-4 py-2.5",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200"
                  )}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    "bg-gradient-to-br from-primary to-secondary text-primary-foreground",
                    "hover:shadow-lg hover:shadow-primary/30 hover:scale-105",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                    "transition-all duration-200"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm the AI Assistant for New Media Tek. I can help answer technical questions about our .NET development, advanced data solutions, or schedule a consultation with our Senior Architect and Data Solutions Developer. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Sanitize text content to prevent XSS
  const sanitizeText = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || leadCaptured) return;

    const userMessage = input.trim();
    
    // Input validation
    if (userMessage.length > 500) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please keep messages under 500 characters.",
        },
      ]);
      return;
    }
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/.netlify/functions/chat-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          throw new Error(`Please wait ${errorData.retryAfter || 60} seconds before sending another message.`);
        }
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);

      // Check if lead was captured (backend confirms via leadCaptured flag)
      if (data.leadCaptured) {
        setTimeout(() => setLeadCaptured(true), 1500); // Slight delay for UX
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble connecting to the server right now. Please try again or contact us directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewConversation = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm the AI Assistant for New Media Tek. I can help answer technical questions about our .NET modernization services or schedule a consultation with our Senior Architect. How can I help?",
      },
    ]);
    setLeadCaptured(false);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-gray-500/20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${leadCaptured ? "bg-emerald-500" : "bg-emerald-500 animate-pulse"}`}
              ></div>
              <span className="text-sm font-semibold text-white tracking-wide">
                New Media Tek AI
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-800/80 text-slate-200 border border-white/5 rounded-bl-none"
                  }`}
                  dangerouslySetInnerHTML={{ __html: sanitizeText(msg.content) }}
                />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 rounded-2xl rounded-bl-none px-4 py-4 border border-white/5 flex items-center gap-1.5 w-fit">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Lead Captured State */}
          {leadCaptured ? (
            <div className="p-6 border-t border-white/10 bg-gradient-to-r from-emerald-900/20 to-cyan-900/20">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">Thank You!</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Our Senior Architect will be in touch within 24 hours.
                </p>
                <button
                  onClick={handleStartNewConversation}
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start New Conversation
                </button>
              </div>
            </div>
          ) : (
            /* Input Area */
            <div className="p-4 border-t border-white/10 bg-[#0f172a]/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about .NET migration..."
                  className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-slate-600 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI-Augmented Architect
                  Assistant
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-slate-800 text-white rotate-90"
            : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white animate-bounce-subtle"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}

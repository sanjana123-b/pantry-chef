import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, Send, X, Bot, User, Sparkles, ChefHat, RotateCcw, AlertCircle } from 'lucide-react';
import { askSousChef } from '../api/client';
import ChefMascot from './ChefMascot';

const STARTER_PROMPTS = [
  '🧂 How to fix an over-salted sauce?',
  '🥚 Best egg substitutes for baking?',
  '🍲 How to thicken soup without cornstarch?',
  '🌡️ What is the safe temperature for chicken?',
  '🧈 Quick butter replacement in cooking?',
];

export default function ChatbotDrawer({ isOpen, onClose, onOpen }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 Bonjour! I'm **Chef Auguste**, your culinary sous-chef. Got a missing ingredient, an over-salted skillet, or need a quick culinary fix? Ask me anything!",
      source: 'gemini',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (customText) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: textToSend.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askSousChef(textToSend.trim(), messages);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: response.reply,
          source: response.source || 'gemini',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `⚠️ **Unable to reach Chef Auguste:** ${err.message || 'Please check your connection and try asking again.'}`,
          isError: true,
          source: 'fallback',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        sender: 'bot',
        text: "👋 Kitchen slate cleared! What cooking advice or substitution can I help you with next?",
        source: 'gemini',
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button (Always visible on bottom-right) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-tomato text-white rounded-full shadow-card-elevated flex items-center gap-2.5 border-2 border-[#A83E1E] group"
          title="Ask Sous-Chef Chatbot"
        >
          <div className="p-1 rounded-full bg-white/20">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="font-serif font-bold text-sm tracking-wide">
            Ask Sous-Chef
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-mustard animate-pulse" />
        </motion.button>
      )}

      {/* Slide-out / Popover Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[540px] max-h-[85vh] bg-[#FAF5E8] border-2 border-[#D9CBAC] rounded-3xl shadow-card-elevated flex flex-col overflow-hidden"
          >
            {/* Vintage Notepad Top Margin */}
            <div className="h-2 bg-tomato/80 w-full" />

            {/* Chatbot Header */}
            <div className="p-3.5 bg-paper-card border-b border-paper-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-tomato/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <ChefMascot mood={isLoading ? "thinking" : "idle"} size={36} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-ink flex items-center gap-1.5">
                    Chef Auguste
                    <span className="text-[10px] font-semibold bg-basil/15 text-basil px-2 py-0.5 rounded-full">
                      Sous-Chef
                    </span>
                  </h3>
                  <p className="text-xs text-ink-muted -mt-0.5">
                    {isLoading ? "Thinking about cooking..." : "Your kitchen advisor"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-muted transition-colors cursor-pointer"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-ink-muted hover:text-tomato hover:bg-tomato/10 transition-colors cursor-pointer"
                  title="Close Sous-Chef"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Messages List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-lined-ledger">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-tomato/15 text-tomato flex items-center justify-center flex-shrink-0 mt-0.5 border border-tomato/20">
                      <ChefHat className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-tomato text-white rounded-br-none shadow-sm'
                        : msg.isError
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-none shadow-sm whitespace-pre-wrap'
                        : 'bg-[#FBF7EE] text-charcoal rounded-bl-none border border-[#DECFA4] shadow-sm whitespace-pre-wrap'
                    }`}
                  >
                    <div>{msg.text}</div>
                    {msg.sender === 'bot' && msg.source === 'fallback' && !msg.isError && (
                      <div className="mt-2 pt-1.5 border-t border-[#DECFA4]/60 flex items-center gap-1.5 text-[10px] text-amber-800 font-medium">
                        <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        <span>Offline tips mode</span>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-charcoal text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-full bg-tomato/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <ChefMascot mood="thinking" size={28} />
                  </div>
                  <div className="bg-paper-card border border-paper-border px-3.5 py-2.5 rounded-card rounded-bl-none text-xs text-ink flex items-center gap-2.5 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tomato animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-tomato animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-tomato animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-ink-muted font-medium">
                      Chef Auguste is thinking...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Prompt Chips */}
            <div className="p-2.5 bg-[#FAF5E8] border-t border-[#E3D6BC] flex gap-1.5 overflow-x-auto no-scrollbar">
              {STARTER_PROMPTS.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSend(prompt)}
                  className="flex-shrink-0 text-[11px] font-sans px-2.5 py-1 rounded-full bg-[#F4ECDB] hover:bg-tomato/15 hover:text-tomato text-charcoal border border-[#DDD2BE] transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-[#FAF5E8] border-t border-[#E3D6BC] flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                disabled={isLoading}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isLoading ? "Chef is writing..." : "Ask Chef Auguste anything..."}
                className="flex-1 bg-[#FBF7EE] text-charcoal placeholder-charcoal-muted/60 px-3.5 py-2.5 rounded-xl border border-[#D9CBAC] text-xs sm:text-sm focus:outline-none focus:border-tomato font-medium disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 bg-tomato hover:bg-tomato-hover disabled:opacity-40 text-white rounded-xl shadow-sm transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

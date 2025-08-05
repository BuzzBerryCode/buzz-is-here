'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { ChatHistorySection } from "../BuzzberryDashboard/sections/ChatHistorySection";
import { useAIChat, type Message } from '@/hooks/useAIChat'

interface BuzzberryChatPageProps {
  initialPrompt?: string;
  onBack?: () => void;
}

export const BuzzberryChatPage = ({ initialPrompt, onBack }: BuzzberryChatPageProps): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initializedRef = useRef(false);

  // AI Chat management
  const { 
    messages, 
    isLoading, 
    sessionId, 
    chatHistory, 
    streamingMessage,
    sendMessage: aiSendMessage, 
    clearMessages, 
    removeChat, 
    clearHistory, 
    formatTimestamp 
  } = useAIChat()

  // Set page as loaded after a brief delay to ensure smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Initialize with the initial prompt if provided
  useEffect(() => {
    if (!sessionId) return; // Don't run without session
    
    const promptFromUrl = searchParams.get('prompt');
    const prompt = initialPrompt || promptFromUrl;
    
    if (prompt && !initializedRef.current && !isInitializing) {
      initializedRef.current = true;
      setIsInitializing(true);
      
      // Send the message immediately
      sendMessage(prompt);
    }
  }, [initialPrompt, searchParams, isInitializing, sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  // Send message using AI chat hook
  const sendMessage = async (message: string) => {
    if (!sessionId) {
      console.log('Not ready to send message');
      return;
    }

    setIsInitializing(false);
    
    try {
      await aiSendMessage(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/dashboard/aisearch');
    }
  };

  // Function to render markdown formatting
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className={`min-h-screen bg-black flex flex-col transition-opacity duration-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Top navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-2 xs:p-4 bg-black/80 backdrop-blur-sm">
        {/* Back button */}
        <Button
          variant="outline"
          onClick={handleBackClick}
          className="flex items-center gap-1 xs:gap-2 px-2 xs:px-3.5 py-2 xs:py-3 bg-[#0f1419] rounded-[34px] border-gray-700 hover:bg-[#1a1f2e]"
        >
          <img 
            className="w-4 h-4" 
            alt="Back arrow" 
            src="/Arrow down button vector.png"
            style={{ transform: 'rotate(90deg)' }}
          />
          <span className="hidden xs:inline font-medium text-white text-sm tracking-[-0.08px] leading-5">
            Back
          </span>
        </Button>

        {/* Right side buttons */}
        <div className="flex gap-1 xs:gap-2">
          <Button
            variant="outline"
            onClick={() => setIsChatHistoryOpen(!isChatHistoryOpen)}
            className="flex items-center gap-1 px-2 xs:px-3.5 py-2 xs:py-3 bg-[#0f1419] rounded-[34px] border-gray-700 hover:bg-[#1a1f2e]"
          >
            <img
              className="w-5 xs:w-6 h-5 xs:h-6"
              alt="Chat history icon"
              src="/Chat History.svg"
            />
            <span className="hidden sm:inline font-medium text-white text-sm tracking-[-0.08px] leading-5">
              Chat History
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              // Clear current chat and start fresh
              clearMessages();
              router.push('/dashboard/aisearch');
            }}
            className="flex items-center justify-center w-12 h-12 bg-[#0f1419] rounded-full border-gray-700 hover:bg-[#1a1f2e] p-0"
          >
            <img 
              className="w-6 h-6" 
              alt="Plus icon" 
              src="/+ Icon Vector.svg"
            />
          </Button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col pt-16 xs:pt-20">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-2 xs:px-4">
            {messages.length === 0 ? (
              // Empty state
              <div className="flex flex-col items-center justify-center h-full text-center py-10 xs:py-20">
                <div className="w-16 h-16 bg-[#0f1419] rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  >
                    <source 
                      src="https://epwm2xeeqm8soa6z.public.blob.vercel-storage.com/Buzzberry%20AI%20Chat.webm" 
                      type="video/webm" 
                    />
                    <img
                      className="w-8 h-8"
                      alt="Buzzberry AI"
                      src="/AI Blurb Icon.svg"
                    />
                  </video>
                </div>
                <h2 className="font-medium text-white text-lg xs:text-xl mb-2">
                  Start a conversation
                </h2>
                <p className="font-normal text-[#99a0ad] text-xs xs:text-sm px-4">
                  Ask me about influencers, creators, or audience insights
                </p>
              </div>
            ) : (
              // Messages
              <div className="py-6 space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start gap-2 xs:gap-3 max-w-[85%] xs:max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {message.role === 'user' ? (
                          <div className="w-6 xs:w-8 h-6 xs:h-8 bg-[#5661f6] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs xs:text-sm font-medium">U</span>
                          </div>
                        ) : (
                          <div className="w-6 xs:w-8 h-6 xs:h-8 rounded-full overflow-hidden relative">
                            <video
                              className="w-full h-full object-cover"
                              autoPlay
                              loop
                              muted
                              playsInline
                              preload="auto"
                            >
                              <source
                                src="https://epwm2xeeqm8soa6z.public.blob.vercel-storage.com/Buzzberry%20AI%20Chat.webm"
                                type="video/webm"
                              />
                              <div className="w-6 xs:w-8 h-6 xs:h-8 bg-[#0f1419] rounded-full flex items-center justify-center">
                                <img
                                  className="w-3 xs:w-5 h-3 xs:h-5"
                                  alt="Buzzberry AI"
                                  src="/AI Blurb Icon.svg"
                                />
                              </div>
                            </video>
                          </div>
                        )}
                      </div>

                      {/* Message content */}
                      {message.role === 'user' ? (
                        <div className="bg-[#5661f6] text-white rounded-3xl px-3 xs:px-4 py-2 xs:py-3">
                          <div className="font-normal text-xs xs:text-sm leading-5 xs:leading-6 whitespace-pre-wrap">
                            {message.content}
                          </div>
                        </div>
                      ) : (
                        <div className="text-white">
                          <div
                            className="font-normal text-sm xs:text-[15px] leading-6 xs:leading-7 whitespace-pre-wrap [&>strong]:font-semibold [&>ul]:mt-2 [&>ul]:mb-2 [&>li]:ml-4"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && !streamingMessage && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 xs:gap-3 max-w-[85%] xs:max-w-[70%]">
                      <div className="flex-shrink-0">
                        <div className="w-6 xs:w-8 h-6 xs:h-8 rounded-full overflow-hidden">
                          <video
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                          >
                            <source
                              src="https://epwm2xeeqm8soa6z.public.blob.vercel-storage.com/Buzzberry%20AI%20Chat.webm"
                              type="video/webm"
                            />
                            <div className="w-6 xs:w-8 h-6 xs:h-8 bg-[#0f1419] rounded-full flex items-center justify-center">
                              <img
                                className="w-3 xs:w-5 h-3 xs:h-5"
                                alt="Buzzberry AI"
                                src="/AI Blurb Icon.svg"
                              />
                            </div>
                          </video>
                        </div>
                      </div>
                      <div className="text-white flex items-center">
                        {/* Fluid wave animation */}
                        <div className="flex flex-col gap-3">
                          <div className="text-xs xs:text-sm text-gray-400">
                            Processing...
                          </div>
                          <div className="flex items-center gap-1">
                            {/* Fluid wave dots */}
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0s', animationDuration: '1.4s'}}></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1.4s'}}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s', animationDuration: '1.4s'}}></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.6s', animationDuration: '1.4s'}}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.8s', animationDuration: '1.4s'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Streaming message with typewriter effect */}
                {isLoading && streamingMessage && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 xs:gap-3 max-w-[85%] xs:max-w-[70%]">
                      {/* AI Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-6 xs:w-8 h-6 xs:h-8 rounded-full overflow-hidden relative">
                          <video
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                          >
                            <source
                              src="https://epwm2xeeqm8soa6z.public.blob.vercel-storage.com/Buzzberry%20AI%20Chat.webm"
                              type="video/webm"
                            />
                            <div className="w-6 xs:w-8 h-6 xs:h-8 bg-[#0f1419] rounded-full flex items-center justify-center">
                              <img
                                className="w-3 xs:w-5 h-3 xs:h-5"
                                alt="Buzzberry AI"
                                src="/AI Blurb Icon.svg"
                              />
                            </div>
                          </video>
                        </div>
                      </div>

                      {/* Streaming message content */}
                      <div className="text-white">
                        <div className="font-normal text-sm xs:text-[15px] leading-6 xs:leading-7 whitespace-pre-wrap [&>strong]:font-semibold [&>ul]:mt-2 [&>ul]:mb-2 [&>li]:ml-4">
                          <span dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingMessage) }} />
                          {isLoading && (
                            <span className="inline-block w-0.5 h-4 bg-slate-800 ml-0.5 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input area */}
        <div className="p-3 xs:p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-2 xs:gap-3 bg-[#2f2f2f] rounded-3xl border-0 px-3 xs:px-4 py-2 xs:py-3 shadow-lg">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Buzzberry AI..."
                  className="flex-1 bg-transparent border-none outline-none font-normal text-white text-sm xs:text-base resize-none min-h-[20px] xs:min-h-[24px] max-h-32 placeholder-gray-400 py-1"
                  rows={1}
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="p-2 flex-shrink-0 hover:bg-transparent focus:bg-transparent hover:shadow-lg hover:shadow-black/30 rounded-full bg-transparent transition-shadow duration-200"
                  disabled={!inputValue.trim() || isLoading}
                  style={{
                    filter: 'drop-shadow(0 0 0 transparent)',
                    transition: 'filter 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'drop-shadow(0 0 0 transparent)';
                  }}
                >
                  <img
                    className="h-4 xs:h-5 w-4 xs:w-5 transition-transform duration-200 hover:scale-110"
                    alt="Send prompt button"
                    src="/Send Prompt Button.png"
                  />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      <div className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${
        isChatHistoryOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setIsChatHistoryOpen(false)} />

      {/* Chat History Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-50 ${
        isChatHistoryOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <ChatHistorySection
          onClose={() => setIsChatHistoryOpen(false)}
          onChatSelect={(chatId) => {
            // TODO: Implement chat loading functionality
            console.log('Loading chat:', chatId)
          }}
        />
      </div>
    </div>
  );
};
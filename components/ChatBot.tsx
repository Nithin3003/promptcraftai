import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse, generateSpeech } from '../services/geminiService';
import { ChatMessage } from '../types';
import { decode, decodeAudioData } from '../utils/audioUtils';

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white flex-shrink-0">
        U
    </div>
);

const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h.5a1.5 1.5 0 010 3H14a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H9a1 1 0 001-1v-.5z" />
            <path d="M9.043 8.258a1.5 1.5 0 00-2.086 2.086c.047.054.098.103.154.148l3.34 2.004a.5.5 0 00.678-.082c.118-.17.197-.364.23-.569.032-.2.022-.405-.028-.602a1.5 1.5 0 00-1.285-1.285c-.197-.05-.402-.06-.602-.028-.205.033-.399.112-.569.23a.5.5 0 00-.082.678l2.004 3.34c.045.056.094.107.148.154a1.5 1.5 0 002.086-2.086l-4.243-4.242a1.5 1.5 0 00-2.086 2.086l4.243 4.242z" />
        </svg>
    </div>
);

const ListenIcon = ({ isPlaying }: { isPlaying: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isPlaying ? 'text-indigo-400' : 'text-gray-400 group-hover:text-white'}`} viewBox="0 0 20 20" fill="currentColor">
        {isPlaying ? (
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a2 2 0 00-2 2v2a2 2 0 104 0V9a2 2 0 00-2-2z" clipRule="evenodd" />
        ) : (
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm7 0H8v12h4V4z" />
        )}
    </svg>
);


const ChatBot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello! How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useLowLatency, setUseLowLatency] = useState(false);
    const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null);
    
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const botResponse = await getChatResponse([...messages, userMessage], currentInput, useLowLatency);
            const botMessage: ChatMessage = { role: 'model', content: botResponse };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I encountered an error. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayAudio = async (text: string, index: number) => {
        if (playingMessageIndex === index) {
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
                audioSourceRef.current = null;
            }
            setPlayingMessageIndex(null);
            return;
        }

        try {
            setPlayingMessageIndex(index);
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioContext = audioContextRef.current;
            const base64Audio = await generateSpeech(text);
            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
            
            if (audioSourceRef.current) {
                audioSourceRef.current.stop();
            }

            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
            source.onended = () => {
                setPlayingMessageIndex(null);
                audioSourceRef.current = null;
            };
            audioSourceRef.current = source;
        } catch (error) {
            console.error("Error playing audio:", error);
            setPlayingMessageIndex(null);
        }
    };

    return (
        <div className="flex flex-col h-[65vh]">
            <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <BotIcon />}
                        <div className={`max-w-md p-3 rounded-2xl relative group ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            {msg.role === 'model' && (
                                <button 
                                  onClick={() => handlePlayAudio(msg.content, index)}
                                  className="absolute -bottom-2 -right-2 bg-gray-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <ListenIcon isPlaying={playingMessageIndex === index} />
                                </button>
                            )}
                        </div>
                        {msg.role === 'user' && <UserIcon />}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <BotIcon />
                        <div className="max-w-md p-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    </div>
                )}
                 <div ref={messagesEndRef} />
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-end items-center mb-2">
                    <label htmlFor="low-latency-toggle" className="flex items-center cursor-pointer">
                        <span className="mr-2 text-sm text-gray-400">Low Latency</span>
                        <div className="relative">
                            <input type="checkbox" id="low-latency-toggle" className="sr-only" checked={useLowLatency} onChange={() => setUseLowLatency(!useLowLatency)} />
                            <div className="block bg-gray-600 w-10 h-6 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useLowLatency ? 'transform translate-x-4 bg-indigo-400' : ''}`}></div>
                        </div>
                    </label>
                </div>
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white rounded-lg p-2.5 disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                        disabled={isLoading || !input.trim()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBot;
import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../contexts/AuthContext';

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.306 3 11.75c0 4.556 4.03 8.25 9 8.25Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 11.25h.008v.008h-.008V11.25Zm-3.75 0h.008v.008h-.008V11.25Zm-3.75 0h.008v.008H9V11.25Z" />
  </svg>
);
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M3.105 3.105a1.5 1.5 0 012.122-.001l12.12 12.12a1.5 1.5 0 01-2.122 2.122L3.105 5.227a1.5 1.5 0 01-.001-2.122zM3.105 16.895a1.5 1.5 0 01.001-2.122l12.12-12.12a1.5 1.5 0 012.122 2.122L5.227 16.895a1.5 1.5 0 01-2.122.001z" />
    </svg>
);

interface MessagePart {
    text: string;
}
interface ChatMessage {
    role: 'user' | 'model';
    parts: MessagePart[];
    timestamp: number;
}

const ChatbotFloating: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { isAuthenticated, isGuest } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const fetchInitialGreeting = async () => {
            if (isOpen && messages.length === 0 && !isLoading) {
                setIsLoading(true);
                setError(null);

                const triggerMessageText = "SYSTEM_TRIGGER_GREETING";

                try {
                    console.log("CLIENT: Triggering initial greeting...");
                    const response = await axiosInstance.post<ChatMessage>('/ai/chat', {
                        message: triggerMessageText,
                        history: [],
                    });

                    const modelGreetingMessage: ChatMessage = {
                        ...response.data,
                        timestamp: response.data.timestamp || Date.now(),
                    };
                    setMessages([modelGreetingMessage]);
                } catch (err: any) {
                    console.error("CLIENT: Error fetching initial greeting:", err);
                    const errorMessageText = err.response?.data?.parts?.[0]?.text || err.response?.data?.error || "Gagal memulai percakapan dengan AI.";
                    setError(errorMessageText);
                    setMessages([{ role: 'model', parts: [{ text: `Error: ${errorMessageText}` }], timestamp: Date.now() }]);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchInitialGreeting();
    }, [isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            parts: [{ text: trimmedInput }],
            timestamp: Date.now(),
        };

        const currentMessagesForHistory = [...messages];

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                message: userMessage.parts[0].text,
                history: currentMessagesForHistory.map(msg => ({ role: msg.role, parts: msg.parts })),
            };
            console.log("CLIENT: Sending payload:", JSON.stringify(payload, null, 2));

            const response = await axiosInstance.post<ChatMessage>('/ai/chat', payload);

            const modelMessage: ChatMessage = {
                ...response.data,
                timestamp: response.data.timestamp || Date.now(),
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (err: any) {
            console.error("CLIENT: Error sending message:", err);
            const errorMessageText = err.response?.data?.parts?.[0]?.text || err.response?.data?.error || "Maaf, terjadi kesalahan. Coba lagi nanti.";
            setError(errorMessageText);

            setMessages(prev => {
                return [...prev, { role: 'model', parts: [{ text: `Error: ${errorMessageText}` }], timestamp: Date.now() }];
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated || isGuest) {
        return null;
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-300 ease-in-out z-[1000]"
                aria-label={isOpen ? "Close Chat" : "Open Chat"}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>

            {isOpen && (
                <div className="fixed bottom-0 right-0 sm:bottom-20 sm:right-6 w-full sm:w-80 md:w-96 h-full sm:h-[calc(100vh-6rem)] max-h-[32rem] bg-white rounded-t-lg sm:rounded-lg shadow-xl flex flex-col border border-gray-300 z-[999] transform transition-all duration-300 ease-in-out origin-bottom-right">
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                        <h3 className="font-semibold text-md">Dompet Juara AI</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200" aria-label="Close chat">
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={`${msg.timestamp}-${index}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] p-2.5 rounded-xl text-sm shadow-sm ${
                                        msg.role === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    {msg.parts[0].text.split('\n').map((line, i, arr) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i < arr.length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-2.5 rounded-xl text-sm shadow bg-gray-200 text-gray-800 rounded-bl-none animate-pulse">
                                    <i>Mengetik...</i>
                                </div>
                            </div>
                        )}
                        {error && !isLoading && (
                             <div className="p-2 mt-2 text-sm text-red-700 bg-red-100 rounded-md">
                                {error}
                             </div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ketik pesan Anda..."
                                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                                disabled={isLoading}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                <SendIcon/>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatbotFloating;
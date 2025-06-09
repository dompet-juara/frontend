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


interface MessagePart {
    text: string;
}
interface ChatMessage {
    role: 'user' | 'model';
    parts: MessagePart[];
    timestamp?: number;
}

const ChatbotFloating: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const { isAuthenticated, isGuest } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { role: 'model', parts: [{ text: "Halo! Saya Dompet Juara AI. Ada yang bisa saya bantu terkait keuangan Anda?" }], timestamp: Date.now() }
            ]);
        }
    }, [isOpen]);


    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }], timestamp: Date.now() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const historyForBackend = messages.map(msg => ({ role: msg.role, parts: msg.parts }));

            const response = await axiosInstance.post('/ai/chat', {
                message: userMessage.parts[0].text,
                history: historyForBackend,
            });
            const modelMessage: ChatMessage = { ...response.data, timestamp: Date.now() };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error: any) {
            console.error("Error sending message:", error);
            const errorMessageText = error.response?.data?.parts?.[0]?.text || "Maaf, terjadi kesalahan. Coba lagi nanti.";
            setMessages(prev => [...prev, { role: 'model', parts: [{ text: errorMessageText }], timestamp: Date.now() }]);
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
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform duration-300 ease-in-out z-[1000]"
                aria-label={isOpen ? "Close Chat" : "Open Chat"}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>

            {isOpen && (
                <div className="fixed bottom-20 right-6 w-80 h-[28rem] bg-white rounded-lg shadow-xl flex flex-col border border-gray-300 z-[999] transform transition-all duration-300 ease-in-out origin-bottom-right">
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                        <h3 className="font-semibold text-md">Dompet Juara AI</h3>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] p-2.5 rounded-xl text-sm shadow ${
                                        msg.role === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    {msg.parts[0].text.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i < msg.parts[0].text.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-2.5 rounded-xl text-sm shadow bg-gray-200 text-gray-800 rounded-bl-none">
                                    <i>Mengetik...</i>
                                </div>
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
                                        handleSendMessage();
                                        e.preventDefault();
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-gray-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                    <path d="M3.105 3.105a1.5 1.5 0 012.122-.001l12.12 12.12a1.5 1.5 0 01-2.122 2.122L3.105 5.227a1.5 1.5 0 01-.001-2.122zM3.105 16.895a1.5 1.5 0 01.001-2.122l12.12-12.12a1.5 1.5 0 012.122 2.122L5.227 16.895a1.5 1.5 0 01-2.122.001z" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default ChatbotFloating;
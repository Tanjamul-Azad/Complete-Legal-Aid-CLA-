import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Message, User } from '../../types';
import {
    SendIcon, PaperClipIcon, MicIcon, PhoneIcon,
    CloseIcon, SearchIcon, CheckCircleIcon, VerifiedIcon
} from '../icons';

interface SecureChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    messages: Message[];
    allUsers: User[];
    onSendMessage: (text: string, receiverId: string) => void;
    markConversationAsRead: (senderId: string) => void;
    initialSelectedUserId?: string | null;
}

const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
};

export const SecureChatWidget: React.FC<SecureChatWidgetProps> = ({
    isOpen, onClose, currentUser, messages, allUsers, onSendMessage, markConversationAsRead, initialSelectedUserId
}) => {
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Update active conversation when initialSelectedUserId changes or widget opens
    useEffect(() => {
        if (isOpen && initialSelectedUserId) {
            setActiveConversationId(initialSelectedUserId);
        }
    }, [isOpen, initialSelectedUserId]);

    // Group messages by conversation
    const conversations = useMemo(() => {
        const map = new Map<string, { user: User, lastMessage: Message, unread: number }>();

        // Sort messages to get latest first
        const sorted = [...messages].sort((a, b) => b.timestamp - a.timestamp);

        sorted.forEach(msg => {
            const otherId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
            if (otherId === currentUser.id) return; // Should not happen based on logic, but safety check

            const otherUser = allUsers.find(u => u.id === otherId);
            if (!otherUser) return;

            if (!map.has(otherId)) {
                map.set(otherId, {
                    user: otherUser,
                    lastMessage: msg,
                    unread: 0
                });
            }

            if (msg.receiverId === currentUser.id && !msg.read) {
                const entry = map.get(otherId)!;
                entry.unread++;
            }
        });

        return Array.from(map.values());
    }, [messages, currentUser, allUsers]);

    // Set active conversation if only one exists or none selected
    useEffect(() => {
        if (isOpen && !activeConversationId && conversations.length > 0) {
            setActiveConversationId(conversations[0].user.id);
        }
    }, [isOpen, conversations, activeConversationId]);

    // Mark as read when opening conversation
    useEffect(() => {
        if (isOpen && activeConversationId) {
            markConversationAsRead(activeConversationId);
        }
    }, [isOpen, activeConversationId, markConversationAsRead]);

    // Scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeConversationId, isOpen]);

    const activeUser = allUsers.find(u => u.id === activeConversationId);

    const activeMessages = useMemo(() => {
        if (!activeConversationId) return [];
        return messages.filter(m =>
            (m.senderId === currentUser.id && m.receiverId === activeConversationId) ||
            (m.senderId === activeConversationId && m.receiverId === currentUser.id)
        ).sort((a, b) => a.timestamp - b.timestamp);
    }, [messages, currentUser, activeConversationId]);

    const handleSend = () => {
        if (!inputText.trim() || !activeConversationId) return;
        onSendMessage(inputText, activeConversationId);
        setInputText('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 pointer-events-none">
            {/* Backdrop for mobile */}
            <div className="absolute inset-0 bg-black/20 sm:bg-transparent pointer-events-auto sm:pointer-events-none" onClick={onClose} />

            {/* Widget Container */}
            <div className="pointer-events-auto w-full sm:w-[400px] h-[85vh] sm:h-[600px] bg-white dark:bg-[#111111] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-white/10 animate-slide-up sm:animate-scale-in origin-bottom-right">

                {/* Header */}
                {activeUser ? (
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#111111] flex items-center justify-between z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-cla-gold/10 flex items-center justify-center text-cla-gold">
                                <VerifiedIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    Secure Chat
                                    <span className="flex items-center gap-1 text-[10px] font-normal text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full border border-green-100 dark:border-green-900/30">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Online
                                    </span>
                                </h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Messages</h3>
                        <button onClick={onClose}><CloseIcon className="w-6 h-6" /></button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-[#0A0A0A]">
                    {!activeUser ? (
                        // Conversation List View
                        <div className="space-y-2">
                            {conversations.map(convo => (
                                <button
                                    key={convo.user.id}
                                    onClick={() => setActiveConversationId(convo.user.id)}
                                    className="w-full p-3 flex items-center gap-3 bg-white dark:bg-[#151515] rounded-xl hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors text-left border border-transparent hover:border-gray-200 dark:hover:border-white/5"
                                >
                                    <div className="relative">
                                        <img src={convo.user.avatar} alt={convo.user.name} className="w-12 h-12 rounded-full" />
                                        {convo.unread > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-[#151515]">{convo.unread}</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="font-bold text-gray-900 dark:text-white truncate">{convo.user.name}</span>
                                            <span className="text-xs text-gray-400">{formatTime(convo.lastMessage.timestamp)}</span>
                                        </div>
                                        <p className={`text-sm truncate ${convo.unread > 0 ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-500'}`}>
                                            {convo.lastMessage.senderId === currentUser.id && 'You: '}
                                            {convo.lastMessage.text}
                                        </p>
                                    </div>
                                </button>
                            ))}
                            {conversations.length === 0 && (
                                <div className="text-center py-10 text-gray-400">No conversations yet</div>
                            )}
                        </div>
                    ) : (
                        // Chat View
                        <>
                            {/* Date Separator (Mock for now, can be improved) */}
                            <div className="flex justify-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-[#151515] px-3 py-1 rounded-full">
                                    {activeMessages.length > 0 ? formatDate(activeMessages[0].timestamp) : 'Today'}
                                </span>
                            </div>

                            {activeMessages.map((msg, index) => {
                                const isMe = msg.senderId === currentUser.id;
                                const showAvatar = !isMe && (index === 0 || activeMessages[index - 1].senderId !== msg.senderId);

                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2 group`}>
                                        {!isMe && (
                                            <div className="w-8 mr-2 flex-shrink-0 flex flex-col justify-end">
                                                {showAvatar ? (
                                                    <img src={activeUser.avatar} alt={activeUser.name} className="w-8 h-8 rounded-full" />
                                                ) : <div className="w-8" />}
                                            </div>
                                        )}

                                        <div className={`max-w-[85%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            {/* Attachment Bubble */}
                                            {msg.attachment && (
                                                <div className={`mb-1 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity ${isMe
                                                    ? 'bg-cla-gold text-cla-text-darker'
                                                    : 'bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-white/10'
                                                    }`}>
                                                    <div className={`p-2 rounded-lg ${isMe ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/5'}`}>
                                                        <PaperClipIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-sm truncate max-w-[150px]">{msg.attachment.name}</p>
                                                        <p className="text-xs opacity-70">{Math.round(msg.attachment.size / 1024)} KB</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Text Bubble */}
                                            {msg.text && (
                                                <div className={`rounded-2xl px-4 py-2.5 text-sm relative shadow-sm ${isMe
                                                    ? 'bg-cla-gold text-cla-text-darker rounded-br-none'
                                                    : 'bg-white dark:bg-[#1A1A1A] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/5 rounded-bl-none'
                                                    }`}>
                                                    <p>{msg.text}</p>
                                                    <span className={`text-[10px] block text-right mt-1 opacity-70 ${isMe ? 'text-cla-text-darker' : 'text-gray-400'}`}>
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Footer Input */}
                {activeUser && (
                    <div className="p-3 bg-white dark:bg-[#111111] border-t border-gray-100 dark:border-white/5 flex items-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-cla-gold transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-white/5">
                            <PaperClipIcon className="w-5 h-5" />
                        </button>
                        <div className="flex-1 bg-gray-50 dark:bg-[#1A1A1A] rounded-2xl border border-transparent focus-within:border-cla-gold/50 focus-within:bg-white dark:focus-within:bg-black transition-all flex items-center">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type message..."
                                className="w-full bg-transparent border-none focus:ring-0 text-sm p-3 max-h-24 resize-none text-gray-900 dark:text-white placeholder-gray-400"
                                rows={1}
                            />
                        </div>
                        {inputText.trim() ? (
                            <button
                                onClick={handleSend}
                                className="p-2.5 bg-cla-gold text-cla-text-darker rounded-full shadow-lg shadow-cla-gold/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        ) : (
                            <button className="p-2 text-gray-400 hover:text-cla-gold transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-white/5">
                                <MicIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

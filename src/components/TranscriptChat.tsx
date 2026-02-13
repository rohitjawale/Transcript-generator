'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Message } from '@/lib/utils/transcript-parser'

interface ChatBubbleProps {
    message: Message
    index: number
}

export function ChatBubble({ message, index }: ChatBubbleProps) {
    const isMe = message.isMe

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.3,
                delay: Math.min(index * 0.05, 1),
                ease: "easeOut"
            }}
            className={cn(
                "flex w-full mb-4",
                isMe ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm",
                    isMe
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                )}
            >
                <div className="flex items-center gap-2 mb-1 opacity-70">
                    <span className="font-bold border-b border-current pb-0.5 text-[10px] uppercase tracking-wider">
                        {message.sender}
                    </span>
                </div>
                <div className="whitespace-pre-wrap">{message.text}</div>
                {message.timestamp && (
                    <div className={cn(
                        "text-[10px] mt-1 opacity-70",
                        isMe ? "text-right" : "text-left"
                    )}>
                        {message.timestamp}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

interface TranscriptChatProps {
    messages: Message[]
}

export function TranscriptChat({ messages }: TranscriptChatProps) {
    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400">
                <p>Chat bubbles will appear here once you paste a transcript.</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-1 py-4">
            {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} index={i} />
            ))}
        </div>
    )
}

'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Send } from 'lucide-react'
import React, { ReactNode, useRef, useState } from 'react'
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import Loader from '@/components/shared/loader'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { TraingAIPublicData } from '@/ai/public-traing'


function KendraBot({ headerRight }: { headerRight?: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<
        { role: "user" | "assistant"; text: string }[]
    >([{
        role: "assistant",
        text: `Hello, how can I assist you today? `,
    }]);


    // Initialize AI chat once per component lifecycle
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINIE_API_KEY });
    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: [...TraingAIPublicData, ...messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.text }],
        }))],
        config: {
            temperature: 0.5,
            maxOutputTokens: 1024,
        }
    });


    const fetchOpen = async () => {
        if (!input.trim()) { return };
        setLoading(true);
        setMessages((prev) => [...prev, { role: "user", text: input }]);
        try {
            endRef.current?.scrollIntoView({ behavior: 'smooth', block: "end" })
            const responseStream = await chat.sendMessageStream({
                message: input,
            });
            let assistantReply = "";
            for await (const chunk of responseStream) {
                // Append new chunk text
                assistantReply += chunk.text;
                setMessages((prev) => {
                    if (prev.length === 0 || prev[prev.length - 1].role !== "assistant") {
                        return [...prev, { role: "assistant", text: assistantReply }];
                    } else {
                        endRef.current?.scrollIntoView({ behavior: 'smooth', block: "end" })
                        return [
                            ...prev.slice(0, -1),
                            { role: "assistant", text: assistantReply },
                        ];
                    }
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setInput("");
        }
    };

    return (
        <div className={'w-full grow h-full flex flex-col p-2'}>
            <header className='h-[40px] flex items-center justify-between gap-2 border-b-2 pb-2'>
                <div className='flex gap-1 items-center'>
                    <Button variant={'outline'} size={'icon'}><Bot /></Button><h1 className='font-semibold'><span>Kendra</span><span className='text-primary'>Bot</span></h1>
                </div>
                {headerRight}
            </header>
            <main className='grow max-h-[calc(100svh-160px)] text-sm overflow-y-auto py-4 px-2 space-y-4'>
                {messages.map((item, index) => (
                    <div
                        key={index}
                        className={cn("border-2 w-fit  py-0.5 rounded-xl", {
                            "mr-auto rounded-tl-none": item.role === "assistant",
                            "ml-auto rounded-tr-none bg-primary/20": item.role === "user",
                        })}
                    >
                        <div className={cn("px-0.5 w-fit", {
                            "!ml-auto": item.role == 'user'
                        })}>
                            <Badge variant={'outline'} >{
                                item.role == "assistant" ? "KendraBot" : "You"
                            }</Badge>
                        </div>
                        <div className='px-3 py-1'>
                            <Markdown>{item.text}</Markdown>
                        </div>
                    </div>
                ))}
                <div ref={endRef} className='h-32'>{loading && <Loader />}</div>
            </main>
            <footer className='h-[100px] flex gap-1 pt-2'>
                <Textarea placeholder='Say somthing...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <Button
                    size={'icon'}
                    onClick={fetchOpen}
                    disabled={loading || !input.trim()}
                >
                    {loading ? <Loader /> : <Send />}
                </Button>
            </footer>
        </div>
    )
}
export default KendraBot



"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, MicOff, Send, Volume2, Bookmark, Copy, Sparkles, Loader2, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Navbar } from "@/components/layout/navbar"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: string[]
  confidence?: number
  saved?: boolean
}

export default function AskPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "नमस्ते! मैं KrishiGPT हूं, आपका AI कृषि सलाहकार। मैं आपकी खेती, मौसम, बाजार की कीमतों और सरकारी योजनाओं के बारे में मदद कर सकता हूं। आप हिंदी, अंग्रेजी या मिश्रित भाषा में पूछ सकते हैं।",
      timestamp: new Date(),
      confidence: 100,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [mounted, setMounted] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognition = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/ask")
    }
  }, [status, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognition.current = new (window as any).webkitSpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = "hi-IN"

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognition.current.onerror = () => {
        setIsListening(false)
        toast({
          title: "Voice input error",
          description: "Please try again or type your question",
          variant: "destructive",
        })
      }
    }
  }, [])

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading KrishiGPT...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        sources: data.sources,
        confidence: data.confidence,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Save to database
      await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.content,
          response: assistantMessage.content,
          sources: data.sources,
          confidence: data.confidence,
        }),
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true)
      recognition.current.start()
    }
  }

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop()
      setIsListening(false)
    }
  }

const speakText = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);

  const preferredVoiceNames = [
    "Google हिन्दी", // Chrome desktop
    "Microsoft Swara Online (Natural) - Hindi (India)", // Edge
    "Kiyara", // Apple
    "Lekha",
    "Google हिन्दी 1 (Natural)",
    "Google हिन्दी 2 (Natural)",
    "Chrome OS हिन्दी 1",
    "Microsoft Kalpana - Hindi (India)"
  ];

  const voices = speechSynthesis.getVoices();

  // Try to find the first matching preferred voice
  const matchedVoice = preferredVoiceNames
    .map(name => voices.find(v => v.name === name))
    .find(Boolean);

  if (matchedVoice) {
    utterance.voice = matchedVoice;
    console.log("✅ Using voice:", matchedVoice.name);
  } else {
    console.warn("⚠️ Hindi female voice not found. Using default voice.");
  }

  speechSynthesis.speak(utterance);
};





  const saveMessage = async (messageId: string) => {
    try {
      await fetch("/api/queries/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      })

      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, saved: true } : msg)))

      toast({
        title: "Saved!",
        description: "Message saved to your collection.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save message.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Message copied to clipboard.",
    })
  }

  const quickQuestions = [
    "आज बारिश होगी क्या?",
    "Wheat का market rate क्या है?",
    "PM-KISAN scheme के लिए कैसे apply करें?",
    "Kharif season के लिए best fertilizer?",
    "Cotton में pest control कैसे करें?",
    "Soil testing कहाँ कराएं?",
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center mr-3">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-lime-300 bg-clip-text text-transparent">
              Ask KrishiGPT
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Get instant answers about farming, weather, market prices, and government schemes in your preferred
            language.
          </p>
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setInput(question)}
                  className="p-3 text-left bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-green-500/50 rounded-lg transition-all duration-200 text-gray-300 hover:text-white text-sm"
                >
                  "{question}"
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Chat Messages */}
        <Card className="bg-gray-900/50 border-gray-800 mb-6">
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-6">
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                        <Avatar className="w-8 h-8 mx-3">
                          {message.role === "user" ? (
                            <AvatarImage src={session?.user?.image || ""} />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-black" />
                            </div>
                          )}
                          <AvatarFallback
                            className={
                              message.role === "user"
                                ? "bg-gray-700"
                                : "bg-gradient-to-br from-green-500 to-green-400 text-black"
                            }
                          >
                            {message.role === "user" ? session?.user?.name?.charAt(0) || "U" : "K"}
                          </AvatarFallback>
                        </Avatar>

                        <div
                          className={`rounded-lg px-4 py-3 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-green-500 to-green-400 text-black"
                              : "bg-gray-800 text-white"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>

                          {message.role === "assistant" && (
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {message.confidence && (
                                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                                    {message.confidence}% confident
                                  </Badge>
                                )}
                                {message.sources && (
                                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                                    {message.sources.length} sources
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => speakText(message.content)}
                                  className="h-8 w-8 p-0 hover:bg-gray-700"
                                >
                                  <Volume2 className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(message.content)}
                                  className="h-8 w-8 p-0 hover:bg-gray-700"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => saveMessage(message.id)}
                                  className="h-8 w-8 p-0 hover:bg-gray-700"
                                >
                                  <Bookmark
                                    className={`w-3 h-3 ${message.saved ? "fill-green-400 text-green-400" : ""}`}
                                  />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex">
                      <Avatar className="w-8 h-8 mr-3">
                        <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-black" />
                        </div>
                      </Avatar>
                      <div className="bg-gray-800 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                          <span className="text-gray-400">KrishiGPT is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Input Form */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about farming, weather, prices, schemes... (आप हिंदी में भी पूछ सकते हैं)"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-green-500 pr-12"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isLoading}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-red-400" />
                  ) : (
                    <Mic className="w-4 h-4 text-gray-400 hover:text-green-400" />
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-black"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </form>

            {isListening && (
              <div className="mt-3 text-center">
                <Badge variant="secondary" className="animate-pulse bg-red-500/20 text-red-400">
                  🎤 Listening... Speak now
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <AlertCircle className="w-4 h-4 mr-2" />
            KrishiGPT provides AI-generated advice. Always consult local experts for critical decisions.
          </div>
        </div>
      </div>
    </div>
  )
}

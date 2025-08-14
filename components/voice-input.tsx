"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  language?: string
  disabled?: boolean
}

export function VoiceInput({ onTranscript, language = "hi-IN", disabled = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const recognition = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      recognition.current = new (window as any).webkitSpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = language

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        onTranscript(transcript)
        setIsListening(false)
      }

      recognition.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        toast({
          title: "Voice input error",
          description: "Please try again or type your question",
          variant: "destructive",
        })
      }

      recognition.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [language, onTranscript])

  const startListening = () => {
    if (recognition.current && !disabled) {
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

  if (!recognition.current) {
    return null // Speech recognition not supported
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        type="button"
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className="flex items-center gap-2"
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4" />
            Stop
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Voice
          </>
        )}
      </Button>

      {isListening && (
        <Badge variant="secondary" className="animate-pulse">
          🎤 Listening... Speak now
        </Badge>
      )}
    </div>
  )
}

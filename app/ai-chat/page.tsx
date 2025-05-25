"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Brain,
  ArrowLeft,
  Trash2,
  Download,
  Settings,
  Lightbulb,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { aiChatAssistant, type ChatMessage } from "@/lib/ai-chat"
import { aiTrainingSystem } from "@/lib/ai-training"

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [trainingStats, setTrainingStats] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Load chat history and initialize
    const history = aiChatAssistant.getChatHistory()
    setMessages(history)
    setSuggestions(aiChatAssistant.getSuggestions())
    setTrainingStats(aiTrainingSystem.getTrainingStats())

    // Add welcome message if no history
    if (history.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content:
          "👋 Hello! I'm your AI Vision Assistant. I can help you with image analysis, model selection, training insights, and answer questions about computer vision. What would you like to explore today?",
        timestamp: Date.now(),
        metadata: { type: "general" },
      }
      setMessages([welcomeMessage])
      aiChatAssistant.addMessage(welcomeMessage)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    aiChatAssistant.addMessage(userMessage)
    setInputMessage("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(
      async () => {
        try {
          const response = await aiChatAssistant.generateResponse(inputMessage)
          setMessages((prev) => [...prev, response])
          setSuggestions(aiChatAssistant.getSuggestions())
        } catch (error) {
          console.error("Error generating response:", error)
          const errorMessage: ChatMessage = {
            id: `error_${Date.now()}`,
            role: "assistant",
            content: "I apologize, but I encountered an error. Please try again or rephrase your question.",
            timestamp: Date.now(),
          }
          setMessages((prev) => [...prev, errorMessage])
        } finally {
          setIsTyping(false)
        }
      },
      1000 + Math.random() * 1000,
    ) // Random delay for realism
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const useSuggestion = (suggestion: string) => {
    setInputMessage(suggestion)
    textareaRef.current?.focus()
  }

  const clearChat = () => {
    aiChatAssistant.clearHistory()
    setMessages([])
    setSuggestions(aiChatAssistant.getSuggestions())
  }

  const exportChat = () => {
    const chatData = {
      messages: messages,
      timestamp: new Date().toISOString(),
      trainingStats: trainingStats,
    }

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-chat-export-${Date.now()}.json`
    a.click()
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">AI Vision Assistant</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                <Bot className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <Button variant="outline" onClick={exportChat}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={clearChat}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>AI Vision Assistant</span>
                </CardTitle>
                <CardDescription>
                  Ask questions about computer vision, get model recommendations, and receive training insights
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.role === "assistant" && <Bot className="w-4 h-4 mt-1 text-blue-600" />}
                            {message.role === "user" && <User className="w-4 h-4 mt-1" />}
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              {message.metadata && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {message.metadata.type && (
                                    <Badge variant="outline" className="text-xs">
                                      {message.metadata.type}
                                    </Badge>
                                  )}
                                  {message.metadata.recommendedModel && (
                                    <Badge variant="secondary" className="text-xs">
                                      {message.metadata.recommendedModel}
                                    </Badge>
                                  )}
                                </div>
                              )}
                              <p className="text-xs opacity-70 mt-1">{formatTimestamp(message.timestamp)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4 text-blue-600" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="mt-4 space-y-3">
                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500 mt-1" />
                      {suggestions.map((suggestion, index) => {
                        const handleSuggestionClick = () => useSuggestion(suggestion)
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={handleSuggestionClick}
                            className="text-xs"
                          >
                            {suggestion}
                          </Button>
                        )
                      })}
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="flex space-x-2">
                    <Textarea
                      ref={textareaRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me about computer vision, models, training, or anything AI-related..."
                      className="flex-1 min-h-[60px] max-h-[120px]"
                      disabled={isTyping}
                    />
                    <Button onClick={sendMessage} disabled={!inputMessage.trim() || isTyping} size="lg">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Training Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>AI Training Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trainingStats && (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Training Samples:</span>
                      <span className="font-medium">{trainingStats.totalTrainingSamples}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Models Tracked:</span>
                      <span className="font-medium">{trainingStats.modelsTracked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Accuracy:</span>
                      <span className="font-medium">{(trainingStats.averageAccuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Update:</span>
                      <span className="font-medium">
                        {trainingStats.lastTrainingUpdate
                          ? new Date(trainingStats.lastTrainingUpdate).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/enhanced-classification">
                    <Brain className="w-4 h-4 mr-2" />
                    AI Classification
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/real-time-detection">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Live Detection
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/model-comparison">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Model Comparison
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/training-dashboard">
                    <Settings className="w-4 h-4 mr-2" />
                    Training Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Chat Features */}
            <Card>
              <CardHeader>
                <CardTitle>Chat Features</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Real-time AI responses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Vision task guidance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Model recommendations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Training insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span>Technical explanations</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

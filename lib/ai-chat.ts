export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: number
  metadata?: {
    type?: "vision" | "training" | "general"
    imageUrl?: string
    modelUsed?: string
    confidence?: number
  }
}

export interface ChatContext {
  currentModel?: string
  lastPrediction?: any[]
  userPreferences?: {
    preferredModel: string
    confidenceThreshold: number
    showTechnicalDetails: boolean
  }
}

export class AIChatAssistant {
  private chatHistory: ChatMessage[] = []
  private context: ChatContext = {}

  constructor() {
    this.loadChatHistory()
    this.initializeContext()
  }

  // Generate AI response based on user input
  async generateResponse(userMessage: string, context?: any): Promise<ChatMessage> {
    const response = await this.processUserMessage(userMessage, context)

    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: "assistant",
      content: response.content,
      timestamp: Date.now(),
      metadata: response.metadata,
    }

    this.addMessage(assistantMessage)
    return assistantMessage
  }

  // Process user message and generate appropriate response
  private async processUserMessage(message: string, context?: any): Promise<{ content: string; metadata?: any }> {
    const lowerMessage = message.toLowerCase()

    // Vision-related queries
    if (this.isVisionQuery(lowerMessage)) {
      return this.handleVisionQuery(message, context)
    }

    // Training-related queries
    if (this.isTrainingQuery(lowerMessage)) {
      return this.handleTrainingQuery(message, context)
    }

    // Model comparison queries
    if (this.isModelQuery(lowerMessage)) {
      return this.handleModelQuery(message, context)
    }

    // Technical help queries
    if (this.isTechnicalQuery(lowerMessage)) {
      return this.handleTechnicalQuery(message, context)
    }

    // General conversation
    return this.handleGeneralQuery(message, context)
  }

  private isVisionQuery(message: string): boolean {
    const visionKeywords = [
      "classify",
      "detect",
      "recognize",
      "identify",
      "analyze",
      "image",
      "photo",
      "picture",
      "object",
      "face",
      "text",
      "ocr",
      "segmentation",
      "classification",
      "detection",
    ]
    return visionKeywords.some((keyword) => message.includes(keyword))
  }

  private isTrainingQuery(message: string): boolean {
    const trainingKeywords = [
      "train",
      "learn",
      "improve",
      "accuracy",
      "feedback",
      "correct",
      "wrong",
      "better",
      "performance",
      "fine-tune",
      "optimize",
    ]
    return trainingKeywords.some((keyword) => message.includes(keyword))
  }

  private isModelQuery(message: string): boolean {
    const modelKeywords = [
      "model",
      "mobilenet",
      "coco",
      "efficientnet",
      "yolo",
      "compare",
      "which",
      "best",
      "fastest",
      "accurate",
      "recommend",
    ]
    return modelKeywords.some((keyword) => message.includes(keyword))
  }

  private isTechnicalQuery(message: string): boolean {
    const techKeywords = [
      "how",
      "why",
      "what",
      "tensorflow",
      "webgl",
      "browser",
      "performance",
      "fps",
      "confidence",
      "threshold",
      "parameters",
    ]
    return techKeywords.some((keyword) => message.includes(keyword))
  }

  private async handleVisionQuery(message: string, context?: any): Promise<{ content: string; metadata?: any }> {
    const responses = [
      "I can help you with computer vision tasks! Upload an image and I'll analyze it using our AI models. What would you like to detect or classify?",
      "Great! I'm ready to analyze images for you. You can use our classification models for identifying objects, or detection models for finding multiple objects in an image.",
      "Perfect! Our AI vision system can handle classification, object detection, face recognition, OCR, and more. What type of analysis do you need?",
      "I'd be happy to help with image analysis! Our TensorFlow.js models can process images in real-time. Would you like to try classification or detection?",
      "Excellent choice! Our vision AI can identify objects, read text, detect faces, and segment images. Upload an image to get started!",
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      content: randomResponse,
      metadata: { type: "vision" },
    }
  }

  private async handleTrainingQuery(message: string, context?: any): Promise<{ content: string; metadata?: any }> {
    const { aiTrainingSystem } = await import("./ai-training")
    const stats = aiTrainingSystem.getTrainingStats()

    const responses = [
      `Our AI models are continuously learning! We currently have ${stats.totalTrainingSamples} training samples with an average accuracy of ${(stats.averageAccuracy * 100).toFixed(1)}%. Your feedback helps improve the models.`,
      `The training system is working great! We're tracking ${stats.modelsTracked} models and they're getting better with each interaction. Would you like to provide feedback on recent predictions?`,
      `Fantastic question! Our models learn from user feedback. Current performance: ${(stats.averageAccuracy * 100).toFixed(1)}% accuracy across ${stats.totalTrainingSamples} samples. Keep the feedback coming!`,
      `The AI is definitely learning! Each time you correct a prediction or provide feedback, the models get smarter. We've processed ${stats.totalTrainingSamples} training examples so far.`,
      `Yes! The models adapt based on your feedback. Current stats: ${stats.modelsTracked} models trained, ${(stats.averageAccuracy * 100).toFixed(1)}% average accuracy. Your input makes them better!`,
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      content: randomResponse,
      metadata: { type: "training", ...stats },
    }
  }

  private async handleModelQuery(message: string, context?: any): Promise<{ content: string; metadata?: any }> {
    const modelRecommendations = [
      {
        condition: "speed",
        model: "MobileNet",
        reason: "fastest inference time (~20-50ms) and smallest size, perfect for real-time applications",
      },
      {
        condition: "accuracy",
        model: "EfficientNet",
        reason: "highest accuracy with good efficiency, ideal when precision matters most",
      },
      {
        condition: "detection",
        model: "COCO-SSD",
        reason: "excellent for detecting multiple objects with 80 different classes",
      },
      {
        condition: "faces",
        model: "BlazeFace",
        reason: "specialized for fast and accurate face detection",
      },
    ]

    const randomRec = modelRecommendations[Math.floor(Math.random() * modelRecommendations.length)]

    const responses = [
      `For ${randomRec.condition}, I recommend **${randomRec.model}** because it offers ${randomRec.reason}. Each model has its strengths - what's your priority?`,
      `Great question! **${randomRec.model}** excels at ${randomRec.condition} tasks due to ${randomRec.reason}. Would you like me to explain the differences between models?`,
      `Model selection depends on your needs! For ${randomRec.condition}, **${randomRec.model}** is ideal because ${randomRec.reason}. What type of task are you working on?`,
      `I'd suggest **${randomRec.model}** for ${randomRec.condition} because ${randomRec.reason}. Our model comparison page shows detailed benchmarks if you want to dive deeper!`,
    ]

    const randomResponse = responses[Math.floor(Math.random() * responses.length)]

    return {
      content: randomResponse,
      metadata: { type: "general", recommendedModel: randomRec.model },
    }
  }

  private async handleTechnicalQuery(message: string, context?: any): Promise<{ content: string; metadata?: any }> {
    const techResponses = [
      "Our platform uses TensorFlow.js with WebGL acceleration for optimal performance. Models run entirely in your browser - no data leaves your device!",
      "The magic happens with WebGL backend acceleration! TensorFlow.js converts models to run on your GPU, achieving 20-100ms inference times.",
      "Everything runs client-side using TensorFlow.js! This means your images stay private, processing is fast, and you can even use it offline.",
      "We use pre-trained models converted to TensorFlow.js format. The WebGL backend leverages your graphics card for neural network computations.",
      "The technical stack: TensorFlow.js for AI, WebGL for GPU acceleration, and optimized model architectures for browser deployment. Pretty cool, right?",
    ]

    const randomResponse = techResponses[Math.floor(Math.random() * techResponses.length)]

    return {
      content: randomResponse,
      metadata: { type: "general" },
    }
  }

  private async handleGeneralQuery(message: string, context?: any): Promise<{ content: string; metadata?: any }> {
    const generalResponses = [
      "I'm here to help with all your computer vision needs! Whether it's image classification, object detection, or understanding how the AI works, just ask!",
      "Hello! I'm your AI vision assistant. I can help you analyze images, choose the right models, understand results, and even train the AI to work better for you.",
      "Hi there! I specialize in computer vision and machine learning. Feel free to ask about image analysis, model performance, or how to get the best results!",
      "Welcome! I'm here to guide you through our AI vision platform. Upload images, ask questions, or let me know what you'd like to analyze!",
      "Great to meet you! I can assist with image classification, object detection, model selection, and explaining how everything works. What interests you most?",
    ]

    const randomResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)]

    return {
      content: randomResponse,
      metadata: { type: "general" },
    }
  }

  // Add message to chat history
  addMessage(message: ChatMessage): void {
    this.chatHistory.push(message)
    this.saveChatHistory()
  }

  // Get chat history
  getChatHistory(): ChatMessage[] {
    return this.chatHistory
  }

  // Clear chat history
  clearHistory(): void {
    this.chatHistory = []
    this.saveChatHistory()
  }

  // Update context
  updateContext(newContext: Partial<ChatContext>): void {
    this.context = { ...this.context, ...newContext }
  }

  // Get suggestions based on context
  getSuggestions(): string[] {
    const suggestions = [
      "Analyze this image for me",
      "Which model should I use for object detection?",
      "How accurate are the current models?",
      "Can you explain how the AI training works?",
      "What's the difference between MobileNet and EfficientNet?",
      "How can I improve the model accuracy?",
      "Show me the model performance statistics",
      "Help me choose the best confidence threshold",
    ]

    // Shuffle and return 4 random suggestions
    return suggestions.sort(() => 0.5 - Math.random()).slice(0, 4)
  }

  // Save chat history to localStorage
  private saveChatHistory(): void {
    try {
      localStorage.setItem("ai_chat_history", JSON.stringify(this.chatHistory))
    } catch (error) {
      console.warn("Could not save chat history:", error)
    }
  }

  // Load chat history from localStorage
  private loadChatHistory(): void {
    try {
      const saved = localStorage.getItem("ai_chat_history")
      if (saved) {
        this.chatHistory = JSON.parse(saved)
      }
    } catch (error) {
      console.warn("Could not load chat history:", error)
    }
  }

  // Initialize context
  private initializeContext(): void {
    this.context = {
      userPreferences: {
        preferredModel: "mobilenet",
        confidenceThreshold: 0.5,
        showTechnicalDetails: false,
      },
    }
  }
}

// Singleton instance
export const aiChatAssistant = new AIChatAssistant()

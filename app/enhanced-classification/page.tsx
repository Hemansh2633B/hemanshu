"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Brain, ArrowLeft, Zap, Target, Download, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react"
import Link from "next/link"
import { modelManager, MODELS, type Classification } from "@/lib/tensorflow-models"
import { aiTrainingSystem } from "@/lib/ai-training"

export default function EnhancedClassificationPage() {
  const [selectedModel, setSelectedModel] = useState("mobilenet")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Classification[]>([])
  const [modelStatus, setModelStatus] = useState<Record<string, boolean>>({})
  const [processingTime, setProcessingTime] = useState<number>(0)
  const [confidence, setConfidence] = useState(0.1)
  const [feedback, setFeedback] = useState<{ [key: string]: any }>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [userCorrection, setUserCorrection] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const classificationModels = Object.entries(MODELS).filter(([_, config]) => config.type === "classification")

  useEffect(() => {
    // Initialize TensorFlow and check model status
    const initTF = async () => {
      try {
        const { initializeTensorFlow } = await import("@/lib/tensorflow-models")
        await initializeTensorFlow()

        // Check which models are already loaded
        const status: Record<string, boolean> = {}
        Object.keys(MODELS).forEach((key) => {
          status[key] = modelManager.isModelLoaded(key)
        })
        setModelStatus(status)
      } catch (error) {
        console.error("Failed to initialize TensorFlow:", error)
      }
    }

    initTF()
  }, [])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setResults([])
      setShowFeedback(false)
      setFeedback({})
    }
  }

  const loadModel = async (modelKey: string) => {
    setIsLoading(true)
    try {
      await modelManager.loadModel(modelKey)
      await modelManager.warmupModel(modelKey)

      setModelStatus((prev) => ({ ...prev, [modelKey]: true }))
    } catch (error) {
      console.error(`Failed to load model ${modelKey}:`, error)
      alert(`Failed to load model: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const classifyImage = async () => {
    if (!selectedImage || !imageRef.current) return

    setIsProcessing(true)
    const startTime = performance.now()

    try {
      // Ensure model is loaded
      if (!modelManager.isModelLoaded(selectedModel)) {
        await loadModel(selectedModel)
      }

      // Perform classification
      let predictions = await modelManager.classifyImage(selectedModel, imageRef.current)

      // Apply training system enhancements
      predictions = aiTrainingSystem.generateDynamicPredictions(
        predictions.map((p) => ({ ...p, model: selectedModel })),
        selectedModel,
      )
      predictions = aiTrainingSystem.applyLearnedWeights(predictions, selectedModel)

      // Filter by confidence threshold
      const filteredResults = predictions.filter((pred) => pred.confidence >= confidence)

      setResults(filteredResults)
      setProcessingTime(performance.now() - startTime)
      setShowFeedback(true)
    } catch (error) {
      console.error("Classification failed:", error)
      alert(`Classification failed: ${error}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const submitFeedback = async (isCorrect: boolean, correctClass?: string) => {
    if (!imageRef.current || results.length === 0) return

    const feedbackData = {
      isCorrect,
      correctClass: correctClass || userCorrection,
      confidence: results[0]?.confidence || 0,
      userAnnotations: userCorrection ? [userCorrection] : [],
    }

    try {
      await aiTrainingSystem.collectTrainingData(
        imageRef.current,
        results.map((r) => ({ ...r, model: selectedModel })),
        feedbackData,
      )

      setFeedback({ submitted: true, isCorrect })

      // Auto-retrain if enough data
      const stats = aiTrainingSystem.getTrainingStats()
      if (stats.totalTrainingSamples % 10 === 0) {
        await aiTrainingSystem.fineTuneModel(selectedModel)
      }
    } catch (error) {
      console.error("Failed to submit feedback:", error)
    }
  }

  const exportResults = () => {
    const exportData = {
      model: selectedModel,
      image: selectedImage?.name,
      timestamp: new Date().toISOString(),
      processingTime,
      results: results.map((r) => ({
        class: r.class,
        confidence: (r.confidence * 100).toFixed(2) + "%",
        isLearned: r.isLearned || false,
        trainingDataPoints: r.trainingDataPoints || 0,
      })),
      feedback: feedback,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `classification-results-${Date.now()}.json`
    a.click()
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
              <Brain className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Enhanced AI Classification</h1>
              <Badge className="bg-green-100 text-green-800">
                <Brain className="w-3 h-3 mr-1" />
                Learning AI
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {results.length > 0 && (
                <>
                  <Badge variant="secondary">
                    <Zap className="w-3 h-3 mr-1" />
                    {processingTime.toFixed(0)}ms
                  </Badge>
                  <Button variant="outline" onClick={exportResults}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Link href="/ai-chat">
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ask AI
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Selection</CardTitle>
                <CardDescription>Choose a pre-trained TensorFlow.js model for classification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      {classificationModels.map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <div className="font-medium">{config.name}</div>
                              <div className="text-sm text-gray-500">
                                Input: {config.inputSize.join("x")} • Classes: {config.classes.length || "1000+"}
                              </div>
                            </div>
                            <Badge variant={modelStatus[key] ? "default" : "secondary"}>
                              {modelStatus[key] ? "Loaded" : "Not Loaded"}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {!modelStatus[selectedModel] && (
                    <Button onClick={() => loadModel(selectedModel)} disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-spin" />
                          Loading Model...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Load {MODELS[selectedModel]?.name}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image Upload</CardTitle>
                <CardDescription>Upload an image for AI-powered classification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          ref={imageRef}
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full max-h-96 mx-auto rounded-lg"
                          crossOrigin="anonymous"
                        />
                        <p className="text-sm text-gray-500">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="text-gray-500">Click to upload an image</p>
                        <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Confidence Threshold: {confidence.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0.01"
                        max="1"
                        step="0.01"
                        value={confidence}
                        onChange={(e) => setConfidence(Number.parseFloat(e.target.value))}
                        className="w-full mt-1"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={classifyImage}
                    disabled={!selectedImage || !modelStatus[selectedModel] || isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Brain className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Target className="w-5 h-5 mr-2" />
                        Classify with {MODELS[selectedModel]?.name}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Feedback Section */}
            {showFeedback && results.length > 0 && !feedback.submitted && (
              <Card>
                <CardHeader>
                  <CardTitle>Help Improve the AI</CardTitle>
                  <CardDescription>Your feedback helps train the model to be more accurate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      The AI thinks this image shows: <strong>{results[0]?.class.replace(/_/g, " ")}</strong>
                    </p>

                    <div className="flex space-x-4">
                      <Button onClick={() => submitFeedback(true)} variant="outline" className="flex-1">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        Correct
                      </Button>
                      <Button onClick={() => submitFeedback(false)} variant="outline" className="flex-1">
                        <ThumbsDown className="w-4 h-4 mr-2" />
                        Incorrect
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">What should it be? (optional)</label>
                      <Textarea
                        value={userCorrection}
                        onChange={(e) => setUserCorrection(e.target.value)}
                        placeholder="Enter the correct classification..."
                        className="min-h-[60px]"
                      />
                      {userCorrection && (
                        <Button onClick={() => submitFeedback(false, userCorrection)} className="w-full">
                          Submit Correction
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feedback Confirmation */}
            {feedback.submitted && (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        feedback.isCorrect ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {feedback.isCorrect ? <ThumbsUp className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                    </div>
                    <p className="font-medium">
                      {feedback.isCorrect ? "Thank you for confirming!" : "Thanks for the correction!"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Your feedback helps improve the AI model for everyone.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Classification Results</CardTitle>
                <CardDescription>
                  {results.length > 0
                    ? `${results.length} predictions from ${MODELS[selectedModel]?.name}`
                    : "Results will appear here after classification"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <Tabs defaultValue="predictions" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="predictions">Predictions</TabsTrigger>
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="predictions" className="mt-4">
                      <div className="space-y-3">
                        {results.map((result, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm capitalize">
                                  {result.class.replace(/_/g, " ")}
                                </span>
                                {result.isLearned && (
                                  <Badge variant="outline" className="text-xs">
                                    <Brain className="w-3 h-3 mr-1" />
                                    Learned
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="secondary">{(result.confidence * 100).toFixed(1)}%</Badge>
                            </div>
                            <Progress value={result.confidence * 100} className="h-2" />
                            {result.trainingDataPoints > 0 && (
                              <p className="text-xs text-gray-500">
                                Based on {result.trainingDataPoints} training samples
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="mt-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Model:</span>
                            <div className="font-medium">{MODELS[selectedModel]?.name}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Processing Time:</span>
                            <div className="font-medium">{processingTime.toFixed(0)}ms</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Top Prediction:</span>
                            <div className="font-medium">{(results[0]?.confidence * 100).toFixed(1)}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Predictions:</span>
                            <div className="font-medium">{results.length}</div>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-medium text-blue-600 mb-1">AI Confidence</h4>
                          <p className="text-sm">
                            The model is <strong>{(results[0]?.confidence * 100).toFixed(1)}%</strong> confident that
                            this image contains <strong>{results[0]?.class.replace(/_/g, " ")}</strong>.
                            {results[0]?.isLearned && (
                              <span className="block mt-1 text-blue-600">
                                This prediction uses learned improvements from user feedback.
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to see AI classification results</p>
                    <p className="text-sm mt-1">Powered by TensorFlow.js with learning capabilities</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Model Information */}
            <Card>
              <CardHeader>
                <CardTitle>Model Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Architecture:</span>
                    <span>{MODELS[selectedModel]?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Input Size:</span>
                    <span>{MODELS[selectedModel]?.inputSize.join("x")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classes:</span>
                    <span>{MODELS[selectedModel]?.classes.length || "1000+"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={modelStatus[selectedModel] ? "default" : "secondary"}>
                      {modelStatus[selectedModel] ? "Loaded" : "Not Loaded"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Framework:</span>
                    <span>TensorFlow.js</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Learning:</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Brain className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/ai-chat">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask AI Assistant
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/training-dashboard">
                    <Brain className="w-4 h-4 mr-2" />
                    Training Dashboard
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/real-time-detection">
                    <Target className="w-4 h-4 mr-2" />
                    Live Detection
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/model-comparison">
                    <Zap className="w-4 h-4 mr-2" />
                    Compare Models
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

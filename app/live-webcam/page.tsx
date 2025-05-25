"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Square, Play, Pause, Settings, ArrowLeft, Zap } from "lucide-react"
import Link from "next/link"

export default function LiveWebcamPage() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [selectedModel, setSelectedModel] = useState("coco")
  const [detections, setDetections] = useState<any[]>([])
  const [fps, setFps] = useState(0)
  const [confidence, setConfidence] = useState(0.5)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const models = [
    { value: "coco", label: "COCO (80 classes)", description: "General object detection" },
    { value: "yolo", label: "YOLO v8", description: "Fast real-time detection" },
    { value: "mobilenet", label: "MobileNet", description: "Lightweight for mobile" },
  ]

  const startDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsDetecting(true)

        // Start detection loop
        intervalRef.current = setInterval(() => {
          performDetection()
        }, 100) // 10 FPS
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  const stopDetection = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsDetecting(false)
    setDetections([])
    setFps(0)
  }

  const performDetection = () => {
    // Simulate real-time detection
    const mockDetections = [
      {
        class: "person",
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        bbox: [
          Math.floor(Math.random() * 200) + 50,
          Math.floor(Math.random() * 100) + 50,
          Math.floor(Math.random() * 200) + 250,
          Math.floor(Math.random() * 200) + 250,
        ],
      },
      {
        class: "laptop",
        confidence: Math.random() * 0.2 + 0.8, // 0.8-1.0
        bbox: [
          Math.floor(Math.random() * 150) + 300,
          Math.floor(Math.random() * 100) + 200,
          Math.floor(Math.random() * 150) + 450,
          Math.floor(Math.random() * 100) + 300,
        ],
      },
    ].filter((detection) => detection.confidence > confidence)

    setDetections(mockDetections)
    setFps(Math.floor(Math.random() * 5) + 25)
  }

  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (!canvas || !video || !isDetecting) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to match video
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    detections.forEach((detection) => {
      const [x1, y1, x2, y2] = detection.bbox

      // Draw bounding box
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1)

      // Draw label background
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(x1, y1 - 25, 120, 25)

      // Draw label text
      ctx.fillStyle = "white"
      ctx.font = "14px Arial"
      ctx.fillText(`${detection.class} ${(detection.confidence * 100).toFixed(0)}%`, x1 + 5, y1 - 8)
    })
  }

  useEffect(() => {
    if (isDetecting) {
      drawBoundingBoxes()
    }
  }, [detections, isDetecting])

  useEffect(() => {
    return () => {
      stopDetection()
    }
  }, [])

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
              <Camera className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Live Webcam Detection</h1>
            </div>
            <div className="flex items-center space-x-2">
              {isDetecting && (
                <Badge variant="secondary" className="animate-pulse">
                  <Zap className="w-3 h-3 mr-1" />
                  {fps} FPS
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Live Camera Feed</span>
                </CardTitle>
                <CardDescription>Real-time object detection using your webcam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }} // Mirror the video
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ transform: "scaleX(-1)" }} // Mirror the canvas too
                  />
                  {!isDetecting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Click Start to begin live detection</p>
                        <p className="text-sm opacity-75">Make sure to allow camera access</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center space-x-4 mt-6">
                  {!isDetecting ? (
                    <Button onClick={startDetection} size="lg" className="px-8">
                      <Play className="w-5 h-5 mr-2" />
                      Start Detection
                    </Button>
                  ) : (
                    <Button onClick={stopDetection} variant="destructive" size="lg" className="px-8">
                      <Pause className="w-5 h-5 mr-2" />
                      Stop Detection
                    </Button>
                  )}
                  <Button variant="outline" size="lg">
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Model Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Detection Model</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-sm text-gray-500">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Live Detections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Square className="w-5 h-5" />
                  <span>Live Detections</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {detections.length > 0 ? (
                  <div className="space-y-3">
                    {detections.map((detection, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <div className="font-medium capitalize">{detection.class}</div>
                          <div className="text-sm text-gray-500">
                            {(detection.confidence * 100).toFixed(1)}% confidence
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Live
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Square className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No objects detected</p>
                    <p className="text-sm">Objects will appear here during detection</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">FPS:</span>
                  <span className="font-medium">{fps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{selectedModel.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium">{confidence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={isDetecting ? "default" : "secondary"}>{isDetecting ? "Active" : "Stopped"}</Badge>
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
                  <Link href="/detection">
                    <Camera className="w-4 h-4 mr-2" />
                    Image Detection
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/results">
                    <Square className="w-4 h-4 mr-2" />
                    View Results
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/datasets">
                    <Settings className="w-4 h-4 mr-2" />
                    Model Settings
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

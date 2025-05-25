"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Camera, ArrowLeft, Zap, BarChart3, Download, Share2, Target, Timer, Cpu, Activity } from "lucide-react"
import Link from "next/link"

export default function AdvancedDetectionPage() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [selectedModels, setSelectedModels] = useState<string[]>(["yolo"])
  const [detections, setDetections] = useState<any[]>([])
  const [performance, setPerformance] = useState({
    fps: 0,
    latency: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    accuracy: 0,
  })
  const [settings, setSettings] = useState({
    confidence: 0.5,
    nmsThreshold: 0.4,
    maxDetections: 100,
    enableTracking: true,
    enableHeatmap: false,
    enableAnalytics: true,
    multiCamera: false,
  })
  const [analytics, setAnalytics] = useState({
    totalDetections: 0,
    uniqueObjects: new Set(),
    detectionHistory: [] as any[],
    performanceHistory: [] as any[],
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heatmapRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const models = [
    {
      value: "yolo",
      label: "YOLO v8",
      description: "Ultra-fast detection",
      accuracy: 94.2,
      speed: "45ms",
      size: "6.2MB",
    },
    {
      value: "efficientdet",
      label: "EfficientDet",
      description: "Balanced speed/accuracy",
      accuracy: 96.8,
      speed: "89ms",
      size: "15.1MB",
    },
    {
      value: "rcnn",
      label: "Faster R-CNN",
      description: "Highest accuracy",
      accuracy: 98.1,
      speed: "156ms",
      size: "42.3MB",
    },
    {
      value: "mobilenet",
      label: "MobileNet SSD",
      description: "Mobile optimized",
      accuracy: 89.7,
      speed: "23ms",
      size: "2.1MB",
    },
  ]

  const startAdvancedDetection = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsDetecting(true)

        // Start advanced detection loop with multiple models
        intervalRef.current = setInterval(() => {
          performAdvancedDetection()
          updatePerformanceMetrics()
        }, 33) // ~30 FPS
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const performAdvancedDetection = () => {
    // Simulate advanced multi-model detection
    const mockDetections = generateMockDetections()
    setDetections(mockDetections)

    // Update analytics
    setAnalytics((prev) => ({
      ...prev,
      totalDetections: prev.totalDetections + mockDetections.length,
      uniqueObjects: new Set([...prev.uniqueObjects, ...mockDetections.map((d) => d.class)]),
      detectionHistory: [
        ...prev.detectionHistory.slice(-100),
        {
          timestamp: Date.now(),
          count: mockDetections.length,
          objects: mockDetections.map((d) => d.class),
        },
      ],
    }))

    if (settings.enableHeatmap) {
      updateHeatmap(mockDetections)
    }
  }

  const generateMockDetections = () => {
    const classes = ["person", "car", "bicycle", "dog", "laptop", "phone", "book", "bottle"]
    const detections = []

    for (let i = 0; i < Math.floor(Math.random() * 8) + 1; i++) {
      const confidence = Math.random() * 0.4 + 0.6
      if (confidence > settings.confidence) {
        detections.push({
          id: Date.now() + i,
          class: classes[Math.floor(Math.random() * classes.length)],
          confidence,
          bbox: [
            Math.floor(Math.random() * 400),
            Math.floor(Math.random() * 300),
            Math.floor(Math.random() * 200) + 100,
            Math.floor(Math.random() * 200) + 100,
          ],
          model: selectedModels[Math.floor(Math.random() * selectedModels.length)],
          timestamp: Date.now(),
        })
      }
    }

    return detections.slice(0, settings.maxDetections)
  }

  const updatePerformanceMetrics = () => {
    setPerformance({
      fps: Math.floor(Math.random() * 10) + 25,
      latency: Math.floor(Math.random() * 50) + 20,
      cpuUsage: Math.floor(Math.random() * 30) + 40,
      memoryUsage: Math.floor(Math.random() * 20) + 60,
      accuracy: Math.random() * 5 + 92,
    })
  }

  const updateHeatmap = (detections: any[]) => {
    const canvas = heatmapRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create heatmap visualization
    ctx.globalAlpha = 0.1
    detections.forEach((detection) => {
      const [x, y, w, h] = detection.bbox
      const gradient = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h))
      gradient.addColorStop(0, "rgba(255, 0, 0, 0.8)")
      gradient.addColorStop(1, "rgba(255, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, w, h)
    })
  }

  const drawAdvancedBoundingBoxes = () => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (!canvas || !video || !isDetecting) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = video.videoWidth || 1920
    canvas.height = video.videoHeight || 1080

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    detections.forEach((detection, index) => {
      const [x, y, w, h] = detection.bbox
      const colors = {
        yolo: "#3b82f6",
        efficientdet: "#10b981",
        rcnn: "#f59e0b",
        mobilenet: "#ef4444",
      }
      const color = colors[detection.model as keyof typeof colors] || "#6b7280"

      // Draw bounding box with model-specific color
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.strokeRect(x, y, w, h)

      // Draw confidence bar
      const barWidth = w
      const barHeight = 4
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(x, y + h + 5, barWidth, barHeight)
      ctx.fillStyle = color
      ctx.fillRect(x, y + h + 5, barWidth * detection.confidence, barHeight)

      // Draw enhanced label
      ctx.fillStyle = color
      const text = `${detection.class} ${(detection.confidence * 100).toFixed(1)}%`
      const textMetrics = ctx.measureText(text)
      ctx.fillRect(x, y - 30, textMetrics.width + 20, 25)

      ctx.fillStyle = "white"
      ctx.font = "bold 14px Arial"
      ctx.fillText(text, x + 10, y - 10)

      // Draw model badge
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
      ctx.fillRect(x + w - 60, y, 60, 20)
      ctx.fillStyle = "white"
      ctx.font = "10px Arial"
      ctx.fillText(detection.model.toUpperCase(), x + w - 55, y + 14)

      // Draw tracking ID if enabled
      if (settings.enableTracking) {
        ctx.fillStyle = color
        ctx.fillRect(x - 25, y, 20, 20)
        ctx.fillStyle = "white"
        ctx.font = "bold 12px Arial"
        ctx.fillText(index.toString(), x - 20, y + 14)
      }
    })
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
  }

  const exportResults = () => {
    const data = {
      detections: analytics.detectionHistory,
      performance: analytics.performanceHistory,
      settings,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `detection-results-${Date.now()}.json`
    a.click()
  }

  useEffect(() => {
    if (isDetecting) {
      drawAdvancedBoundingBoxes()
    }
  }, [detections, isDetecting, settings])

  useEffect(() => {
    return () => stopDetection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <header className="border-b bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Target className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Advanced AI Detection</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isDetecting && (
                <>
                  <Badge variant="secondary" className="animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    {performance.fps} FPS
                  </Badge>
                  <Badge variant="outline">
                    <Timer className="w-3 h-3 mr-1" />
                    {performance.latency}ms
                  </Badge>
                  <Badge variant="outline">
                    <Cpu className="w-3 h-3 mr-1" />
                    {performance.cpuUsage}%
                  </Badge>
                </>
              )}
              <Button variant="outline" onClick={exportResults}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Video Area - Larger */}
          <div className="xl:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Camera className="w-5 h-5" />
                      <span>Multi-Model Detection</span>
                    </CardTitle>
                    <CardDescription>
                      Advanced real-time detection with {selectedModels.length} model(s)
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.enableHeatmap}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableHeatmap: checked }))}
                    />
                    <span className="text-sm">Heatmap</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  {settings.enableHeatmap && (
                    <canvas
                      ref={heatmapRef}
                      className="absolute top-0 left-0 w-full h-full opacity-60"
                      style={{ transform: "scaleX(-1)", mixBlendMode: "multiply" }}
                    />
                  )}

                  {!isDetecting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                      <div className="text-center text-white">
                        <Target className="w-20 h-20 mx-auto mb-4 opacity-50" />
                        <p className="text-xl mb-2">Advanced AI Detection Ready</p>
                        <p className="text-sm opacity-75">Multi-model inference with real-time analytics</p>
                      </div>
                    </div>
                  )}

                  {/* Performance Overlay */}
                  {isDetecting && (
                    <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-3 text-white text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>FPS: {performance.fps}</div>
                        <div>Latency: {performance.latency}ms</div>
                        <div>CPU: {performance.cpuUsage}%</div>
                        <div>Accuracy: {performance.accuracy.toFixed(1)}%</div>
                      </div>
                    </div>
                  )}

                  {/* Detection Counter */}
                  {isDetecting && (
                    <div className="absolute top-4 right-4 bg-blue-600/90 rounded-lg p-3 text-white">
                      <div className="text-2xl font-bold">{detections.length}</div>
                      <div className="text-xs">Objects</div>
                    </div>
                  )}
                </div>

                {/* Enhanced Controls */}
                <div className="flex items-center justify-center space-x-4 mt-6">
                  {!isDetecting ? (
                    <Button onClick={startAdvancedDetection} size="lg" className="px-8">
                      <Target className="w-5 h-5 mr-2" />
                      Start Advanced Detection
                    </Button>
                  ) : (
                    <Button onClick={stopDetection} variant="destructive" size="lg" className="px-8">
                      <Target className="w-5 h-5 mr-2" />
                      Stop Detection
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Model Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {models.map((model) => (
                  <div key={model.value} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedModels.includes(model.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedModels((prev) => [...prev, model.value])
                            } else {
                              setSelectedModels((prev) => prev.filter((m) => m !== model.value))
                            }
                          }}
                        />
                        <div>
                          <div className="font-medium text-sm">{model.label}</div>
                          <div className="text-xs text-gray-500">{model.description}</div>
                        </div>
                      </div>
                    </div>
                    {selectedModels.includes(model.value) && (
                      <div className="ml-6 space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Accuracy:</span>
                          <span>{model.accuracy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Speed:</span>
                          <span>{model.speed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>{model.size}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detection Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confidence Threshold: {settings.confidence.toFixed(2)}</label>
                  <Slider
                    value={[settings.confidence]}
                    onValueChange={([value]) => setSettings((prev) => ({ ...prev, confidence: value }))}
                    max={1}
                    min={0.1}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">NMS Threshold: {settings.nmsThreshold.toFixed(2)}</label>
                  <Slider
                    value={[settings.nmsThreshold]}
                    onValueChange={([value]) => setSettings((prev) => ({ ...prev, nmsThreshold: value }))}
                    max={1}
                    min={0.1}
                    step={0.05}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Detections: {settings.maxDetections}</label>
                  <Slider
                    value={[settings.maxDetections]}
                    onValueChange={([value]) => setSettings((prev) => ({ ...prev, maxDetections: value }))}
                    max={200}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Object Tracking</span>
                  <Switch
                    checked={settings.enableTracking}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableTracking: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analytics</span>
                  <Switch
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableAnalytics: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Live Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Detections:</span>
                    <span className="font-medium">{analytics.totalDetections}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Unique Objects:</span>
                    <span className="font-medium">{analytics.uniqueObjects.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Models:</span>
                    <span className="font-medium">{selectedModels.length}</span>
                  </div>
                </div>

                {settings.enableAnalytics && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU Usage</span>
                        <span>{performance.cpuUsage}%</span>
                      </div>
                      <Progress value={performance.cpuUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory Usage</span>
                        <span>{performance.memoryUsage}%</span>
                      </div>
                      <Progress value={performance.memoryUsage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Model Accuracy</span>
                        <span>{performance.accuracy.toFixed(1)}%</span>
                      </div>
                      <Progress value={performance.accuracy} className="h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Detections */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {detections.length > 0 ? (
                    detections.map((detection, index) => (
                      <div
                        key={detection.id}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{
                              backgroundColor:
                                {
                                  yolo: "#3b82f6",
                                  efficientdet: "#10b981",
                                  rcnn: "#f59e0b",
                                  mobilenet: "#ef4444",
                                }[detection.model] || "#6b7280",
                            }}
                          />
                          <span className="font-medium">{detection.class}</span>
                        </div>
                        <div className="text-right">
                          <div>{(detection.confidence * 100).toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">{detection.model}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No detections</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

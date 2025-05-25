"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Camera, ArrowLeft, Zap, Target, Settings, Square } from "lucide-react"
import Link from "next/link"
import { modelManager, drawBoundingBoxes, type Detection } from "@/lib/tensorflow-models"

export default function RealTimeDetectionPage() {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detections, setDetections] = useState<Detection[]>([])
  const [fps, setFps] = useState(0)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    confidenceThreshold: 0.5,
    maxDetections: 20,
    showLabels: true,
    showConfidence: true,
  })
  const [performance, setPerformance] = useState({
    inferenceTime: 0,
    totalDetections: 0,
    avgConfidence: 0,
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number>()
  const fpsCounterRef = useRef({ frames: 0, lastTime: 0 })

  const loadModel = useCallback(async () => {
    setIsLoading(true)
    try {
      await modelManager.loadModel("cocoSsd")
      await modelManager.warmupModel("cocoSsd")
      setModelLoaded(true)
    } catch (error) {
      console.error("Failed to load COCO-SSD model:", error)
      alert("Failed to load AI model. Please refresh and try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startDetection = async () => {
    try {
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsDetecting(true)

        // Start detection loop
        detectLoop()
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
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    setIsDetecting(false)
    setDetections([])
    setFps(0)
  }

  const detectLoop = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isDetecting) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video.readyState === 4) {
      const startTime = performance.now()

      try {
        // Perform object detection
        const predictions = await modelManager.detectObjects("cocoSsd", video)

        // Filter by confidence threshold
        const filteredDetections = predictions
          .filter((pred) => pred.confidence >= settings.confidenceThreshold)
          .slice(0, settings.maxDetections)

        setDetections(filteredDetections)

        // Update performance metrics
        const inferenceTime = performance.now() - startTime
        setPerformance((prev) => ({
          inferenceTime,
          totalDetections: prev.totalDetections + filteredDetections.length,
          avgConfidence:
            filteredDetections.length > 0
              ? filteredDetections.reduce((sum, det) => sum + det.confidence, 0) / filteredDetections.length
              : prev.avgConfidence,
        }))

        // Update canvas
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          if (settings.showLabels) {
            drawBoundingBoxes(canvas, filteredDetections)
          }
        }

        // Update FPS
        updateFPS()
      } catch (error) {
        console.error("Detection error:", error)
      }
    }

    if (isDetecting) {
      animationRef.current = requestAnimationFrame(detectLoop)
    }
  }, [isDetecting, settings])

  const updateFPS = () => {
    const now = performance.now()
    const counter = fpsCounterRef.current

    counter.frames++

    if (now - counter.lastTime >= 1000) {
      setFps(Math.round((counter.frames * 1000) / (now - counter.lastTime)))
      counter.frames = 0
      counter.lastTime = now
    }
  }

  useEffect(() => {
    loadModel()

    return () => {
      stopDetection()
    }
  }, [loadModel])

  useEffect(() => {
    if (isDetecting) {
      detectLoop()
    }
  }, [detectLoop, isDetecting])

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
              <h1 className="text-2xl font-bold">Real-Time AI Detection</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isDetecting && (
                <>
                  <Badge variant="secondary" className="animate-pulse">
                    <Zap className="w-3 h-3 mr-1" />
                    {fps} FPS
                  </Badge>
                  <Badge variant="outline">
                    <Target className="w-3 h-3 mr-1" />
                    {detections.length} objects
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Video Area */}
          <div className="xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Live AI Detection</span>
                </CardTitle>
                <CardDescription>Real-time object detection using TensorFlow.js COCO-SSD model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: "4/3" }}>
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

                  {!isDetecting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-xl mb-2">AI-Powered Object Detection</p>
                        <p className="text-sm opacity-75">
                          {modelLoaded ? "Click Start to begin detection" : "Loading AI model..."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Performance Overlay */}
                  {isDetecting && (
                    <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-3 text-white text-sm">
                      <div className="space-y-1">
                        <div>FPS: {fps}</div>
                        <div>Inference: {performance.inferenceTime.toFixed(0)}ms</div>
                        <div>Objects: {detections.length}</div>
                        {performance.avgConfidence > 0 && (
                          <div>Avg Confidence: {(performance.avgConfidence * 100).toFixed(1)}%</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4 mt-6">
                  {!isDetecting ? (
                    <Button onClick={startDetection} disabled={!modelLoaded || isLoading} size="lg" className="px-8">
                      {isLoading ? (
                        <>
                          <Target className="w-5 h-5 mr-2 animate-spin" />
                          Loading AI Model...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          Start AI Detection
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={stopDetection} variant="destructive" size="lg" className="px-8">
                      <Square className="w-5 h-5 mr-2" />
                      Stop Detection
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Detection Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Confidence Threshold: {settings.confidenceThreshold.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={settings.confidenceThreshold}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        confidenceThreshold: Number.parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Detections: {settings.maxDetections}</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={settings.maxDetections}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        maxDetections: Number.parseInt(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Show Labels</span>
                  <Switch
                    checked={settings.showLabels}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        showLabels: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Show Confidence</span>
                  <Switch
                    checked={settings.showConfidence}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        showConfidence: checked,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Live Detections */}
            <Card>
              <CardHeader>
                <CardTitle>Live Detections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {detections.length > 0 ? (
                    detections.map((detection, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                      >
                        <span className="font-medium capitalize">{detection.class}</span>
                        <Badge variant="secondary">{(detection.confidence * 100).toFixed(1)}%</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No objects detected</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>FPS:</span>
                    <span className="font-medium">{fps}</span>
                  </div>
                  <Progress value={Math.min((fps / 30) * 100, 100)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Inference Time:</span>
                    <span className="font-medium">{performance.inferenceTime.toFixed(0)}ms</span>
                  </div>
                  <Progress value={Math.max(0, 100 - performance.inferenceTime / 10)} className="h-2" />
                </div>

                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Total Detections:</span>
                    <span className="font-medium">{performance.totalDetections}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-medium">COCO-SSD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backend:</span>
                    <span className="font-medium">WebGL</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Model Info */}
            <Card>
              <CardHeader>
                <CardTitle>AI Model Info</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Architecture:</span>
                  <span>MobileNet + SSD</span>
                </div>
                <div className="flex justify-between">
                  <span>Classes:</span>
                  <span>80 (COCO)</span>
                </div>
                <div className="flex justify-between">
                  <span>Framework:</span>
                  <span>TensorFlow.js</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant={modelLoaded ? "default" : "secondary"}>{modelLoaded ? "Loaded" : "Loading"}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

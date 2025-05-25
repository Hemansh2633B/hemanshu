"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Car, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AutonomousPage() {
  const [selectedDataset, setSelectedDataset] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const datasets = [
    { value: "kitti", label: "KITTI (Autonomous Driving)", description: "Images, LiDAR, GPS for self-driving cars" },
    {
      value: "nuscenes",
      label: "nuScenes (Full Sensor Suite)",
      description: "3D object detection with radar and lidar",
    },
    { value: "bdd100k", label: "BDD100K (Diverse Driving)", description: "100K driving videos in diverse conditions" },
  ]

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const drawDrivingAnalysis = (analysis: any) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !imagePreview) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Draw lane lines
      if (analysis.laneLines) {
        ctx.strokeStyle = "#00FF00"
        ctx.lineWidth = 3
        analysis.laneLines.forEach((line: any) => {
          ctx.beginPath()
          ctx.moveTo(line.start.x, line.start.y)
          ctx.lineTo(line.end.x, line.end.y)
          ctx.stroke()
        })
      }

      // Draw object detections
      if (analysis.objects) {
        analysis.objects.forEach((obj: any, index: number) => {
          const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]
          const color = colors[index % colors.length]

          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.strokeRect(obj.bbox.x, obj.bbox.y, obj.bbox.width, obj.bbox.height)

          // Draw label
          ctx.fillStyle = color
          const text = `${obj.class} (${obj.distance}m)`
          const textWidth = ctx.measureText(text).width
          ctx.fillRect(obj.bbox.x, obj.bbox.y - 25, textWidth + 10, 25)

          ctx.fillStyle = "white"
          ctx.font = "12px Arial"
          ctx.fillText(text, obj.bbox.x + 5, obj.bbox.y - 8)
        })
      }

      // Draw depth map overlay (simplified)
      if (analysis.depthMap) {
        ctx.globalAlpha = 0.3
        ctx.fillStyle = "rgba(0, 100, 255, 0.3)"
        ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4)
        ctx.globalAlpha = 1.0
      }
    }
    img.src = imagePreview
  }

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedDataset) return

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const mockAnalysis = {
        objects: [
          {
            class: "car",
            confidence: 0.94,
            distance: 15.2,
            bbox: { x: 200, y: 150, width: 120, height: 80 },
          },
          {
            class: "pedestrian",
            confidence: 0.87,
            distance: 8.5,
            bbox: { x: 100, y: 180, width: 40, height: 100 },
          },
          {
            class: "traffic_sign",
            confidence: 0.91,
            distance: 12.0,
            bbox: { x: 350, y: 100, width: 30, height: 40 },
          },
        ],
        laneLines: [
          { start: { x: 0, y: 300 }, end: { x: 200, y: 250 } },
          { start: { x: 400, y: 250 }, end: { x: 640, y: 300 } },
        ],
        depthMap: true,
        drivingConditions: {
          weather: "clear",
          timeOfDay: "day",
          roadType: "urban",
          visibility: "good",
        },
        safetyScore: 85,
        recommendations: [
          "Maintain safe distance from vehicle ahead",
          "Monitor pedestrian on the right",
          "Observe speed limit sign",
        ],
      }
      setAnalysis(mockAnalysis)
      setIsProcessing(false)

      // Draw analysis after a short delay
      setTimeout(() => drawDrivingAnalysis(mockAnalysis), 100)
    }, 2500)
  }

  const getSafetyColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <Car className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Autonomous Driving Vision</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Autonomous Driving Model</CardTitle>
                <CardDescription>Choose the dataset and model for driving scene analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets.map((dataset) => (
                      <SelectItem key={dataset.value} value={dataset.value}>
                        <div>
                          <div className="font-medium">{dataset.label}</div>
                          <div className="text-sm text-gray-500">{dataset.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Driving Scene Upload</CardTitle>
                <CardDescription>Upload a driving scene image for autonomous vehicle analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="max-w-full max-h-64 mx-auto rounded-lg"
                        />
                        <canvas
                          ref={canvasRef}
                          className="absolute top-0 left-0 max-w-full max-h-64 mx-auto"
                          style={{ display: analysis ? "block" : "none" }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="text-gray-500">Click to upload a driving scene</p>
                        <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <input id="file-input" type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  <Button
                    onClick={handleAnalyze}
                    disabled={!selectedImage || !selectedDataset || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Car className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Scene...
                      </>
                    ) : (
                      <>
                        <Car className="w-4 h-4 mr-2" />
                        Analyze Driving Scene
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scene Analysis</CardTitle>
                <CardDescription>Autonomous driving scene understanding</CardDescription>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Safety Score</span>
                      <Badge className={getSafetyColor(analysis.safetyScore)}>{analysis.safetyScore}/100</Badge>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Detected Objects</h4>
                      {analysis.objects.map((obj: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{
                                backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][index % 5],
                              }}
                            />
                            <span className="capitalize">{obj.class}</span>
                          </div>
                          <div className="text-sm text-gray-500">{obj.distance}m</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Driving Conditions</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          Weather: <span className="capitalize">{analysis.drivingConditions.weather}</span>
                        </div>
                        <div>
                          Time: <span className="capitalize">{analysis.drivingConditions.timeOfDay}</span>
                        </div>
                        <div>
                          Road: <span className="capitalize">{analysis.drivingConditions.roadType}</span>
                        </div>
                        <div>
                          Visibility: <span className="capitalize">{analysis.drivingConditions.visibility}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Car className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload a driving scene to analyze</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Safety Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle>Model Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span>3D Object Detection + Lane Detection</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span>45ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Object Detection mAP:</span>
                      <span>0.92</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lane Detection Accuracy:</span>
                      <span>96.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

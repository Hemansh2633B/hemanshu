"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Scan, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DetectionPage() {
  const [selectedDataset, setSelectedDataset] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [detections, setDetections] = useState<any[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const datasets = [
    { value: "coco", label: "COCO Dataset (80 classes)", description: "330K+ images with bounding boxes" },
    { value: "pascal", label: "Pascal VOC (20 classes)", description: "Classic benchmark dataset" },
    { value: "openimages", label: "Open Images (600+ classes)", description: "9M+ images with labels" },
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

  const drawBoundingBoxes = (detections: any[]) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !imagePreview) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Draw bounding boxes
      detections.forEach((detection, index) => {
        const { bbox, class: className, confidence } = detection
        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]
        const color = colors[index % colors.length]

        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height)

        // Draw label background
        ctx.fillStyle = color
        const text = `${className} (${(confidence * 100).toFixed(1)}%)`
        const textWidth = ctx.measureText(text).width
        ctx.fillRect(bbox.x, bbox.y - 25, textWidth + 10, 25)

        // Draw label text
        ctx.fillStyle = "white"
        ctx.font = "14px Arial"
        ctx.fillText(text, bbox.x + 5, bbox.y - 8)
      })
    }
    img.src = imagePreview
  }

  const handleDetect = async () => {
    if (!selectedImage || !selectedDataset) return

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const mockDetections = [
        {
          class: "person",
          confidence: 0.92,
          bbox: { x: 100, y: 50, width: 200, height: 300 },
        },
        {
          class: "car",
          confidence: 0.85,
          bbox: { x: 350, y: 200, width: 150, height: 100 },
        },
        {
          class: "bicycle",
          confidence: 0.78,
          bbox: { x: 50, y: 180, width: 80, height: 120 },
        },
      ]
      setDetections(mockDetections)
      setIsProcessing(false)

      // Draw bounding boxes after a short delay
      setTimeout(() => drawBoundingBoxes(mockDetections), 100)
    }, 2000)
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
            <Scan className="w-6 h-6 text-green-600" />
            <h1 className="text-2xl font-bold">Object Detection</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detection Model</CardTitle>
                <CardDescription>Choose the dataset and model for object detection</CardDescription>
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
                <CardTitle>Image Upload</CardTitle>
                <CardDescription>Upload an image for object detection analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
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
                          style={{ display: detections.length > 0 ? "block" : "none" }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="text-gray-500">Click to upload an image</p>
                        <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                  <input id="file-input" type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  <Button
                    onClick={handleDetect}
                    disabled={!selectedImage || !selectedDataset || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Scan className="w-4 h-4 mr-2 animate-spin" />
                        Detecting Objects...
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4 mr-2" />
                        Detect Objects
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
                <CardTitle>Detection Results</CardTitle>
                <CardDescription>Objects detected in the uploaded image</CardDescription>
              </CardHeader>
              <CardContent>
                {detections.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500 mb-4">Found {detections.length} object(s)</div>
                    {detections.map((detection, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{
                              backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][index % 5],
                            }}
                          />
                          <span className="font-medium capitalize">{detection.class}</span>
                        </div>
                        <Badge variant="secondary">{(detection.confidence * 100).toFixed(1)}%</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Scan className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to detect objects</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {detections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Model Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span>YOLOv8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span>0.8s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence Threshold:</span>
                      <span>0.5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">mAP Score:</span>
                      <span>0.89</span>
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

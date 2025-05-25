"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Layers, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SegmentationPage() {
  const [selectedDataset, setSelectedDataset] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [segments, setSegments] = useState<any[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const datasets = [
    { value: "ade20k", label: "ADE20K (150 classes)", description: "Scene parsing with detailed annotations" },
    {
      value: "cityscapes",
      label: "Cityscapes (30 classes)",
      description: "Urban street scenes for autonomous driving",
    },
    { value: "lip", label: "LIP (20 classes)", description: "Human parsing dataset for body parts" },
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

  const drawSegmentation = (segments: any[]) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !imagePreview) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Draw segmentation overlay
      ctx.globalAlpha = 0.6
      segments.forEach((segment) => {
        ctx.fillStyle = segment.color
        // Mock segmentation regions (in real implementation, this would be pixel-level)
        const regions = segment.regions || []
        regions.forEach((region: any) => {
          ctx.fillRect(region.x, region.y, region.width, region.height)
        })
      })
      ctx.globalAlpha = 1.0
    }
    img.src = imagePreview
  }

  const handleSegment = async () => {
    if (!selectedImage || !selectedDataset) return

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const mockSegments = [
        {
          class: "road",
          pixels: 15420,
          percentage: 35.2,
          color: "#808080",
          regions: [{ x: 0, y: 300, width: 640, height: 180 }],
        },
        {
          class: "building",
          pixels: 8930,
          percentage: 20.4,
          color: "#8B4513",
          regions: [{ x: 100, y: 50, width: 400, height: 250 }],
        },
        {
          class: "sky",
          pixels: 12100,
          percentage: 27.6,
          color: "#87CEEB",
          regions: [{ x: 0, y: 0, width: 640, height: 150 }],
        },
        {
          class: "vegetation",
          pixels: 7350,
          percentage: 16.8,
          color: "#228B22",
          regions: [{ x: 500, y: 100, width: 140, height: 200 }],
        },
      ]
      setSegments(mockSegments)
      setIsProcessing(false)

      // Draw segmentation after a short delay
      setTimeout(() => drawSegmentation(mockSegments), 100)
    }, 2500)
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
            <Layers className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold">Image Segmentation</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Segmentation Model</CardTitle>
                <CardDescription>Choose the dataset and model for image segmentation</CardDescription>
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
                <CardDescription>Upload an image for segmentation analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
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
                          style={{ display: segments.length > 0 ? "block" : "none" }}
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
                    onClick={handleSegment}
                    disabled={!selectedImage || !selectedDataset || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Layers className="w-4 h-4 mr-2 animate-spin" />
                        Segmenting Image...
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4 mr-2" />
                        Segment Image
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
                <CardTitle>Segmentation Results</CardTitle>
                <CardDescription>Pixel-level segmentation analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {segments.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-500 mb-4">Found {segments.length} segment(s)</div>
                    {segments.map((segment, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: segment.color }} />
                            <span className="font-medium capitalize">{segment.class}</span>
                          </div>
                          <Badge variant="secondary">{segment.percentage.toFixed(1)}%</Badge>
                        </div>
                        <div className="text-xs text-gray-500">{segment.pixels.toLocaleString()} pixels</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${segment.percentage}%`,
                              backgroundColor: segment.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to perform segmentation</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {segments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Model Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span>U-Net</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span>2.1s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IoU Score:</span>
                      <span>0.87</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pixel Accuracy:</span>
                      <span>94.3%</span>
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

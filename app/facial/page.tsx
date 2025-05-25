"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FacialPage() {
  const [selectedDataset, setSelectedDataset] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [faces, setFaces] = useState<any[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const datasets = [
    { value: "celeba", label: "CelebA (40 attributes)", description: "Celebrity faces with attribute labels" },
    { value: "lfw", label: "LFW (Face verification)", description: "Labeled Faces in the Wild dataset" },
    { value: "affectnet", label: "AffectNet (7 emotions)", description: "Facial expressions and emotions" },
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

  const drawFaceBoxes = (faces: any[]) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx || !imagePreview) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Draw face bounding boxes
      faces.forEach((face, index) => {
        const { bbox } = face
        const color = "#FF6B6B"

        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height)

        // Draw label background
        ctx.fillStyle = color
        const text = `Face ${index + 1}`
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

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedDataset) return

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const mockFaces = [
        {
          emotion: "happy",
          confidence: 0.88,
          age: 25,
          gender: "female",
          attributes: ["smiling", "young", "attractive"],
          bbox: { x: 120, y: 80, width: 100, height: 120 },
        },
        {
          emotion: "neutral",
          confidence: 0.76,
          age: 35,
          gender: "male",
          attributes: ["beard", "glasses"],
          bbox: { x: 300, y: 60, width: 90, height: 110 },
        },
      ]
      setFaces(mockFaces)
      setIsProcessing(false)

      // Draw face boxes after a short delay
      setTimeout(() => drawFaceBoxes(mockFaces), 100)
    }, 2000)
  }

  const getEmotionColor = (emotion: string) => {
    const colors = {
      happy: "bg-green-100 text-green-800",
      sad: "bg-blue-100 text-blue-800",
      angry: "bg-red-100 text-red-800",
      surprised: "bg-yellow-100 text-yellow-800",
      neutral: "bg-gray-100 text-gray-800",
      fear: "bg-purple-100 text-purple-800",
      disgust: "bg-orange-100 text-orange-800",
    }
    return colors[emotion as keyof typeof colors] || "bg-gray-100 text-gray-800"
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
            <Users className="w-6 h-6 text-orange-600" />
            <h1 className="text-2xl font-bold">Facial Recognition & Analysis</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Facial Analysis Model</CardTitle>
                <CardDescription>Choose the dataset and model for facial recognition</CardDescription>
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
                <CardDescription>Upload an image for facial analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
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
                          style={{ display: faces.length > 0 ? "block" : "none" }}
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
                    onClick={handleAnalyze}
                    disabled={!selectedImage || !selectedDataset || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Users className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Faces...
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Analyze Faces
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
                <CardTitle>Facial Analysis Results</CardTitle>
                <CardDescription>Detected faces with emotion and attribute analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {faces.length > 0 ? (
                  <div className="space-y-6">
                    <div className="text-sm text-gray-500 mb-4">Found {faces.length} face(s)</div>
                    {faces.map((face, index) => (
                      <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Face {index + 1}</h4>
                          <Badge className={getEmotionColor(face.emotion)}>{face.emotion}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Age:</span>
                            <span className="ml-2 font-medium">{face.age} years</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Gender:</span>
                            <span className="ml-2 font-medium capitalize">{face.gender}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Confidence:</span>
                            <span className="ml-2 font-medium">{(face.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>

                        {face.attributes && (
                          <div>
                            <span className="text-gray-600 text-sm">Attributes:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {face.attributes.map((attr: string, attrIndex: number) => (
                                <Badge key={attrIndex} variant="outline" className="text-xs">
                                  {attr}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to analyze faces</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {faces.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Model Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span>FaceNet + EmotionNet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span>1.5s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Face Detection Accuracy:</span>
                      <span>97.8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emotion Accuracy:</span>
                      <span>89.2%</span>
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

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon, Brain, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ClassificationPage() {
  const [selectedDataset, setSelectedDataset] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const datasets = [
    { value: "imagenet", label: "ImageNet (1000 classes)", description: "14M+ labeled images" },
    { value: "cifar10", label: "CIFAR-10 (10 classes)", description: "60K small images" },
    { value: "cifar100", label: "CIFAR-100 (100 classes)", description: "60K small images" },
    { value: "tiny-imagenet", label: "Tiny ImageNet (200 classes)", description: "100K images, 64x64" },
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

  const handleClassify = async () => {
    if (!selectedImage || !selectedDataset) return

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        predictions: [
          { class: "Golden Retriever", confidence: 89.2 },
          { class: "Labrador Retriever", confidence: 76.8 },
          { class: "Dog", confidence: 95.1 },
          { class: "Canine", confidence: 88.5 },
          { class: "Pet", confidence: 82.3 },
        ],
        processingTime: "1.2s",
        modelUsed: selectedDataset.toUpperCase(),
      }
      setResults(mockResults)
      setIsProcessing(false)
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
            <Brain className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Image Classification</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Selection</CardTitle>
                <CardDescription>Choose the dataset and model for image classification</CardDescription>
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
                <CardDescription>Upload an image for classification analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full max-h-64 mx-auto rounded-lg"
                      />
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
                  <Button
                    onClick={handleClassify}
                    disabled={!selectedImage || !selectedDataset || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Classify Image
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
                <CardTitle>Classification Results</CardTitle>
                <CardDescription>AI-powered image classification predictions</CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Brain className="w-12 h-12 mx-auto text-blue-600 animate-pulse mb-4" />
                      <p className="text-gray-600">Analyzing image...</p>
                    </div>
                    <Progress value={75} className="w-full" />
                  </div>
                ) : results ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Model: {results.modelUsed}</span>
                      <span>Time: {results.processingTime}</span>
                    </div>
                    <div className="space-y-3">
                      {results.predictions.map((prediction: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{prediction.class}</span>
                            <Badge variant="secondary">{prediction.confidence.toFixed(1)}%</Badge>
                          </div>
                          <Progress value={prediction.confidence} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image and select a dataset to see classification results</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Model Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Architecture:</span>
                      <span>ResNet-50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parameters:</span>
                      <span>25.6M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Training Data:</span>
                      <span>{selectedDataset.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accuracy:</span>
                      <span>94.2%</span>
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

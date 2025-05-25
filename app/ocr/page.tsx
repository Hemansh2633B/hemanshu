"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, ArrowLeft, Copy } from "lucide-react"
import Link from "next/link"

export default function OCRPage() {
  const [selectedDataset, setSelectedDataset] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrResults, setOcrResults] = useState<any>(null)

  const datasets = [
    { value: "icdar", label: "ICDAR (Scene Text)", description: "Text detection in natural scenes" },
    { value: "synthtext", label: "SynthText (Synthetic)", description: "800K synthetic images with text" },
    { value: "coco-text", label: "COCO-Text", description: "Text in COCO dataset images" },
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

  const handleOCR = async () => {
    if (!selectedImage || !selectedDataset) return

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        extractedText: "STOP\nMain Street\nSpeed Limit 25\nNo Parking\nOne Way",
        textRegions: [
          {
            text: "STOP",
            confidence: 0.95,
            bbox: { x: 50, y: 30, width: 80, height: 40 },
          },
          {
            text: "Main Street",
            confidence: 0.87,
            bbox: { x: 20, y: 100, width: 120, height: 25 },
          },
          {
            text: "Speed Limit 25",
            confidence: 0.92,
            bbox: { x: 200, y: 150, width: 100, height: 20 },
          },
          {
            text: "No Parking",
            confidence: 0.89,
            bbox: { x: 30, y: 200, width: 90, height: 18 },
          },
          {
            text: "One Way",
            confidence: 0.84,
            bbox: { x: 250, y: 80, width: 70, height: 22 },
          },
        ],
        processingTime: "1.8s",
        totalCharacters: 42,
        wordsDetected: 8,
      }
      setOcrResults(mockResults)
      setIsProcessing(false)
    }, 2200)
  }

  const copyToClipboard = () => {
    if (ocrResults?.extractedText) {
      navigator.clipboard.writeText(ocrResults.extractedText)
    }
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
            <FileText className="w-6 h-6 text-red-600" />
            <h1 className="text-2xl font-bold">OCR & Text Detection</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>OCR Model</CardTitle>
                <CardDescription>Choose the dataset and model for text recognition</CardDescription>
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
                <CardDescription>Upload an image containing text for OCR analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-red-500 transition-colors"
                    onClick={() => document.getElementById("file-input")?.click()}
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
                  <input id="file-input" type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                  <Button
                    onClick={handleOCR}
                    disabled={!selectedImage || !selectedDataset || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <FileText className="w-4 h-4 mr-2 animate-spin" />
                        Extracting Text...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Extract Text
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
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>Text detected and extracted from the image</CardDescription>
              </CardHeader>
              <CardContent>
                {ocrResults ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {ocrResults.wordsDetected} words, {ocrResults.totalCharacters} characters
                      </span>
                      <Button size="sm" variant="outline" onClick={copyToClipboard}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={ocrResults.extractedText}
                      readOnly
                      className="min-h-32 font-mono text-sm"
                      placeholder="Extracted text will appear here..."
                    />
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to extract text</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {ocrResults && (
              <Card>
                <CardHeader>
                  <CardTitle>Text Regions</CardTitle>
                  <CardDescription>Individual text regions detected in the image</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ocrResults.textRegions.map((region: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{region.text}</div>
                          <div className="text-xs text-gray-500">
                            Position: ({region.bbox.x}, {region.bbox.y})
                          </div>
                        </div>
                        <Badge variant="secondary">{(region.confidence * 100).toFixed(1)}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {ocrResults && (
              <Card>
                <CardHeader>
                  <CardTitle>OCR Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span>CRNN + EAST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span>{ocrResults.processingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Text Detection Accuracy:</span>
                      <span>91.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Character Recognition:</span>
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

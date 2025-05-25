"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  ArrowLeft,
  Play,
  Pause,
  Download,
  FileImage,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function BatchProcessingPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedModel, setSelectedModel] = useState("yolo")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [results, setResults] = useState<any[]>([])
  const [processingStats, setProcessingStats] = useState({
    totalFiles: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    avgProcessingTime: 0,
    totalDetections: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const models = [
    { value: "yolo", label: "YOLO v8", speed: "Fast", accuracy: "High" },
    { value: "efficientdet", label: "EfficientDet", speed: "Medium", accuracy: "Very High" },
    { value: "rcnn", label: "Faster R-CNN", speed: "Slow", accuracy: "Highest" },
    { value: "mobilenet", label: "MobileNet SSD", speed: "Fastest", accuracy: "Medium" },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
    setResults([])
    setProcessingStats({
      totalFiles: files.length,
      processed: 0,
      successful: 0,
      failed: 0,
      avgProcessingTime: 0,
      totalDetections: 0,
    })
  }

  const startBatchProcessing = async () => {
    if (selectedFiles.length === 0) return

    setIsProcessing(true)
    setCurrentProgress(0)
    const newResults: any[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      // Mock processing result
      const success = Math.random() > 0.1 // 90% success rate
      const detections = success ? Math.floor(Math.random() * 8) + 1 : 0
      const processingTime = Math.floor(Math.random() * 2000) + 500

      const result = {
        id: i,
        filename: file.name,
        size: file.size,
        status: success ? "success" : "failed",
        detections: success
          ? Array.from({ length: detections }, (_, idx) => ({
              class: ["person", "car", "bicycle", "dog", "cat"][Math.floor(Math.random() * 5)],
              confidence: Math.random() * 0.3 + 0.7,
              bbox: [
                Math.floor(Math.random() * 400),
                Math.floor(Math.random() * 300),
                Math.floor(Math.random() * 200) + 100,
                Math.floor(Math.random() * 200) + 100,
              ],
            }))
          : [],
        processingTime,
        timestamp: new Date().toISOString(),
        model: selectedModel,
      }

      newResults.push(result)
      setResults([...newResults])

      // Update progress and stats
      const progress = ((i + 1) / selectedFiles.length) * 100
      setCurrentProgress(progress)

      setProcessingStats((prev) => ({
        ...prev,
        processed: i + 1,
        successful: prev.successful + (success ? 1 : 0),
        failed: prev.failed + (success ? 0 : 1),
        avgProcessingTime: newResults.reduce((sum, r) => sum + r.processingTime, 0) / newResults.length,
        totalDetections: prev.totalDetections + detections,
      }))
    }

    setIsProcessing(false)
  }

  const exportResults = () => {
    const exportData = {
      metadata: {
        totalFiles: processingStats.totalFiles,
        model: selectedModel,
        timestamp: new Date().toISOString(),
        stats: processingStats,
      },
      results: results,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `batch-results-${Date.now()}.json`
    a.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
              <FileImage className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-bold">Batch Processing</h1>
            </div>
            <div className="flex items-center space-x-4">
              {results.length > 0 && (
                <Button variant="outline" onClick={exportResults}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Results
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload and Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Images</CardTitle>
                <CardDescription>Select multiple images for batch processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-2">Click to upload images</p>
                    <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB each</p>
                    {selectedFiles.length > 0 && (
                      <p className="text-sm text-purple-600 mt-2">{selectedFiles.length} file(s) selected</p>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Model</CardTitle>
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
                          <div className="text-sm text-gray-500">
                            Speed: {model.speed} • Accuracy: {model.accuracy}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={startBatchProcessing}
                    disabled={selectedFiles.length === 0 || isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Start Batch Processing
                      </>
                    )}
                  </Button>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(currentProgress)}%</span>
                      </div>
                      <Progress value={currentProgress} className="w-full" />
                      <p className="text-sm text-gray-500">
                        Processing {processingStats.processed} of {processingStats.totalFiles} files
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Files:</span>
                    <span className="font-medium">{processingStats.totalFiles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processed:</span>
                    <span className="font-medium">{processingStats.processed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Successful:</span>
                    <span className="font-medium text-green-600">{processingStats.successful}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Failed:</span>
                    <span className="font-medium text-red-600">{processingStats.failed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Time:</span>
                    <span className="font-medium">{processingStats.avgProcessingTime.toFixed(0)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Detections:</span>
                    <span className="font-medium">{processingStats.totalDetections}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Processing Results</CardTitle>
                <CardDescription>
                  {results.length > 0
                    ? `${results.length} files processed`
                    : "Results will appear here after processing"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="list">List View</TabsTrigger>
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                  </TabsList>

                  <TabsContent value="list" className="mt-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {results.length > 0 ? (
                        results.map((result) => (
                          <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                {result.status === "success" ? (
                                  <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-red-500" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{result.filename}</div>
                                <div className="text-sm text-gray-500">
                                  {formatFileSize(result.size)} • {result.detections.length} detections
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={result.status === "success" ? "default" : "destructive"}>
                                {result.status}
                              </Badge>
                              <div className="text-sm text-gray-500 mt-1">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {result.processingTime}ms
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <FileImage className="w-16 h-16 mx-auto mb-4 opacity-30" />
                          <p>No results yet</p>
                          <p className="text-sm">Upload images and start processing to see results</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="grid" className="mt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {results.map((result) => (
                        <Card key={result.id} className="relative">
                          <CardContent className="p-4">
                            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                              <FileImage className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium text-sm truncate">{result.filename}</div>
                              <div className="text-xs text-gray-500">{result.detections.length} objects</div>
                              <Badge
                                variant={result.status === "success" ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {result.status}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

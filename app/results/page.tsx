"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Eye, Trash2 } from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const [results, setResults] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState("all")

  // Mock results data
  useEffect(() => {
    const mockResults = [
      {
        id: 1,
        type: "classification",
        dataset: "ImageNet",
        imagePath: "/placeholder.svg?height=200&width=200",
        predictions: [
          { class: "Golden Retriever", confidence: 0.89 },
          { class: "Labrador", confidence: 0.76 },
        ],
        timestamp: "2024-01-15T10:30:00Z",
      },
      {
        id: 2,
        type: "detection",
        dataset: "COCO",
        imagePath: "/placeholder.svg?height=200&width=200",
        detections: [
          { class: "person", confidence: 0.92 },
          { class: "car", confidence: 0.85 },
        ],
        timestamp: "2024-01-15T09:15:00Z",
      },
      {
        id: 3,
        type: "segmentation",
        dataset: "ADE20K",
        imagePath: "/placeholder.svg?height=200&width=200",
        segments: [
          { class: "road", pixels: 15420 },
          { class: "building", pixels: 8930 },
        ],
        timestamp: "2024-01-14T16:45:00Z",
      },
    ]
    setResults(mockResults)
  }, [])

  const filteredResults = selectedType === "all" ? results : results.filter((result) => result.type === selectedType)

  const getTypeColor = (type: string) => {
    const colors = {
      classification: "bg-blue-100 text-blue-800",
      detection: "bg-green-100 text-green-800",
      segmentation: "bg-purple-100 text-purple-800",
      facial: "bg-orange-100 text-orange-800",
      ocr: "bg-red-100 text-red-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
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
              <h1 className="text-2xl font-bold">Processing Results</h1>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <Tabs value={selectedType} onValueChange={setSelectedType} className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="detection">Detection</TabsTrigger>
            <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
            <TabsTrigger value="facial">Facial</TabsTrigger>
            <TabsTrigger value="ocr">OCR</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(result.type)}>{result.type}</Badge>
                  <span className="text-xs text-gray-500">{formatDate(result.timestamp)}</span>
                </div>
                <CardTitle className="text-lg">{result.dataset}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={result.imagePath || "/placeholder.svg"}
                      alt="Processed image"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Results Summary */}
                  <div className="space-y-2">
                    {result.type === "classification" && result.predictions && (
                      <div>
                        <p className="text-sm font-medium">Top Prediction:</p>
                        <p className="text-sm text-gray-600">
                          {result.predictions[0]?.class} ({(result.predictions[0]?.confidence * 100).toFixed(1)}%)
                        </p>
                      </div>
                    )}

                    {result.type === "detection" && result.detections && (
                      <div>
                        <p className="text-sm font-medium">Objects Found:</p>
                        <p className="text-sm text-gray-600">{result.detections.length} objects detected</p>
                      </div>
                    )}

                    {result.type === "segmentation" && result.segments && (
                      <div>
                        <p className="text-sm font-medium">Segments:</p>
                        <p className="text-sm text-gray-600">{result.segments.length} regions identified</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Eye className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No results found</h3>
            <p className="text-gray-500">Start processing images to see results here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

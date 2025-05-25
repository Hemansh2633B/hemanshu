"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, Zap, Target, HardDrive, Cpu, TrendingUp, Award } from "lucide-react"
import Link from "next/link"

export default function ModelComparisonPage() {
  const [selectedMetric, setSelectedMetric] = useState("accuracy")

  const models = [
    {
      name: "YOLO v8",
      category: "Object Detection",
      accuracy: 94.2,
      speed: 45,
      size: 6.2,
      memory: 512,
      fps: 67,
      mAP: 0.892,
      description: "Ultra-fast real-time object detection",
      strengths: ["Real-time performance", "Good accuracy", "Lightweight"],
      weaknesses: ["Lower accuracy than R-CNN", "Limited for small objects"],
      useCases: ["Live detection", "Mobile apps", "Edge devices"],
      color: "bg-blue-500",
    },
    {
      name: "EfficientDet",
      category: "Object Detection",
      accuracy: 96.8,
      speed: 89,
      size: 15.1,
      memory: 1024,
      fps: 34,
      mAP: 0.934,
      description: "Balanced efficiency and accuracy",
      strengths: ["High accuracy", "Efficient architecture", "Scalable"],
      weaknesses: ["Slower than YOLO", "More complex"],
      useCases: ["Production systems", "Batch processing", "High accuracy needs"],
      color: "bg-green-500",
    },
    {
      name: "Faster R-CNN",
      category: "Object Detection",
      accuracy: 98.1,
      speed: 156,
      size: 42.3,
      memory: 2048,
      fps: 18,
      mAP: 0.967,
      description: "Highest accuracy object detection",
      strengths: ["Highest accuracy", "Excellent for small objects", "Research standard"],
      weaknesses: ["Slow inference", "Large model size", "High memory usage"],
      useCases: ["Research", "Offline processing", "Critical applications"],
      color: "bg-yellow-500",
    },
    {
      name: "MobileNet SSD",
      category: "Object Detection",
      accuracy: 89.7,
      speed: 23,
      size: 2.1,
      memory: 256,
      fps: 89,
      mAP: 0.834,
      description: "Mobile-optimized detection",
      strengths: ["Extremely fast", "Tiny size", "Low memory"],
      weaknesses: ["Lower accuracy", "Limited features", "Simple architecture"],
      useCases: ["Mobile devices", "IoT", "Resource-constrained environments"],
      color: "bg-red-500",
    },
    {
      name: "ResNet-50",
      category: "Classification",
      accuracy: 94.8,
      speed: 67,
      size: 25.6,
      memory: 768,
      fps: 45,
      mAP: 0.948,
      description: "Standard classification backbone",
      strengths: ["Proven architecture", "Transfer learning", "Stable training"],
      weaknesses: ["Not optimized for speed", "Large size", "Older architecture"],
      useCases: ["Image classification", "Transfer learning", "Feature extraction"],
      color: "bg-purple-500",
    },
    {
      name: "Vision Transformer",
      category: "Classification",
      accuracy: 97.3,
      speed: 134,
      size: 86.4,
      memory: 1536,
      fps: 23,
      mAP: 0.973,
      description: "Transformer-based vision model",
      strengths: ["State-of-the-art accuracy", "Attention mechanism", "Scalable"],
      weaknesses: ["Very slow", "Huge model", "Requires lots of data"],
      useCases: ["Research", "High-accuracy classification", "Large datasets"],
      color: "bg-indigo-500",
    },
  ]

  const getMetricValue = (model: any, metric: string) => {
    switch (metric) {
      case "accuracy":
        return model.accuracy
      case "speed":
        return 200 - model.speed // Invert for better visualization
      case "size":
        return 100 - (model.size / 100) * 100 // Invert for better visualization
      case "memory":
        return 100 - (model.memory / 2048) * 100 // Invert for better visualization
      case "fps":
        return model.fps
      default:
        return model.accuracy
    }
  }

  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case "accuracy":
        return "Accuracy (%)"
      case "speed":
        return "Speed (lower is better)"
      case "size":
        return "Size Efficiency"
      case "memory":
        return "Memory Efficiency"
      case "fps":
        return "FPS"
      default:
        return "Accuracy (%)"
    }
  }

  const getBestModel = (metric: string) => {
    return models.reduce((best, current) =>
      getMetricValue(current, metric) > getMetricValue(best, metric) ? current : best,
    )
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
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">AI Model Comparison</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <Badge variant="outline">{model.category}</Badge>
                    </div>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-2 text-green-600" />
                          <span>Accuracy: {model.accuracy}%</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-blue-600" />
                          <span>Speed: {model.speed}ms</span>
                        </div>
                        <div className="flex items-center">
                          <HardDrive className="w-4 h-4 mr-2 text-purple-600" />
                          <span>Size: {model.size}MB</span>
                        </div>
                        <div className="flex items-center">
                          <Cpu className="w-4 h-4 mr-2 text-orange-600" />
                          <span>FPS: {model.fps}</span>
                        </div>
                      </div>

                      {/* Performance Bars */}
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Accuracy</span>
                            <span>{model.accuracy}%</span>
                          </div>
                          <Progress value={model.accuracy} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Speed Score</span>
                            <span>{Math.round(200 - model.speed)}/200</span>
                          </div>
                          <Progress value={200 - model.speed} className="h-2" />
                        </div>
                      </div>

                      {/* Strengths */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Strengths</h4>
                        <div className="flex flex-wrap gap-1">
                          {model.strengths.slice(0, 2).map((strength, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {strength}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-8">
            <div className="space-y-6">
              {/* Metric Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Comparison</CardTitle>
                  <CardDescription>Compare models across different metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { key: "accuracy", label: "Accuracy", icon: Target },
                      { key: "speed", label: "Speed", icon: Zap },
                      { key: "size", label: "Model Size", icon: HardDrive },
                      { key: "memory", label: "Memory Usage", icon: Cpu },
                      { key: "fps", label: "FPS", icon: TrendingUp },
                    ].map(({ key, label, icon: Icon }) => (
                      <Button
                        key={key}
                        variant={selectedMetric === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMetric(key)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </Button>
                    ))}
                  </div>

                  {/* Performance Chart */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{getMetricLabel(selectedMetric)}</h3>
                    {models.map((model, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded ${model.color}`} />
                            <span className="font-medium">{model.name}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {selectedMetric === "accuracy" && `${model.accuracy}%`}
                            {selectedMetric === "speed" && `${model.speed}ms`}
                            {selectedMetric === "size" && `${model.size}MB`}
                            {selectedMetric === "memory" && `${model.memory}MB`}
                            {selectedMetric === "fps" && `${model.fps} FPS`}
                          </span>
                        </div>
                        <Progress value={getMetricValue(model, selectedMetric)} className="h-3" />
                      </div>
                    ))}
                  </div>

                  {/* Best Model Highlight */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-600">Best for {getMetricLabel(selectedMetric)}</span>
                    </div>
                    <p className="text-sm">
                      <strong>{getBestModel(selectedMetric).name}</strong> performs best in this category with{" "}
                      {selectedMetric === "accuracy" && `${getBestModel(selectedMetric).accuracy}% accuracy`}
                      {selectedMetric === "speed" && `${getBestModel(selectedMetric).speed}ms inference time`}
                      {selectedMetric === "size" && `${getBestModel(selectedMetric).size}MB model size`}
                      {selectedMetric === "memory" && `${getBestModel(selectedMetric).memory}MB memory usage`}
                      {selectedMetric === "fps" && `${getBestModel(selectedMetric).fps} FPS`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="mt-8">
            <div className="space-y-6">
              {models.map((model, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${model.color}`} />
                        <span>{model.name}</span>
                      </CardTitle>
                      <Badge variant="outline">{model.category}</Badge>
                    </div>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Detailed Metrics */}
                      <div>
                        <h4 className="font-medium mb-3">Performance Metrics</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Accuracy:</span>
                            <span className="font-medium">{model.accuracy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Inference Speed:</span>
                            <span className="font-medium">{model.speed}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Model Size:</span>
                            <span className="font-medium">{model.size}MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Memory Usage:</span>
                            <span className="font-medium">{model.memory}MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>FPS:</span>
                            <span className="font-medium">{model.fps}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>mAP Score:</span>
                            <span className="font-medium">{model.mAP}</span>
                          </div>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div>
                        <h4 className="font-medium mb-3">Strengths</h4>
                        <div className="space-y-1">
                          {model.strengths.map((strength, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                              {strength}
                            </div>
                          ))}
                        </div>
                        <h4 className="font-medium mb-3 mt-4">Weaknesses</h4>
                        <div className="space-y-1">
                          {model.weaknesses.map((weakness, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                              {weakness}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Use Cases */}
                      <div>
                        <h4 className="font-medium mb-3">Best Use Cases</h4>
                        <div className="space-y-2">
                          {model.useCases.map((useCase, idx) => (
                            <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                              {useCase}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Use Case Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations by Use Case</CardTitle>
                  <CardDescription>Choose the best model for your specific needs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-green-600 mb-2">🚀 Real-time Applications</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      For live webcam detection, mobile apps, or edge devices
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-500">YOLO v8</Badge>
                      <Badge className="bg-red-500">MobileNet SSD</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-blue-600 mb-2">🎯 High Accuracy Needs</h4>
                    <p className="text-sm text-gray-600 mb-2">For critical applications where accuracy is paramount</p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-500">Faster R-CNN</Badge>
                      <Badge className="bg-indigo-500">Vision Transformer</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-purple-600 mb-2">⚖️ Balanced Performance</h4>
                    <p className="text-sm text-gray-600 mb-2">For production systems needing good accuracy and speed</p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500">EfficientDet</Badge>
                      <Badge className="bg-purple-500">ResNet-50</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-orange-600 mb-2">📱 Resource Constrained</h4>
                    <p className="text-sm text-gray-600 mb-2">For mobile devices, IoT, or limited hardware</p>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-red-500">MobileNet SSD</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Quick comparison across key metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Speed Leaders */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-blue-600" />
                        Fastest Models
                      </h4>
                      <div className="space-y-1">
                        {models
                          .sort((a, b) => a.speed - b.speed)
                          .slice(0, 3)
                          .map((model, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{model.name}</span>
                              <span className="text-blue-600">{model.speed}ms</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Accuracy Leaders */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-green-600" />
                        Most Accurate
                      </h4>
                      <div className="space-y-1">
                        {models
                          .sort((a, b) => b.accuracy - a.accuracy)
                          .slice(0, 3)
                          .map((model, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{model.name}</span>
                              <span className="text-green-600">{model.accuracy}%</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Size Leaders */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <HardDrive className="w-4 h-4 mr-2 text-purple-600" />
                        Most Compact
                      </h4>
                      <div className="space-y-1">
                        {models
                          .sort((a, b) => a.size - b.size)
                          .slice(0, 3)
                          .map((model, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{model.name}</span>
                              <span className="text-purple-600">{model.size}MB</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Overall Recommendation */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-blue-600" />
                        Overall Recommendation
                      </h4>
                      <p className="text-sm">
                        For most applications, <strong>EfficientDet</strong> offers the best balance of accuracy and
                        performance. Use <strong>YOLO v8</strong> for real-time needs or
                        <strong>Faster R-CNN</strong> when accuracy is critical.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

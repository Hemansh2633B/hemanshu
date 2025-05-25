"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  Target,
  Zap,
  Database,
  Settings,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { aiTrainingSystem, type ModelPerformance } from "@/lib/ai-training"

export default function TrainingDashboardPage() {
  const [trainingStats, setTrainingStats] = useState<any>(null)
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([])
  const [isTraining, setIsTraining] = useState(false)
  const [autoTrain, setAutoTrain] = useState(true)
  const [selectedModel, setSelectedModel] = useState<string>("")

  useEffect(() => {
    loadTrainingData()
  }, [])

  const loadTrainingData = () => {
    const stats = aiTrainingSystem.getTrainingStats()
    setTrainingStats(stats)
    setModelPerformance(stats.modelPerformance || [])
  }

  const startTraining = async (modelName?: string) => {
    setIsTraining(true)
    try {
      if (modelName) {
        await aiTrainingSystem.fineTuneModel(modelName)
      } else {
        // Train all models
        for (const model of modelPerformance) {
          await aiTrainingSystem.fineTuneModel(model.modelName)
        }
      }
      loadTrainingData()
    } catch (error) {
      console.error("Training failed:", error)
    } finally {
      setIsTraining(false)
    }
  }

  const clearTrainingData = () => {
    if (confirm("Are you sure you want to clear all training data? This cannot be undone.")) {
      aiTrainingSystem.clearTrainingData()
      loadTrainingData()
    }
  }

  const exportTrainingData = () => {
    const exportData = {
      stats: trainingStats,
      performance: modelPerformance,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `training-data-${Date.now()}.json`
    a.click()
  }

  const getPerformanceColor = (accuracy: number) => {
    if (accuracy >= 0.9) return "text-green-600"
    if (accuracy >= 0.8) return "text-yellow-600"
    return "text-red-600"
  }

  const getPerformanceIcon = (accuracy: number) => {
    if (accuracy >= 0.9) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (accuracy >= 0.8) return <Target className="w-4 h-4 text-yellow-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
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
              <Brain className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">AI Training Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Auto-train:</span>
                <Switch checked={autoTrain} onCheckedChange={setAutoTrain} />
              </div>
              <Button variant="outline" onClick={exportTrainingData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={clearTrainingData}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
            <TabsTrigger value="training">Training Control</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Stats Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Training Samples</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{trainingStats?.totalTrainingSamples || 0}</div>
                  <p className="text-xs text-muted-foreground">Collected from user feedback</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Models Tracked</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{trainingStats?.modelsTracked || 0}</div>
                  <p className="text-xs text-muted-foreground">Active AI models</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{((trainingStats?.averageAccuracy || 0) * 100).toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Across all models</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Training Status</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isTraining ? "Active" : "Ready"}</div>
                  <p className="text-xs text-muted-foreground">
                    {isTraining ? "Training in progress" : "Ready to train"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Model Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Overview</CardTitle>
                <CardDescription>Current accuracy and training status for each AI model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelPerformance.map((model) => (
                    <div key={model.modelName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getPerformanceIcon(model.accuracy)}
                        <div>
                          <h4 className="font-medium capitalize">{model.modelName}</h4>
                          <p className="text-sm text-gray-500">
                            {model.totalPredictions} predictions • {model.correctPredictions} correct
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getPerformanceColor(model.accuracy)}`}>
                          {(model.accuracy * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-500">
                          Avg confidence: {(model.avgConfidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modelPerformance.map((model) => (
                <Card key={model.modelName}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="capitalize">{model.modelName}</CardTitle>
                      <Badge
                        variant={
                          model.accuracy >= 0.9 ? "default" : model.accuracy >= 0.8 ? "secondary" : "destructive"
                        }
                      >
                        {(model.accuracy * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accuracy</span>
                        <span>{(model.accuracy * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={model.accuracy * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Confidence</span>
                        <span>{(model.avgConfidence * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={model.avgConfidence * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Predictions:</span>
                        <div className="font-medium">{model.totalPredictions}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Correct:</span>
                        <div className="font-medium">{model.correctPredictions}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Updated:</span>
                        <div className="font-medium">{new Date(model.lastUpdated).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => startTraining(model.modelName)}
                      disabled={isTraining}
                      className="w-full"
                      variant="outline"
                    >
                      {isTraining ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Training...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Fine-tune Model
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="training" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Training Controls</CardTitle>
                  <CardDescription>Manage AI model training and optimization</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Button onClick={() => startTraining()} disabled={isTraining} className="w-full" size="lg">
                      {isTraining ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Training All Models...
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5 mr-2" />
                          Train All Models
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auto-training</span>
                      <Switch checked={autoTrain} onCheckedChange={setAutoTrain} />
                    </div>

                    <div className="text-sm text-gray-600">
                      {autoTrain
                        ? "Models will automatically retrain when enough new feedback is collected."
                        : "Manual training required. Models won't update automatically."}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Training Requirements</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Minimum 10 feedback samples per model</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Balanced positive and negative feedback</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span>Recent user interactions (last 30 days)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training Progress</CardTitle>
                  <CardDescription>Current training status and progress</CardDescription>
                </CardHeader>
                <CardContent>
                  {isTraining ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <RefreshCw className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
                        <p className="text-lg font-medium">Training in Progress</p>
                        <p className="text-sm text-gray-500">Optimizing model parameters...</p>
                      </div>
                      <Progress value={75} className="w-full" />
                      <div className="text-sm text-center text-gray-500">
                        Processing training data and updating weights
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium">Ready to Train</p>
                      <p className="text-sm text-gray-500">
                        {trainingStats?.totalTrainingSamples || 0} samples available for training
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Training Analytics</CardTitle>
                  <CardDescription>Detailed insights into model performance and training data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {trainingStats?.totalTrainingSamples || 0}
                        </div>
                        <div className="text-sm text-blue-600">Total Samples</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {((trainingStats?.averageAccuracy || 0) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-green-600">Avg Accuracy</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Model Comparison</h4>
                      {modelPerformance.map((model) => (
                        <div key={model.modelName} className="flex items-center justify-between">
                          <span className="capitalize text-sm">{model.modelName}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${model.accuracy * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Overall system performance and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">Training System</span>
                      </div>
                      <Badge variant="default">Healthy</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Database className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Data Collection</span>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        <span className="text-sm font-medium">Model Performance</span>
                      </div>
                      <Badge variant="outline">Good</Badge>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span>Collect more feedback for models with low accuracy</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span>Enable auto-training for continuous improvement</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <span>Regular training sessions improve accuracy</span>
                        </div>
                      </div>
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

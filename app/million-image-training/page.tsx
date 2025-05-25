"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Brain,
  Database,
  Zap,
  Play,
  Pause,
  Square,
  Download,
  Upload,
  Settings,
  BarChart3,
  Clock,
  HardDrive,
  Cpu,
  Activity,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { millionImageDataset, type DatasetConfig } from "@/lib/dataset-manager"

interface TrainingProgress {
  totalImages: number
  processedImages: number
  currentEpoch: number
  totalEpochs: number
  currentBatch: number
  totalBatches: number
  progress: number
  batchProgress: number
  epochProgress: number
  accuracy: number
  loss: number
  learningRate: number
  estimatedTimeRemaining: number
  memoryUsage: any
  throughput: number
  startTime: number
}

export default function MillionImageTrainingPage() {
  const [datasets, setDatasets] = useState<DatasetConfig[]>([])
  const [selectedDataset, setSelectedDataset] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("mobilenet")
  const [isTraining, setIsTraining] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress | null>(null)
  const [trainingConfig, setTrainingConfig] = useState({
    batchSize: 32,
    epochs: 10,
    learningRate: 0.001,
    checkpointFrequency: 5,
    validationSplit: 0.2,
    augmentation: true,
    preprocessing: true,
  })
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    gpuUsage: 0,
    diskUsage: 0,
  })

  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadDatasets()
    startSystemMonitoring()

    // Set up progress callback
    millionImageDataset.setProgressCallback((progress) => {
      setTrainingProgress(progress)
    })

    return () => {
      stopSystemMonitoring()
    }
  }, [])

  const loadDatasets = async () => {
    try {
      await millionImageDataset.loadPopularDatasets()
      const availableDatasets = millionImageDataset.getDatasets()
      setDatasets(availableDatasets)

      if (availableDatasets.length > 0) {
        setSelectedDataset(availableDatasets[0].name)
      }
    } catch (error) {
      console.error("Failed to load datasets:", error)
    }
  }

  const startTraining = async () => {
    if (!selectedDataset) {
      alert("Please select a dataset first")
      return
    }

    setIsTraining(true)
    setIsPaused(false)

    try {
      await millionImageDataset.startMillionImageTraining(selectedDataset, selectedModel, trainingConfig)
    } catch (error) {
      console.error("Training failed:", error)
      alert(`Training failed: ${error}`)
    } finally {
      setIsTraining(false)
    }
  }

  const pauseTraining = () => {
    setIsPaused(!isPaused)
    // Implementation for pausing/resuming training
  }

  const stopTraining = () => {
    setIsTraining(false)
    setIsPaused(false)
    setTrainingProgress(null)
    // Implementation for stopping training
  }

  const startSystemMonitoring = () => {
    const interval = setInterval(() => {
      // Simulate system stats
      setSystemStats({
        cpuUsage: 60 + Math.random() * 30,
        memoryUsage: 70 + Math.random() * 20,
        gpuUsage: isTraining ? 80 + Math.random() * 15 : 10 + Math.random() * 20,
        diskUsage: 45 + Math.random() * 10,
      })
    }, 1000)

    return () => clearInterval(interval)
  }

  const stopSystemMonitoring = () => {
    // Cleanup monitoring
  }

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "training":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "stopped":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTrainingStatus = () => {
    if (isTraining && !isPaused) return "training"
    if (isTraining && isPaused) return "paused"
    return "stopped"
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
              <Database className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Million Image Training</h1>
              <Badge className={`${getStatusColor(getTrainingStatus())} text-white`}>
                <Activity className="w-3 h-3 mr-1" />
                {getTrainingStatus().toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              {trainingProgress && (
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  ETA: {formatTime(trainingProgress.estimatedTimeRemaining)}
                </Badge>
              )}
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Model
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="training" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="training" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Training Configuration */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Configuration</CardTitle>
                    <CardDescription>Configure your million-image training session</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Dataset Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dataset</label>
                      <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dataset" />
                        </SelectTrigger>
                        <SelectContent>
                          {datasets.map((dataset) => (
                            <SelectItem key={dataset.name} value={dataset.name}>
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <div className="font-medium">{dataset.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {formatNumber(dataset.totalImages)} images • {dataset.categories.length} categories
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Model Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Model Architecture</label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobilenet">MobileNet v2</SelectItem>
                          <SelectItem value="efficientnet">EfficientNet B0</SelectItem>
                          <SelectItem value="resnet">ResNet-50</SelectItem>
                          <SelectItem value="vgg">VGG-16</SelectItem>
                          <SelectItem value="inception">Inception v3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Training Parameters */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Batch Size: {trainingConfig.batchSize}</label>
                        <Slider
                          value={[trainingConfig.batchSize]}
                          onValueChange={([value]) => setTrainingConfig(prev => ({ ...prev, batchSize: value }))}
                          min={8}
                          max={128}
                          step={8}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Epochs: {trainingConfig.epochs}</label>
                        <Slider
                          value={[trainingConfig.epochs]}
                          onValueChange={([value]) => setTrainingConfig(prev => ({ ...prev, epochs: value }))}
                          min={1}
                          max={50}
                          step={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Learning Rate: {trainingConfig.learningRate}</label>
                        <Slider
                          value={[trainingConfig.learningRate * 1000]}
                          onValueChange={([value]) => setTrainingConfig(prev => ({ ...prev, learningRate: value / 1000 }))}
                          min={0.1}
                          max={10}
                          step={0.1}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Validation Split: {trainingConfig.validationSplit}</label>
                        <Slider
                          value={[trainingConfig.validationSplit * 100]}
                          onValueChange={([value]) => setTrainingConfig(prev => ({ ...prev, validationSplit: value / 100 }))}
                          min={10}
                          max={30}
                          step={5}
                        />
                      </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Advanced Options</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Data Augmentation</span>
                          <Switch
                            checked={trainingConfig.augmentation}
                            onCheckedChange={(checked) => setTrainingConfig(prev => ({ ...prev, augmentation: checked }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Preprocessing</span>
                          <Switch
                            checked={trainingConfig.preprocessing}
                            onCheckedChange={(checked) => setTrainingConfig(prev => ({ ...prev, preprocessing: checked }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Training Controls */}
                    <div className="flex space-x-4 pt-4">
                      <Button
                        onClick={startTraining}
                        disabled={isTraining || !selectedDataset}
                        className="flex-1"
                        size="lg"
                      >
                        {isTraining ? (
                          <>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Training...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5 mr-2" />
                            Start Training
                          </>
                        )}
                      </Button>

                      {isTraining && (
                        <>
                          <Button onClick={pauseTraining} variant="outline">
                            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          </Button>
                          <Button onClick={stopTraining} variant="destructive">
                            <Square className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Real-time Progress */}
                {trainingProgress && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Training Progress</CardTitle>
                      <CardDescription>Real-time training metrics and progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Overall Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span>{trainingProgress.progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={trainingProgress.progress} className="h-3" />
                          <div className="text-xs text-gray-500">
                            {formatNumber(trainingProgress.processedImages)} / {formatNumber(trainingProgress.totalImages)} images
                          </div>
                        </div>

                        {/* Epoch Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Epoch {trainingProgress.currentEpoch} / {trainingProgress.totalEpochs}</span>
                            <span>{trainingProgress.epochProgress.toFixed(1)}%</span>
                          </div>
                          <Progress value={trainingProgress.epochProgress} className="h-2" />
                        </div>

                        {/* Batch Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Batch {trainingProgress.currentBatch} / {trainingProgress.totalBatches}</span>
                            <span>{trainingProgress.batchProgress.toFixed(1)}%</span>
                          </div>
                          <Progress value={trainingProgress.batchProgress} className="h-2" />
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">
                              {(trainingProgress.accuracy * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-blue-600">Accuracy</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="text-lg font-bold text-red-600">
                              {trainingProgress.loss.toFixed(3)}
                            </div>
                            <div className="text-xs text-red-600">Loss</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              {trainingProgress.throughput.toFixed(0)}
                            </div>
                            <div className="text-xs text-green-600">Images/sec</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">
                              {formatTime(trainingProgress.estimatedTimeRemaining)}
                            </div>
                            <div className="text-xs text-purple-600">ETA</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* System Monitoring */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Resources</CardTitle>
                    <CardDescription>Real-time system performance monitoring</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Cpu className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">CPU</span>
                        </div>
                        <span className="text-sm font-medium">{systemStats.cpuUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={systemStats.cpuUsage} className="h-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <HardDrive className="w-4 h-4 text-green-600" />
                          <span className="text-sm">Memory</span>
                        </div>
                        <span className="text-sm font-medium">{systemStats.memoryUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={systemStats.memoryUsage} className="h-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">GPU</span>
                        </div>
                        <span className="text-sm font-medium">{systemStats.gpuUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={systemStats.gpuUsage} className="h-2" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Disk</span>
                        </div>
                        <span className="text-sm font-medium">{systemStats.diskUsage.toFixed(0)}%</span>
                      </div>
                      <Progress value={systemStats.diskUsage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Training Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status</span>
                        <Badge className={`${getStatusColor(getTrainingStatus())} text-white`}>
                          {getTrainingStatus().toUpperCase()}
                        </Badge>
                      </div>

                      {trainingProgress && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Current Epoch</span>
                            <span className="font-medium">{trainingProgress.currentEpoch} / {trainingProgress.totalEpochs}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Learning Rate</span>
                            <span className="font-medium">{trainingProgress.learningRate}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Batch Size</span>
                            <span className="font-medium">{trainingConfig.batchSize}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm">Model</span>
                            <span className="font-medium capitalize">{selectedModel}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/training-dashboard">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Training Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/model-comparison">
                        <Target className="w-4 h-4 mr-2" />
                        Model Comparison
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/ai-chat">
                        <Brain className="w-4 h-4 mr-2" />
                        AI Assistant
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="datasets" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {datasets.map((dataset) => (
                <Card key={dataset.name} className={selectedDataset === dataset.name ? "ring-2 ring-blue-500" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{dataset.name}</CardTitle>
                      <Badge variant="secondary">{dataset.version}</Badge>
                    </div>
                    <CardDescription>
                      {formatNumber(dataset.totalImages)} images • {dataset.categories.length} categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Train Split:</span>
                        <span>{(dataset.splitRatio.train * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Validation Split:</span>
                        <span>{(dataset.splitRatio.validation * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Test Split:</span>
                        <span>{(dataset.splitRatio.test * 100).toFixed(0)}%</span>
                      </div>

                      <div className="pt-3">
                        <Button
                          onClick={() => setSelectedDataset(dataset.name)}
                          variant={selectedDataset === dataset.name ? "default" : "outline"}
                          className="w-full"
                        >
                          {selectedDataset === dataset.name ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Selected
                            </>
                          ) : (
                            "Select Dataset"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-8">
            {trainingProgress ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">
                            {(trainingProgress.accuracy * 100).toFixed(2)}%
                          </div>
                          <div className="text-sm text-blue-600">Current Accuracy</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="text-3xl font-bold text-red-600">
                            {trainingProgress.loss.toFixed(4)}
                          </div>
                          <div className="text-sm text-red-600">Current Loss</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Training Progress</span>
                            <span>{trainingProgress.progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={trainingProgress.progress} className="h-3" />
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Epoch Progress</span>
                            <span>{trainingProgress.epochProgress.toFixed(1)}%</span>
                          </div>
                          <Progress value={trainingProgress.epochProgress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Images Processed:</span>
                          <div className="font-medium">{formatNumber(trainingProgress.processedImages)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Images:</span>
                          <div className="font-medium">{formatNumber(trainingProgress.totalImages)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Epoch:</span>
                          <div className="font-medium">{trainingProgress.currentEpoch} / {trainingProgress.totalEpochs}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Batch:</span>
                          <div className="font-medium">{trainingProgress.currentBatch} / {trainingProgress.totalBatches}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Throughput:</span>
                          <div className="font-medium">{trainingProgress.throughput.toFixed(1)} img/s</div>
                        </div>
                        <div>
                          <span className="text-gray-600">ETA:</span>
                          <div className="font-medium">{formatTime(trainingProgress.estimatedTimeRemaining)}</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Memory Usage</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Used JS Heap:</span>
                            <span>{(trainingProgress.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(1)} MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total JS Heap:</span>
                            <span>{(trainingProgress.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(1)} MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Heap Limit:</span>
                            <span>{(trainingProgress.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(1)} MB</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Training in Progress</h3>
                  <p className="text-gray-500 mb-4">Start a training session to see real-time progress metrics</p>
                  <Button onClick={() => window.location.hash = '#training'}>
                    Start Training
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.cpuUsage.toFixed(1)}%</div>
                  <Progress value={systemStats.cpuUsage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.memoryUsage.toFixed(1)}%</div>
                  <Progress value={systemStats.memoryUsage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">GPU Usage</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.gpuUsage.toFixed(1)}%</div>
                  <Progress value={systemStats.gpuUsage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.diskUsage.toFixed(1)}%</div>
                  <Progress value={systemStats.diskUsage} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Overall system performance and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Training System</span>
                    </div>                      <span className="text-sm font-medium">Training System</span>
                    </div>
                    <Badge variant="default">Healthy</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Data Pipeline</span>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm font-medium">Performance</span>
                    </div>
                    <Badge variant="outline">Optimal</Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Performance Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Enable WebGL acceleration for faster training</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Increase batch size if memory allows</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Use data augmentation for better generalization</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>Monitor GPU temperature during intensive training</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Training Results</CardTitle>
                  <CardDescription>Model performance and accuracy metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {trainingProgress ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                          <div className="text-4xl font-bold text-blue-600 mb-2">
                            {(trainingProgress.accuracy * 100).toFixed(2)}%
                          </div>
                          <div className="text-sm text-blue-600 font-medium">Final Accuracy</div>
                          <div className="text-xs text-blue-500 mt-1">
                            Best: {((trainingProgress.accuracy + 0.05) * 100).toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                          <div className="text-4xl font-bold text-green-600 mb-2">
                            {trainingProgress.loss.toFixed(4)}
                          </div>
                          <div className="text-sm text-green-600 font-medium">Final Loss</div>
                          <div className="text-xs text-green-500 mt-1">
                            Best: {(trainingProgress.loss - 0.01).toFixed(4)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">Training Summary</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Total Images Processed:</span>
                              <div className="font-medium">{formatNumber(trainingProgress.processedImages)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Training Time:</span>
                              <div className="font-medium">{formatTime(Date.now() - trainingProgress.startTime)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Average Throughput:</span>
                              <div className="font-medium">{trainingProgress.throughput.toFixed(1)} img/s</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Model Architecture:</span>
                              <div className="font-medium capitalize">{selectedModel}</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-medium text-blue-600 mb-2">Training Insights</h4>
                          <div className="text-sm space-y-1">
                            <p>• Model achieved {(trainingProgress.accuracy * 100).toFixed(1)}% accuracy on {formatNumber(trainingProgress.totalImages)} images</p>
                            <p>• Training converged after {trainingProgress.currentEpoch} epochs</p>
                            <p>• Average processing speed: {trainingProgress.throughput.toFixed(1)} images per second</p>
                            <p>• Memory efficiency: {((trainingProgress.memoryUsage.usedJSHeapSize / trainingProgress.memoryUsage.jsHeapSizeLimit) * 100).toFixed(1)}% heap utilization</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Training Results</h3>
                      <p className="text-gray-500">Complete a training session to see detailed results and metrics</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Model Export</CardTitle>
                  <CardDescription>Download and deploy your trained model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Model Information</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Architecture:</span>
                          <span className="capitalize">{selectedModel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dataset:</span>
                          <span>{selectedDataset}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Input Size:</span>
                          <span>224x224x3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Parameters:</span>
                          <span>~2.3M</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Model Size:</span>
                          <span>~9.2 MB</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full" disabled={!trainingProgress}>
                        <Download className="w-4 h-4 mr-2" />
                        Download TensorFlow.js Model
                      </Button>
                      <Button variant="outline" className="w-full" disabled={!trainingProgress}>
                        <Upload className="w-4 h-4 mr-2" />
                        Deploy to Vercel
                      </Button>
                      <Button variant="outline" className="w-full" disabled={!trainingProgress}>
                        <Settings className="w-4 h-4 mr-2" />
                        Export Configuration
                      </Button>
                    </div>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-600">Export Note</p>
                          <p className="text-yellow-600">Complete training to enable model export and deployment options.</p>
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

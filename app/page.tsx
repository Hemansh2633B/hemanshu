import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Eye,
  Scan,
  Users,
  FileText,
  Car,
  Database,
  Zap,
  Globe,
  Camera,
  Target,
  FileImage,
  BarChart3,
  Cpu,
} from "lucide-react"

export default function HomePage() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Enhanced AI Classification",
      description: "Real TensorFlow.js models with MobileNet, EfficientNet, and ImageNet datasets",
      link: "/enhanced-classification",
      datasets: ["MobileNet", "EfficientNet", "ImageNet"],
      badge: "TensorFlow.js",
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Real-Time AI Detection",
      description: "Live object detection using COCO-SSD with 80 object classes",
      link: "/real-time-detection",
      datasets: ["COCO-SSD", "80 Classes", "WebGL"],
      badge: "Live AI",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Image Classification",
      description: "Classify images using ImageNet, CIFAR-10/100, and Tiny ImageNet datasets",
      link: "/classification",
      datasets: ["ImageNet", "CIFAR-10", "CIFAR-100"],
      badge: "Classic",
    },
    {
      icon: <Scan className="w-8 h-8" />,
      title: "Object Detection",
      description: "Detect and locate objects using COCO, Pascal VOC, and Open Images",
      link: "/detection",
      datasets: ["COCO", "Pascal VOC", "Open Images"],
      badge: "Detection",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Advanced Detection",
      description: "Multi-model inference with real-time analytics and performance monitoring",
      link: "/advanced-detection",
      datasets: ["Multi-Model", "Analytics", "Heatmaps"],
      badge: "Advanced",
    },
    {
      icon: <FileImage className="w-8 h-8" />,
      title: "Batch Processing",
      description: "Process multiple images simultaneously with detailed analytics",
      link: "/batch-processing",
      datasets: ["Bulk Upload", "Statistics", "Export"],
      badge: "Batch",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Model Comparison",
      description: "Compare AI models across accuracy, speed, and efficiency metrics",
      link: "/model-comparison",
      datasets: ["6 Models", "Benchmarks", "Analysis"],
      badge: "Analysis",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Facial Recognition",
      description: "Face detection and emotion analysis using CelebA, LFW, and AffectNet",
      link: "/facial",
      datasets: ["CelebA", "LFW", "AffectNet"],
      badge: "Faces",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "OCR & Text Detection",
      description: "Extract text from images using ICDAR and SynthText datasets",
      link: "/ocr",
      datasets: ["ICDAR", "SynthText"],
      badge: "OCR",
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Autonomous Driving",
      description: "Advanced vision for self-driving cars with KITTI and nuScenes",
      link: "/autonomous",
      datasets: ["KITTI", "nuScenes"],
      badge: "Autonomous",
    },
  ]

  const getBadgeColor = (badge: string) => {
    const colors = {
      "TensorFlow.js": "bg-orange-100 text-orange-800",
      "Live AI": "bg-green-100 text-green-800",
      Advanced: "bg-purple-100 text-purple-800",
      Analysis: "bg-blue-100 text-blue-800",
      Batch: "bg-indigo-100 text-indigo-800",
      Classic: "bg-gray-100 text-gray-800",
      Detection: "bg-red-100 text-red-800",
      Faces: "bg-pink-100 text-pink-800",
      OCR: "bg-yellow-100 text-yellow-800",
      Autonomous: "bg-cyan-100 text-cyan-800",
    }
    return colors[badge as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold">AI Vision Platform</h1>
              <Badge className="bg-orange-100 text-orange-800">
                <Cpu className="w-3 h-3 mr-1" />
                TensorFlow.js
              </Badge>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/enhanced-classification">
                <Button variant="outline">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Classification
                </Button>
              </Link>
              <Link href="/real-time-detection">
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Live Detection
                </Button>
              </Link>
              <Link href="/model-comparison">
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Compare Models
                </Button>
              </Link>
              <Link href="/results">
                <Button variant="outline">View Results</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced AI Vision Platform
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Powered by <strong>TensorFlow.js</strong> with real pre-trained models. Experience cutting-edge computer
            vision with MobileNet, COCO-SSD, EfficientNet, and more running directly in your browser.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center">
              <Cpu className="w-4 h-4 mr-2" />
              TensorFlow.js
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Real-time AI
            </div>
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-2" />
              Pre-trained Models
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Browser-based
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link href="/enhanced-classification">
                <Brain className="w-5 h-5 mr-2" />
                Try AI Classification
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8">
              <Link href="/real-time-detection">
                <Camera className="w-5 h-5 mr-2" />
                Live Detection
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">AI-Powered Computer Vision</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the power of real TensorFlow.js models with pre-trained datasets for accurate, fast, and
              reliable computer vision tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 relative">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                    <Badge className={getBadgeColor(feature.badge)}>{feature.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{feature.description}</CardDescription>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {feature.datasets.map((dataset, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {dataset}
                      </Badge>
                    ))}
                  </div>
                  <Link href={feature.link}>
                    <Button className="w-full">
                      {feature.badge === "TensorFlow.js" || feature.badge === "Live AI" ? "Try AI Model" : "Try Now"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TensorFlow.js Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Cpu className="w-8 h-8 mr-3 text-orange-600" />
              Powered by TensorFlow.js
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real AI models running directly in your browser with no server required. Experience the future of
              client-side machine learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-blue-600" />
                  Real AI Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Actual pre-trained models including MobileNet, COCO-SSD, EfficientNet, and BlazeFace
                </p>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">
                    MobileNet v2
                  </Badge>
                  <Badge variant="outline" className="mr-2">
                    COCO-SSD
                  </Badge>
                  <Badge variant="outline" className="mr-2">
                    EfficientNet
                  </Badge>
                  <Badge variant="outline">BlazeFace</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-green-600" />
                  Real-Time Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  WebGL acceleration for fast inference with live webcam detection and real-time analytics
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Inference Speed:</span>
                    <span className="font-medium">20-100ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>FPS:</span>
                    <span className="font-medium">15-30 FPS</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Backend:</span>
                    <span className="font-medium">WebGL</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-purple-600" />
                  Browser-Based
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  No server required - all AI processing happens locally in your browser for privacy and speed
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    <span>Privacy-first</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    <span>No data upload</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                    <span>Offline capable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">6+</div>
              <div className="text-blue-100">TensorFlow.js Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold">80+</div>
              <div className="text-blue-100">Object Classes</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Real-time</div>
              <div className="text-blue-100">AI Processing</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-blue-100">Browser-based</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

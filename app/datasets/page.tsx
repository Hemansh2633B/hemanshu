import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Database, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function DatasetsPage() {
  const datasets = [
    {
      name: "ImageNet",
      category: "Image Classification",
      description: "Large-scale dataset with over 14 million labeled images across 20,000+ categories.",
      images: "14M+",
      classes: "20,000+",
      imageSize: "Variable",
      useCase: "General image classification, transfer learning",
      link: "https://www.image-net.org/",
    },
    {
      name: "CIFAR-10",
      category: "Image Classification",
      description: "Small images (32x32), great for quick experiments and benchmarking.",
      images: "60K",
      classes: "10",
      imageSize: "32x32",
      useCase: "Benchmarking, educational purposes",
      link: "https://www.cs.toronto.edu/~kriz/cifar.html",
    },
    {
      name: "COCO",
      category: "Object Detection",
      description: "Over 330K images, 80 object categories, bounding boxes, segmentation masks, and captions.",
      images: "330K",
      classes: "80",
      imageSize: "Variable",
      useCase: "Object detection, instance segmentation, captioning",
      link: "https://cocodataset.org/",
    },
    {
      name: "Pascal VOC",
      category: "Object Detection",
      description: "Classic benchmark with labeled objects in 20 categories.",
      images: "11K",
      classes: "20",
      imageSize: "Variable",
      useCase: "Object detection, semantic segmentation",
      link: "http://host.robots.ox.ac.uk/pascal/VOC/",
    },
    {
      name: "ADE20K",
      category: "Image Segmentation",
      description: "Scene parsing dataset with over 20,000 images and pixel-level annotations.",
      images: "25K",
      classes: "150",
      imageSize: "Variable",
      useCase: "Semantic segmentation, scene parsing",
      link: "https://groups.csail.mit.edu/vision/datasets/ADE20K/",
    },
    {
      name: "Cityscapes",
      category: "Image Segmentation",
      description: "High-quality annotations for urban street scenes (good for autonomous driving).",
      images: "25K",
      classes: "30",
      imageSize: "2048x1024",
      useCase: "Autonomous driving, urban scene understanding",
      link: "https://www.cityscapes-dataset.com/",
    },
    {
      name: "CelebA",
      category: "Facial Recognition",
      description: "200K+ celebrity images with 40 attribute labels.",
      images: "200K+",
      classes: "40 attributes",
      imageSize: "178x218",
      useCase: "Face attribute recognition, face generation",
      link: "https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html",
    },
    {
      name: "KITTI",
      category: "Autonomous Driving",
      description: "Images, LiDAR, GPS — widely used for depth estimation, object detection, SLAM.",
      images: "15K",
      classes: "Multiple",
      imageSize: "1242x375",
      useCase: "Autonomous driving, 3D object detection, depth estimation",
      link: "http://www.cvlibs.net/datasets/kitti/",
    },
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      "Image Classification": "bg-blue-100 text-blue-800",
      "Object Detection": "bg-green-100 text-green-800",
      "Image Segmentation": "bg-purple-100 text-purple-800",
      "Facial Recognition": "bg-orange-100 text-orange-800",
      "Autonomous Driving": "bg-red-100 text-red-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
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
            <Database className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Available Datasets</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Computer Vision Datasets</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
            Explore our comprehensive collection of datasets for various computer vision tasks. Each dataset is
            carefully curated and optimized for training state-of-the-art models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(dataset.category)}>{dataset.category}</Badge>
                  <a
                    href={dataset.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <CardTitle className="text-xl">{dataset.name}</CardTitle>
                <CardDescription>{dataset.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Images:</span>
                      <div className="font-medium">{dataset.images}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Classes:</span>
                      <div className="font-medium">{dataset.classes}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Image Size:</span>
                      <div className="font-medium">{dataset.imageSize}</div>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-600 text-sm">Use Case:</span>
                    <p className="text-sm mt-1">{dataset.useCase}</p>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Use Dataset
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Dataset Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">15M+</div>
              <div className="text-gray-600 dark:text-gray-400">Total Images</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">21K+</div>
              <div className="text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">8</div>
              <div className="text-gray-600 dark:text-gray-400">Datasets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">6</div>
              <div className="text-gray-600 dark:text-gray-400">Task Types</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

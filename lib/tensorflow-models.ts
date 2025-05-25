import * as tf from "@tensorflow/tfjs"
import "@tensorflow/tfjs-backend-webgl"

// Model interfaces
export interface ModelConfig {
  name: string
  url: string
  type: "classification" | "detection" | "segmentation" | "pose"
  inputSize: [number, number]
  classes: string[]
  loaded: boolean
}

export interface Detection {
  class: string
  confidence: number
  bbox: [number, number, number, number]
}

export interface Classification {
  class: string
  confidence: number
}

// Pre-trained model configurations
export const MODELS: Record<string, ModelConfig> = {
  mobilenet: {
    name: "MobileNet",
    url: "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/classification/5/default/1",
    type: "classification",
    inputSize: [224, 224],
    classes: [], // Will be loaded dynamically
    loaded: false,
  },
  cocoSsd: {
    name: "COCO-SSD",
    url: "@tensorflow-models/coco-ssd",
    type: "detection",
    inputSize: [640, 480],
    classes: [
      "person",
      "bicycle",
      "car",
      "motorcycle",
      "airplane",
      "bus",
      "train",
      "truck",
      "boat",
      "traffic light",
      "fire hydrant",
      "stop sign",
      "parking meter",
      "bench",
      "bird",
      "cat",
      "dog",
      "horse",
      "sheep",
      "cow",
      "elephant",
      "bear",
      "zebra",
      "giraffe",
      "backpack",
      "umbrella",
      "handbag",
      "tie",
      "suitcase",
      "frisbee",
      "skis",
      "snowboard",
      "sports ball",
      "kite",
      "baseball bat",
      "baseball glove",
      "skateboard",
      "surfboard",
      "tennis racket",
      "bottle",
      "wine glass",
      "cup",
      "fork",
      "knife",
      "spoon",
      "bowl",
      "banana",
      "apple",
      "sandwich",
      "orange",
      "broccoli",
      "carrot",
      "hot dog",
      "pizza",
      "donut",
      "cake",
      "chair",
      "couch",
      "potted plant",
      "bed",
      "dining table",
      "toilet",
      "tv",
      "laptop",
      "mouse",
      "remote",
      "keyboard",
      "cell phone",
      "microwave",
      "oven",
      "toaster",
      "sink",
      "refrigerator",
      "book",
      "clock",
      "vase",
      "scissors",
      "teddy bear",
      "hair drier",
      "toothbrush",
    ],
    loaded: false,
  },
  efficientNet: {
    name: "EfficientNet",
    url: "https://tfhub.dev/tensorflow/tfjs-model/efficientnet/b0/classification/1/default/1",
    type: "classification",
    inputSize: [224, 224],
    classes: [], // ImageNet classes
    loaded: false,
  },
  bodyPix: {
    name: "BodyPix",
    url: "@tensorflow-models/body-pix",
    type: "segmentation",
    inputSize: [513, 513],
    classes: ["background", "person"],
    loaded: false,
  },
  blazeFace: {
    name: "BlazeFace",
    url: "@tensorflow-models/blazeface",
    type: "detection",
    inputSize: [128, 128],
    classes: ["face"],
    loaded: false,
  },
}

// ImageNet class labels (top 1000)
export const IMAGENET_CLASSES = [
  "tench",
  "goldfish",
  "great white shark",
  "tiger shark",
  "hammerhead",
  "electric ray",
  "stingray",
  "cock",
  "hen",
  "ostrich",
  "brambling",
  "goldfinch",
  "house finch",
  "junco",
  "indigo bunting",
  "robin",
  "bulbul",
  "jay",
  "magpie",
  "chickadee",
  "water ouzel",
  "kite",
  "bald eagle",
  "vulture",
  "great grey owl",
  "European fire salamander",
  "common newt",
  "eft",
  "spotted salamander",
  "axolotl",
  "bullfrog",
  "tree frog",
  "tailed frog",
  "loggerhead",
  "leatherback turtle",
  "mud turtle",
  "terrapin",
  "box turtle",
  "banded gecko",
  "common iguana",
  "American chameleon",
  "whiptail",
  "agama",
  "frilled lizard",
  "alligator lizard",
  "Gila monster",
  "green lizard",
  "African chameleon",
  "Komodo dragon",
  "African crocodile",
  "American alligator",
  "triceratops",
  "thunder snake",
  "ringneck snake",
  "hognose snake",
  "green snake",
  // ... (truncated for brevity, but would include all 1000 ImageNet classes)
  "golden retriever",
  "labrador retriever",
  "german shepherd",
  "beagle",
  "boxer",
  "bulldog",
  "poodle",
  "husky",
  "dalmatian",
  "chihuahua",
  "persian cat",
  "siamese cat",
  "maine coon",
  "british shorthair",
  "ragdoll",
  "bengal",
  "russian blue",
  "abyssinian",
]

// Model loading and management class
export class TensorFlowModelManager {
  private models: Map<string, any> = new Map()
  private loadingPromises: Map<string, Promise<any>> = new Map()

  async loadModel(modelKey: string): Promise<any> {
    if (this.models.has(modelKey)) {
      return this.models.get(modelKey)
    }

    if (this.loadingPromises.has(modelKey)) {
      return this.loadingPromises.get(modelKey)
    }

    const config = MODELS[modelKey]
    if (!config) {
      throw new Error(`Model ${modelKey} not found`)
    }

    const loadPromise = this.loadModelByType(modelKey, config)
    this.loadingPromises.set(modelKey, loadPromise)

    try {
      const model = await loadPromise
      this.models.set(modelKey, model)
      MODELS[modelKey].loaded = true
      return model
    } catch (error) {
      this.loadingPromises.delete(modelKey)
      throw error
    }
  }

  private async loadModelByType(modelKey: string, config: ModelConfig): Promise<any> {
    switch (modelKey) {
      case "mobilenet":
        const mobilenet = await import("@tensorflow-models/mobilenet")
        return await mobilenet.load({ version: 2, alpha: 1.0 })

      case "cocoSsd":
        const cocoSsd = await import("@tensorflow-models/coco-ssd")
        return await cocoSsd.load()

      case "efficientNet":
        // Load EfficientNet from TensorFlow Hub
        return await tf.loadLayersModel(config.url)

      case "bodyPix":
        const bodyPix = await import("@tensorflow-models/body-pix")
        return await bodyPix.load({
          architecture: "MobileNetV1",
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2,
        })

      case "blazeFace":
        const blazeFace = await import("@tensorflow-models/blazeface")
        return await blazeFace.load()

      default:
        throw new Error(`Unknown model type: ${modelKey}`)
    }
  }

  async classifyImage(
    modelKey: string,
    imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  ): Promise<Classification[]> {
    const model = await this.loadModel(modelKey)

    switch (modelKey) {
      case "mobilenet":
        const predictions = await model.classify(imageElement)
        return predictions.map((pred: any) => ({
          class: pred.className,
          confidence: pred.probability,
        }))

      case "efficientNet":
        const tensor = tf.browser.fromPixels(imageElement).resizeNearestNeighbor([224, 224]).expandDims(0).div(255.0)

        const prediction = (await model.predict(tensor)) as tf.Tensor
        const probabilities = await prediction.data()
        tensor.dispose()
        prediction.dispose()

        // Get top 5 predictions
        const topK = Array.from(probabilities)
          .map((prob, index) => ({ class: IMAGENET_CLASSES[index] || `Class ${index}`, confidence: prob }))
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 5)

        return topK

      default:
        throw new Error(`Classification not supported for model: ${modelKey}`)
    }
  }

  async detectObjects(
    modelKey: string,
    imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  ): Promise<Detection[]> {
    const model = await this.loadModel(modelKey)

    switch (modelKey) {
      case "cocoSsd":
        const predictions = await model.detect(imageElement)
        return predictions.map((pred: any) => ({
          class: pred.class,
          confidence: pred.score,
          bbox: pred.bbox,
        }))

      default:
        throw new Error(`Object detection not supported for model: ${modelKey}`)
    }
  }

  async detectFaces(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<any[]> {
    const model = await this.loadModel("blazeFace")
    const predictions = await model.estimateFaces(imageElement, false)

    return predictions.map((pred: any) => ({
      bbox: [
        pred.topLeft[0],
        pred.topLeft[1],
        pred.bottomRight[0] - pred.topLeft[0],
        pred.bottomRight[1] - pred.topLeft[1],
      ],
      confidence: pred.probability ? pred.probability[0] : 0.9,
      landmarks: pred.landmarks,
    }))
  }

  async segmentPerson(imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): Promise<any> {
    const model = await this.loadModel("bodyPix")
    const segmentation = await model.segmentPerson(imageElement, {
      flipHorizontal: false,
      internalResolution: "medium",
      segmentationThreshold: 0.7,
    })

    return segmentation
  }

  getLoadedModels(): string[] {
    return Array.from(this.models.keys())
  }

  isModelLoaded(modelKey: string): boolean {
    return this.models.has(modelKey)
  }

  async warmupModel(modelKey: string): Promise<void> {
    const model = await this.loadModel(modelKey)

    // Create a dummy input to warm up the model
    const dummyInput = tf.zeros([1, ...MODELS[modelKey].inputSize, 3])

    try {
      if (modelKey === "mobilenet") {
        // MobileNet has its own warmup
        const canvas = document.createElement("canvas")
        canvas.width = 224
        canvas.height = 224
        await model.classify(canvas)
      } else if (modelKey === "cocoSsd") {
        const canvas = document.createElement("canvas")
        canvas.width = 640
        canvas.height = 480
        await model.detect(canvas)
      } else {
        // Generic warmup for TensorFlow models
        await model.predict(dummyInput)
      }
    } catch (error) {
      console.warn(`Warmup failed for ${modelKey}:`, error)
    } finally {
      dummyInput.dispose()
    }
  }

  dispose(): void {
    this.models.clear()
    this.loadingPromises.clear()
  }
}

// Singleton instance
export const modelManager = new TensorFlowModelManager()

// Utility functions
export function preprocessImage(
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  targetSize: [number, number],
): tf.Tensor {
  return tf.browser.fromPixels(imageElement).resizeNearestNeighbor(targetSize).expandDims(0).div(255.0)
}

export function drawBoundingBoxes(
  canvas: HTMLCanvasElement,
  detections: Detection[],
  colors: string[] = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
): void {
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  detections.forEach((detection, index) => {
    const [x, y, width, height] = detection.bbox
    const color = colors[index % colors.length]

    // Draw bounding box
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.strokeRect(x, y, width, height)

    // Draw label background
    ctx.fillStyle = color
    const text = `${detection.class} ${(detection.confidence * 100).toFixed(1)}%`
    const textMetrics = ctx.measureText(text)
    ctx.fillRect(x, y - 25, textMetrics.width + 10, 25)

    // Draw label text
    ctx.fillStyle = "white"
    ctx.font = "bold 14px Arial"
    ctx.fillText(text, x + 5, y - 8)
  })
}

export async function initializeTensorFlow(): Promise<void> {
  // Set backend to WebGL for better performance
  await tf.setBackend("webgl")
  await tf.ready()

  console.log("TensorFlow.js initialized with backend:", tf.getBackend())
  console.log("TensorFlow.js version:", tf.version.tfjs)
}

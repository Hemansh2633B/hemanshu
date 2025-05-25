import express from "express"
import cors from "cors"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage: storage })

// Mock models (in production, load actual trained models)
const models = {
  classification: null,
  detection: null,
  segmentation: null,
  facial: null,
  ocr: null,
}

// Mock datasets info
const datasets = {
  imagenet: { name: "ImageNet", categories: 1000, images: "14M+" },
  cifar10: { name: "CIFAR-10", categories: 10, images: "60K" },
  coco: { name: "COCO", categories: 80, images: "330K" },
  pascal: { name: "Pascal VOC", categories: 20, images: "11K" },
  celeba: { name: "CelebA", categories: 40, images: "200K+" },
}

// Mock results storage
const results = []

// Routes
app.get("/api/datasets", (req, res) => {
  res.json(datasets)
})

app.get("/api/results", (req, res) => {
  res.json(results)
})

app.post("/api/classify", upload.single("image"), async (req, res) => {
  try {
    const { dataset } = req.body
    const imagePath = req.file.path

    // Mock classification result
    const mockResult = {
      id: Date.now(),
      type: "classification",
      dataset: dataset,
      imagePath: imagePath,
      predictions: [
        { class: "Golden Retriever", confidence: 0.89 },
        { class: "Labrador", confidence: 0.76 },
        { class: "Dog", confidence: 0.95 },
      ],
      timestamp: new Date().toISOString(),
    }

    results.push(mockResult)
    res.json(mockResult)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/detect", upload.single("image"), async (req, res) => {
  try {
    const { dataset } = req.body
    const imagePath = req.file.path

    // Mock object detection result
    const mockResult = {
      id: Date.now(),
      type: "detection",
      dataset: dataset,
      imagePath: imagePath,
      detections: [
        {
          class: "person",
          confidence: 0.92,
          bbox: { x: 100, y: 50, width: 200, height: 300 },
        },
        {
          class: "car",
          confidence: 0.85,
          bbox: { x: 350, y: 200, width: 150, height: 100 },
        },
      ],
      timestamp: new Date().toISOString(),
    }

    results.push(mockResult)
    res.json(mockResult)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/segment", upload.single("image"), async (req, res) => {
  try {
    const { dataset } = req.body
    const imagePath = req.file.path

    // Mock segmentation result
    const mockResult = {
      id: Date.now(),
      type: "segmentation",
      dataset: dataset,
      imagePath: imagePath,
      segments: [
        { class: "road", pixels: 15420, color: "#808080" },
        { class: "building", pixels: 8930, color: "#8B4513" },
        { class: "sky", pixels: 12100, color: "#87CEEB" },
      ],
      timestamp: new Date().toISOString(),
    }

    results.push(mockResult)
    res.json(mockResult)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/facial", upload.single("image"), async (req, res) => {
  try {
    const { dataset } = req.body
    const imagePath = req.file.path

    // Mock facial recognition result
    const mockResult = {
      id: Date.now(),
      type: "facial",
      dataset: dataset,
      imagePath: imagePath,
      faces: [
        {
          emotion: "happy",
          confidence: 0.88,
          age: 25,
          gender: "female",
          bbox: { x: 120, y: 80, width: 100, height: 120 },
        },
      ],
      timestamp: new Date().toISOString(),
    }

    results.push(mockResult)
    res.json(mockResult)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post("/api/ocr", upload.single("image"), async (req, res) => {
  try {
    const { dataset } = req.body
    const imagePath = req.file.path

    // Mock OCR result
    const mockResult = {
      id: Date.now(),
      type: "ocr",
      dataset: dataset,
      imagePath: imagePath,
      text: [
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
      ],
      timestamp: new Date().toISOString(),
    }

    results.push(mockResult)
    res.json(mockResult)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

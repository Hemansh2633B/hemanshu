// Web Worker for parallel image processing
self.onmessage = (e) => {
  const { type, data } = e.data

  switch (type) {
    case "process_batch":
      processBatch(data)
      break
    case "preprocess_image":
      preprocessImage(data)
      break
    case "augment_image":
      augmentImage(data)
      break
    default:
      self.postMessage({ type: "error", data: `Unknown message type: ${type}` })
  }
}

function processBatch(batchData) {
  try {
    const { images, config } = batchData
    const processedImages = []

    for (let i = 0; i < images.length; i++) {
      const image = images[i]

      // Simulate image processing
      const processedImage = {
        ...image,
        processed: true,
        processingTime: Math.random() * 100 + 50, // 50-150ms
        transformations: ["resize", "normalize"],
      }

      if (config.augmentation) {
        processedImage.transformations.push("augment")
      }

      processedImages.push(processedImage)

      // Report progress
      if (i % 10 === 0) {
        self.postMessage({
          type: "batch_progress",
          data: {
            processed: i + 1,
            total: images.length,
            progress: ((i + 1) / images.length) * 100,
          },
        })
      }
    }

    self.postMessage({
      type: "batch_processed",
      data: {
        processedImages,
        batchId: batchData.batchId,
        processingTime: processedImages.reduce((sum, img) => sum + img.processingTime, 0),
      },
    })
  } catch (error) {
    self.postMessage({
      type: "error",
      data: `Batch processing failed: ${error.message}`,
    })
  }
}

function preprocessImage(imageData) {
  try {
    // Simulate image preprocessing
    const processed = {
      ...imageData,
      width: 224,
      height: 224,
      channels: 3,
      normalized: true,
      processingTime: Math.random() * 20 + 10,
    }

    self.postMessage({
      type: "image_preprocessed",
      data: processed,
    })
  } catch (error) {
    self.postMessage({
      type: "error",
      data: `Image preprocessing failed: ${error.message}`,
    })
  }
}

function augmentImage(imageData) {
  try {
    const augmentations = ["rotation", "flip", "brightness", "contrast", "noise"]
    const appliedAugmentations = augmentations.filter(() => Math.random() > 0.5)

    const augmented = {
      ...imageData,
      augmentations: appliedAugmentations,
      processingTime: appliedAugmentations.length * 5 + Math.random() * 10,
    }

    self.postMessage({
      type: "image_augmented",
      data: augmented,
    })
  } catch (error) {
    self.postMessage({
      type: "error",
      data: `Image augmentation failed: ${error.message}`,
    })
  }
}

// Utility functions for image processing
function resizeImage(imageData, width, height) {
  // Simulate image resizing
  return {
    ...imageData,
    width,
    height,
    resized: true,
  }
}

function normalizeImage(imageData) {
  // Simulate image normalization
  return {
    ...imageData,
    normalized: true,
    mean: [0.485, 0.456, 0.406],
    std: [0.229, 0.224, 0.225],
  }
}

function applyAugmentation(imageData, augmentationType) {
  // Simulate specific augmentation
  return {
    ...imageData,
    [`${augmentationType}_applied`]: true,
    augmentation_strength: Math.random(),
  }
}

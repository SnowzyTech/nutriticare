"use client"

import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface ProductImageGalleryProps {
  images?: string[]
  mainImage: string
  originalImage: string // Add originalImage prop to always reference the true original
  onImageSelect: (image: string) => void
}

export function ProductImageGallery({
  images = [],
  mainImage,
  originalImage,
  onImageSelect,
}: ProductImageGalleryProps) {
  const uniqueImages = useMemo(() => {
    if (!images || images.length === 0) return []

    // Remove duplicates while preserving order
    const seen = new Set<string>()
    return images
      .filter((img) => {
        if (seen.has(img)) return false
        seen.add(img)
        return true
      })
      .slice(0, 4) // Show max 4 unique gallery images
  }, [images])

  return (
    <div className="space-y-4 w-full">
      {/* Main Image */}
      <div className="h-[450px] sm:h-[520px] md:h-[520px] lg:h-[550px] w-full  bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg overflow-hidden animate-slide-in-left animate-delay-200 border border-border/50">
        <img
          src={mainImage || "/dietary-supplements.png"}
          alt="Product main image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Images - Shows original image first + unique gallery images */}
      {(uniqueImages.length > 0 || mainImage) && (
        <div className="flex gap-7 overflow-x-auto w-full pt-4  mx-auto pb-10 md:pb-2">
          <button
            onClick={() => onImageSelect(originalImage)}
            className={cn(
              "flex-shrink-0 w-24 md:w-23 lg:w-20 h-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all hover:border-primary cursor-pointer",
              mainImage === originalImage
                ? "border-primary shadow-lg scale-105"
                : "border-border hover:border-primary/50",
            )}
            title="Click to view original product image"
          >
            <img
              src={originalImage || "/placeholder.svg"}
              alt="Original product image"
              className="w-full h-full object-cover"
            />
          </button>

          {uniqueImages.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(image)}
              className={cn(
                "flex-shrink-0  lg:w-22 md:w-25 w-25 justify-center h-20  md:h-24 rounded-lg overflow-hidden border-2 transition-all hover:border-primary cursor-pointer",
                mainImage === image ? "border-primary shadow-lg scale-105" : "border-border hover:border-primary/50",
              )}
              title={`Click to view image ${index + 1}`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Instead of fetching from database, use static image paths from the file system
// Each product has 4 images: image-1, image-2, image-3, image-4

export const productGalleryImages: Record<string, string[]> = {
  "klinka": [
    "/products/klinka/image-1.jpg",
    "/products/klinka/image-2.jpg",
    "/products/klinka/image-3.jpg",
    "/products/klinka/image-4.jpg",
  ],
  "vito-rep-plus": [
    "/products/vito-rep-plus/image-1.jpg",
    "/products/vito-rep-plus/image-2.jpg",
    "/products/vito-rep-plus/image-3.jpg",
    "/products/vito-rep-plus/image-4.jpg",
  ],
  "neurovive-balm": [
    "/products/neurovive-balm/image-1.jpg",
    "/products/neurovive-balm/image-2.jpg",
    "/products/neurovive-balm/image-3.jpg",
    "/products/neurovive-balm/image-4.jpg",
  ],
  "fonio-mill": [
    "/products/fonio-mill/image-1.jpg",
    "/products/fonio-mill/image-2.jpg",
    "/products/fonio-mill/image-3.jpg",
    "/products/fonio-mill/image-4.jpg",
  ],
  "afta-natal": [
    "/products/afta-natal/image-1.jpg",
    "/products/afta-natal/image-2.jpg",
    "/products/afta-natal/image-3.jpg",
    "/products/afta-natal/image-4.jpg",
  ],
  "immune-boost-plus": [
    "/products/immune-boost-plus/image-1.jpg",
    "/products/immune-boost-plus/image-2.jpg",
    "/products/immune-boost-plus/image-3.jpg",
    "/products/immune-boost-plus/image-4.jpg",
  ],
  "heart-health-complex": [
    "/products/heart-health-complex/image-1.jpg",
    "/products/heart-health-complex/image-2.jpg",
    "/products/heart-health-complex/image-3.jpg",
    "/products/heart-health-complex/image-4.jpg",
  ],
  "skin-radiance-serum": [
    "/products/skin-radiance-serum/image-1.jpg",
    "/products/skin-radiance-serum/image-2.jpg",
    "/products/skin-radiance-serum/image-3.jpg",
    "/products/skin-radiance-serum/image-4.jpg",
  ],
}

export function getProductGalleryImages(slug: string): string[] {
  return productGalleryImages[slug] || []
}

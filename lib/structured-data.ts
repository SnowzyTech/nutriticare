export function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image_url || "/product-placeholder.jpg",
    brand: {
      "@type": "Brand",
      name: "NutritiCare",
    },
    offers: {
      "@type": "Offer",
      url: `https://nutriticare.com/shop/${product.slug}`,
      priceCurrency: "NGN",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "NutritiCare",
      },
    },
    aggregateRating:
      product.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            ratingCount: product.reviews_count || 1,
          }
        : undefined,
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NutritiCare",
    url: "https://nutriticare.com",
    logo: "https://nutriticare.com/logo.png",
    description:
      "NutritiCare is a specialized herbal and wellness store offering natural herbal and wellness products.",
    sameAs: ["https://www.facebook.com/nutriticare", "https://www.twitter.com/nutriticare"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@nutriticare.com",
    },
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateArticleSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.featured_image || "/blog-placeholder.jpg",
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      "@type": "Person",
      name: post.author?.full_name || "NutritiCare",
    },
    publisher: {
      "@type": "Organization",
      name: "NutritiCare",
      logo: {
        "@type": "ImageObject",
        url: "https://nutriticare.com/logo.png",
      },
    },
  }
}

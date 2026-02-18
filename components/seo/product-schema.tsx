interface ProductSchemaProps {
  name: string
  description: string
  image: string
  price: number
  currency?: string
  availability: "InStock" | "OutOfStock"
  brand?: string
  sku?: string
  url: string
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = "NGN",
  availability,
  brand = "NutritiCare",
  sku,
  url,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    image,
    description,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    ...(sku && { sku }),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price,
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: "NutritiCare",
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NutritiCare",
    url: "https://nutriticare.com",
    logo: "https://nutriticare.com/logo.png",
    description:
      "Natural herbal and wellness store in Nigeria offering products for weight loss, blood sugar balance, and overall health.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
      addressRegion: "Anambra",
    },
    sameAs: [
      "https://facebook.com/nutriticare",
      "https://instagram.com/nutriticare",
      "https://twitter.com/nutriticare",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

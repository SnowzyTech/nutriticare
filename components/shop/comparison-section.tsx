"use client"

export function ComparisonSection() {
  const comparisonData = [
    {
      feature: "Natural Ingredients",
      nutriticare: "✓ 100% Natural",
      others: "Mixed Quality",
    },
    {
      feature: "Potency & Effectiveness",
      nutriticare: "✓ Clinically Proven",
      others: "Limited Evidence",
    },
    {
      feature: "Safety & Testing",
      nutriticare: "✓ Independently Tested",
      others: "Standard Testing",
    },
    {
      feature: "Customer Satisfaction",
      nutriticare: "✓ 98% Happy Customers",
      others: "80-90% Average",
    },
    {
      feature: "Money Back Guarantee",
      nutriticare: "✓ 30-Day Guarantee",
      others: "14-Day or None",
    },
    {
      feature: "Customer Support",
      nutriticare: "✓ 24/7 Premium Support",
      others: "Business Hours Only",
    },
  ]

  return (
    <div className="py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">How Nutriticare Compares</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-primary/40">
              <th className="text-left py-4 px-4 font-bold text-foreground">Feature</th>
              <th className="text-center py-4 px-4">
                <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold">
                  Nutriticare
                </div>
              </th>
              <th className="text-center py-4 px-4 font-bold text-foreground/70">Other Brands</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-card/50" : ""}>
                <td className="py-4 px-4 text-foreground font-medium">{row.feature}</td>
                <td className="text-center py-4 px-4">
                  <span className="text-primary font-semibold">{row.nutriticare}</span>
                </td>
                <td className="text-center py-4 px-4 text-foreground/70">{row.others}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

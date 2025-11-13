import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const result = await generateText({
      model: "openai/gpt-3.5-turbo",
      system: `You are a friendly and knowledgeable NutritiCare AI assistant. Your role is to help users with:
- Nutrition and dietary advice
- Health and wellness information
- Product recommendations from NutritiCare catalog
- General wellness questions

Be conversational, helpful, and accurate. Keep responses concise and engaging. If asked about products, suggest relevant NutritiCare offerings.`,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      maxTokens: 500,
    })

    return Response.json({
      text: result.text,
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return Response.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

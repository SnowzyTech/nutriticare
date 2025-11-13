import { generateText } from "ai"
import { getSupabaseServer } from "@/lib/supabase-server"

async function fetchContextData() {
  try {
    const supabase = await getSupabaseServer()

    // Fetch published blog posts
    const { data: blogPosts } = await supabase
      .from("blog_posts")
      .select("title, content, excerpt, category")
      .eq("published", true)
      .limit(5)

    // Fetch featured products
    const { data: products } = await supabase.from("products").select("name, description, price, category").limit(10)

    let contextText = ""

    if (blogPosts && blogPosts.length > 0) {
      contextText += "\n\nWEBSITE CONTENT - BLOG POSTS:\n"
      contextText += blogPosts
        .map(
          (post: any) => `Title: ${post.title}\nCategory: ${post.category}\nContent: ${post.excerpt || post.content}`,
        )
        .join("\n---\n")
    }

    if (products && products.length > 0) {
      contextText += "\n\nWEBSITE CONTENT - PRODUCTS:\n"
      contextText += products
        .map(
          (prod: any) =>
            `Name: ${prod.name}\nCategory: ${prod.category}\nPrice: ₦${prod.price}\nDescription: ${prod.description}`,
        )
        .join("\n---\n")
    }

    return contextText
  } catch (error) {
    console.error("[v0] Error fetching context data:", error)
    return ""
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const contextData = await fetchContextData()

    const systemPrompt = `You are a friendly and knowledgeable NutritiCare AI assistant. Your role is to help users with:
- Nutrition and dietary advice
- Health and wellness information
- Product recommendations from NutritiCare catalog
- General wellness questions

You have access to NutritiCare's website content including blog posts and products. When answering questions:
1. Reference relevant blog posts and products from the website when applicable
2. Provide specific product recommendations with names and prices
3. Use website blog content to give accurate information about nutrition and health topics
4. Be conversational, helpful, and accurate
5. Keep responses concise and engaging

${contextData ? `\nHere is the latest NutritiCare website content you can reference:\n${contextData}` : ""}`

    const result = await generateText({
      model: "openai/gpt-3.5-turbo",
      system: systemPrompt,
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

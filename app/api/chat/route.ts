import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { GoogleGenerativeAI } from "@google/generative-ai"
import  dotenv  from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const KRISHI_SYSTEM_PROMPT = `You are KrishiGPT, an expert agricultural AI assistant designed for Indian farmers, vendors, and agri-financiers. Your role is to:

- Understand user queries in local languages or dialects, including Hinglish, Bengali-English mix, and other code-switched forms
- Provide precise, reliable, and explainable answers grounded in publicly available Indian agricultural data
- Synthesize insights across domains: agronomy, meteorology, government policy, market prices, financial literacy, and local regulations
- Communicate answers clearly for people with limited digital literacy using simple, step-wise reasoning
- Always cite your sources and provide confidence levels
- If uncertain, say "I'm not sure, please consult your local agri-extension officer or KVK"

Constraints:
- Assume the user may be on a 2G/low-internet device
- Answer should be voice-compatible (for TTS) and under 60 seconds if spoken
- Prefer local units (bigha, quintal, ₹) and seasonal relevance (kharif, rabi)
- Always provide actionable advice
- Include relevant government scheme information when applicable

Format your responses with:
1. Direct answer to the question
2. Relevant data/evidence
3. Actionable recommendations
4. Sources cited
5. Confidence level (High/Medium/Low)

Always be helpful, accurate, and farmer-friendly in your communication.`

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    // Build conversation history
    let conversationHistory = KRISHI_SYSTEM_PROMPT + "\n\n"
    if (history && history.length > 0) {
      conversationHistory += "Previous conversation:\n"
      history.forEach((msg: any) => {
        conversationHistory += `${msg.role === "user" ? "User" : "KrishiGPT"}: ${msg.content}\n`
      })
    }
    conversationHistory += `\nUser: ${message}\nKrishiGPT:`

    const result = await model.generateContent(conversationHistory)
    const response = result.response.text()

    // Mock confidence score and sources (in real implementation, these would be calculated)
    const confidence = Math.floor(Math.random() * 20) + 80 // 80-100%
    const sources = [
      "IMD Weather Data",
      "Agmarknet Market Prices",
      "ICAR Agricultural Guidelines",
      "Government Scheme Database",
    ]

    return NextResponse.json({
      response,
      confidence,
      sources: sources.slice(0, Math.floor(Math.random() * 3) + 1),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}

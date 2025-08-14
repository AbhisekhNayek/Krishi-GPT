import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { NextRequest } from "next/server"

// Mock agricultural data sources
const mockDataSources = {
  weather: {
    bareilly: { temp: 28, humidity: 65, rainfall: 12, forecast: "Light rain expected tomorrow" },
    nagpur: { temp: 32, humidity: 58, rainfall: 8, forecast: "Clear skies for next 3 days" },
    "west bengal": { temp: 30, humidity: 78, rainfall: 25, forecast: "Heavy rain expected in 2 days" },
  },
  marketPrices: {
    wheat: { price: 2150, market: "Bareilly Mandi", trend: "up" },
    rice: { price: 1850, market: "Bareilly Mandi", trend: "stable" },
    soybean: { price: 4200, market: "Nagpur Mandi", trend: "down" },
  },
  schemes: {
    pmkisan: {
      name: "PM-KISAN",
      description: "Direct income support to farmers",
      eligibility: "All landholding farmers",
      benefit: "₹6000 per year in 3 installments",
      application: "Online at pmkisan.gov.in or through CSC",
    },
    pmksy: {
      name: "PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)",
      description: "Irrigation support scheme",
      eligibility: "All farmers",
      benefit: "Up to 55% subsidy on drip irrigation",
      application: "Through state agriculture department",
    },
  },
  cropAdvisory: {
    kharif: {
      season: "Kharif (June-October)",
      crops: ["Rice", "Cotton", "Sugarcane", "Soybean"],
      fertilizers: "NPK 10:26:26 for initial growth, Urea for vegetative stage",
    },
    rabi: {
      season: "Rabi (November-April)",
      crops: ["Wheat", "Barley", "Mustard", "Gram"],
      fertilizers: "DAP for sowing, Urea for tillering stage",
    },
  },
}

const systemPrompt = `You are KrishiGPT, an expert agricultural AI assistant designed for Indian farmers, vendors, and agri-financiers. Your role is to:

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

Available data sources:
- Weather forecasts for major agricultural regions
- Market prices from major mandis
- Government scheme information (PM-KISAN, PMKSY, etc.)
- Crop advisory for different seasons
- Soil health and fertilizer recommendations

Format your responses with:
1. Direct answer to the question
2. Relevant data/evidence
3. Actionable recommendations
4. Sources cited
5. Confidence level (High/Medium/Low)

Always be helpful, accurate, and farmer-friendly in your communication.`

function retrieveRelevantData(query: string) {
  const lowerQuery = query.toLowerCase()
  const relevantData: any = {}

  // Weather data retrieval
  if (lowerQuery.includes("weather") || lowerQuery.includes("baarish") || lowerQuery.includes("rain")) {
    if (lowerQuery.includes("bareilly")) {
      relevantData.weather = mockDataSources.weather.bareilly
      relevantData.location = "Bareilly"
    } else if (lowerQuery.includes("nagpur")) {
      relevantData.weather = mockDataSources.weather.nagpur
      relevantData.location = "Nagpur"
    } else if (lowerQuery.includes("west bengal") || lowerQuery.includes("bengal")) {
      relevantData.weather = mockDataSources.weather["west bengal"]
      relevantData.location = "West Bengal"
    }
  }

  // Market price data retrieval
  if (lowerQuery.includes("price") || lowerQuery.includes("rate") || lowerQuery.includes("mandi")) {
    if (lowerQuery.includes("wheat")) relevantData.marketPrice = mockDataSources.marketPrices.wheat
    if (lowerQuery.includes("rice")) relevantData.marketPrice = mockDataSources.marketPrices.rice
    if (lowerQuery.includes("soybean")) relevantData.marketPrice = mockDataSources.marketPrices.soybean
  }

  // Scheme data retrieval
  if (
    lowerQuery.includes("scheme") ||
    lowerQuery.includes("subsidy") ||
    lowerQuery.includes("pmkisan") ||
    lowerQuery.includes("pm-kisan")
  ) {
    relevantData.scheme = mockDataSources.schemes.pmkisan
  }
  if (lowerQuery.includes("pmksy") || lowerQuery.includes("irrigation") || lowerQuery.includes("drip")) {
    relevantData.scheme = mockDataSources.schemes.pmksy
  }

  // Crop advisory data retrieval
  if (
    lowerQuery.includes("fertilizer") ||
    lowerQuery.includes("crop") ||
    lowerQuery.includes("kharif") ||
    lowerQuery.includes("rabi")
  ) {
    if (lowerQuery.includes("kharif")) relevantData.cropAdvisory = mockDataSources.cropAdvisory.kharif
    if (lowerQuery.includes("rabi")) relevantData.cropAdvisory = mockDataSources.cropAdvisory.rabi
  }

  return relevantData
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  // Retrieve relevant data based on the query
  const relevantData = retrieveRelevantData(lastMessage.content)

  // Create context from retrieved data
  let context = "Relevant Information:\n"
  if (relevantData.weather) {
    context += `Weather for ${relevantData.location}: Temperature ${relevantData.weather.temp}°C, Humidity ${relevantData.weather.humidity}%, Rainfall ${relevantData.weather.rainfall}mm. Forecast: ${relevantData.weather.forecast}\n`
  }
  if (relevantData.marketPrice) {
    context += `Market Price: ${relevantData.marketPrice.price} per quintal at ${relevantData.marketPrice.market}, trend: ${relevantData.marketPrice.trend}\n`
  }
  if (relevantData.scheme) {
    context += `Scheme Info: ${relevantData.scheme.name} - ${relevantData.scheme.description}. Benefit: ${relevantData.scheme.benefit}. Application: ${relevantData.scheme.application}\n`
  }
  if (relevantData.cropAdvisory) {
    context += `Crop Advisory for ${relevantData.cropAdvisory.season}: Recommended crops: ${relevantData.cropAdvisory.crops.join(", ")}. Fertilizer recommendation: ${relevantData.cropAdvisory.fertilizers}\n`
  }

  const result = await streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages: [
      ...messages.slice(0, -1),
      {
        role: "user",
        content: `${lastMessage.content}\n\n${context}`,
      },
    ],
    temperature: 0.7,
    maxTokens: 500,
  })

  return result.toDataStreamResponse()
}

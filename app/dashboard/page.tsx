"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Bookmark,
  TrendingUp,
  Calendar,
  MapPin,
  CloudRain,
  Wheat,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { motion } from "framer-motion"

interface DashboardStats {
  totalQueries: number
  savedQueries: number
  thisWeekQueries: number
  avgResponseTime: number
}

interface RecentQuery {
  id: string
  query: string
  response: string
  timestamp: Date
  confidence: number
}

interface WeatherData {
  location: string
  temperature: number
  humidity: number
  condition: string
  forecast: string
}

interface MarketData {
  crop: string
  price: number
  change: number
  market: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalQueries: 0,
    savedQueries: 0,
    thisWeekQueries: 0,
    avgResponseTime: 0,
  })
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([])
  const [weatherData] = useState<WeatherData>({
    location: "Bareilly, UP",
    temperature: 28,
    humidity: 65,
    condition: "Partly Cloudy",
    forecast: "Light rain expected tomorrow",
  })
  const [marketData] = useState<MarketData[]>([
    { crop: "Wheat", price: 2150, change: 2.5, market: "Bareilly Mandi" },
    { crop: "Rice", price: 1850, change: -1.2, market: "Bareilly Mandi" },
    { crop: "Soybean", price: 4200, change: 3.8, market: "Nagpur Mandi" },
  ])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/dashboard")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, queriesRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/recent-queries"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (queriesRes.ok) {
        const queriesData = await queriesRes.json()
        setRecentQueries(queriesData)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    }
  }

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-green-400 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const statCards = [
    {
      title: "Total Queries",
      value: stats.totalQueries,
      icon: MessageSquare,
      color: "from-blue-500 to-cyan-400",
      change: "+12%",
    },
    {
      title: "Saved Queries",
      value: stats.savedQueries,
      icon: Bookmark,
      color: "from-green-500 to-emerald-400",
      change: "+8%",
    },
    {
      title: "This Week",
      value: stats.thisWeekQueries,
      icon: Calendar,
      color: "from-purple-500 to-pink-400",
      change: "+25%",
    },
    {
      title: "Avg Response",
      value: `${stats.avgResponseTime}s`,
      icon: Clock,
      color: "from-orange-500 to-red-400",
      change: "-0.2s",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-lime-300 bg-clip-text text-transparent">
                Welcome back, {session?.user?.name?.split(" ")[0] || "Farmer"}!
              </h1>
              <p className="text-gray-400 mt-2">Here's your agricultural intelligence dashboard</p>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-black font-medium"
            >
              <Link href="/ask">
                <Sparkles className="w-4 h-4 mr-2" />
                Ask KrishiGPT
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      <p className="text-green-400 text-sm mt-1">{stat.change} from last week</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Queries */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-green-400" />
                  Recent Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentQueries.length > 0 ? (
                  <div className="space-y-4">
                    {recentQueries.slice(0, 5).map((query, index) => (
                      <motion.div
                        key={query.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white font-medium text-sm line-clamp-2">{query.query}</p>
                          <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-400 text-xs">
                            {query.confidence}%
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm line-clamp-2 mb-2">{query.response}</p>
                        <p className="text-gray-500 text-xs">{new Date(query.timestamp).toLocaleDateString()}</p>
                      </motion.div>
                    ))}
                    <Button
                      variant="outline"
                      asChild
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                    >
                      <Link href="/saved">
                        View All Queries
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No queries yet</p>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-black"
                    >
                      <Link href="/ask">Ask Your First Question</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Weather Card */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CloudRain className="w-5 h-5 mr-2 text-blue-400" />
                  Weather Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {weatherData.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Temperature</span>
                    <span className="text-white font-semibold">{weatherData.temperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Humidity</span>
                    <span className="text-white">{weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Condition</span>
                    <span className="text-white">{weatherData.condition}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-blue-400 text-sm">{weatherData.forecast}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Prices */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
                  Market Prices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wheat className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-white">{item.crop}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹{item.price}</p>
                        <p className={`text-xs ${item.change > 0 ? "text-green-400" : "text-red-400"}`}>
                          {item.change > 0 ? "+" : ""}
                          {item.change}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <Link href="/ask">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask New Question
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <Link href="/saved">
                    <Bookmark className="w-4 h-4 mr-2" />
                    View Saved Queries
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                >
                  <Link href="/guidelines">
                    <Users className="w-4 h-4 mr-2" />
                    Usage Guidelines
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  Globe,
  Shield,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Leaf,
  CloudRain,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { motion } from "framer-motion"

export default function HomePage() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const features = [
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Ask questions in Hindi, English, or mixed languages. KrishiGPT understands your local dialect.",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: CloudRain,
      title: "Weather Intelligence",
      description: "Get hyperlocal weather forecasts and agricultural advisories for your specific region.",
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: BarChart3,
      title: "Market Rates",
      description: "Real-time mandi prices, crop trends, and market analysis to maximize your profits.",
      color: "from-yellow-500 to-orange-400",
    },
    {
      icon: Shield,
      title: "Government Schemes",
      description: "Complete information about subsidies, loans, and government support programs.",
      color: "from-purple-500 to-pink-400",
    },
    {
      icon: Mic,
      title: "Voice Enabled",
      description: "Speak your questions naturally. Perfect for farmers with limited digital literacy.",
      color: "from-red-500 to-rose-400",
    },
    {
      icon: Zap,
      title: "Instant Answers",
      description: "Get reliable, actionable advice in seconds. No more waiting for extension officers.",
      color: "from-indigo-500 to-blue-400",
    },
  ]

  const steps = [
    {
      step: "01",
      title: "Ask Your Question",
      description: "Type or speak your agricultural query in any language you're comfortable with.",
    },
    {
      step: "02",
      title: "AI Analysis",
      description: "Our AI processes your question using the latest agricultural data and research.",
    },
    {
      step: "03",
      title: "Get Expert Advice",
      description: "Receive personalized, actionable recommendations with source citations.",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-400/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-green-400 text-black font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Agricultural Intelligence
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-lime-300 to-green-400 bg-clip-text text-transparent">
              Meet KrishiGPT
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your intelligent agricultural advisor that speaks your language. Get instant answers about crops, weather,
              market prices, and government schemes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-black font-semibold px-8 py-3 text-lg"
              >
                <Link href={session ? "/ask" : "/auth/signin"}>
                  Start Asking Questions
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-green-500 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                <Link href="/guidelines">Learn How It Works</Link>
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-green-400" />
                10,000+ Farmers Helped
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-green-400" />
                15+ Languages Supported
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                99% Accuracy Rate
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-lime-300 bg-clip-text text-transparent">
              Powerful Features for Modern Farmers
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to make informed agricultural decisions, powered by cutting-edge AI technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all duration-300 group">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white group-hover:text-lime-300 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-lime-300 bg-clip-text text-transparent">
              How KrishiGPT Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple, fast, and reliable. Get expert agricultural advice in three easy steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center text-2xl font-bold text-black">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-500 to-green-400 transform translate-x-10" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-500/10 to-green-400/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Leaf className="w-16 h-16 mx-auto mb-6 text-green-400" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-lime-300 bg-clip-text text-transparent">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of farmers who are already using KrishiGPT to make smarter agricultural decisions.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-black font-semibold px-8 py-3 text-lg"
            >
              <Link href={session ? "/ask" : "/auth/signin"}>
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-400 rounded-lg flex items-center justify-center mr-3">
                <span className="text-black font-bold">K</span>
              </div>
              <span className="text-xl font-bold text-white">KrishiGPT</span>
            </div>
            <p className="text-gray-400 mb-4">Empowering farmers with AI-driven agricultural intelligence</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link href="/guidelines" className="hover:text-green-400 transition-colors">
                Guidelines
              </Link>
              <Link href="/privacy" className="hover:text-green-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-green-400 transition-colors">
                Terms of Service
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-4">© 2024 KrishiGPT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

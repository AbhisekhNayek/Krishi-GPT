"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WifiOff, Cloud, TrendingUp, BookOpen, Phone } from "lucide-react"

export default function OfflinePage() {
  const offlineData = {
    commonQueries: [
      {
        question: "When to sow wheat?",
        answer: "Sow wheat in November (15th-30th) for optimal yield. Late sowing reduces productivity.",
      },
      {
        question: "Rice fertilizer schedule",
        answer: "Apply NPK 120:60:40 kg/ha. Split nitrogen: 50% basal, 25% at tillering, 25% at panicle initiation.",
      },
      {
        question: "Cotton pest management",
        answer: "Monitor for bollworm from flowering stage. Use pheromone traps and IPM practices.",
      },
    ],
    emergencyContacts: [
      { name: "Krishi Vigyan Kendra", number: "1800-180-1551" },
      { name: "Agriculture Helpline", number: "1800-180-1551" },
      { name: "Weather Helpline", number: "1800-180-1551" },
    ],
    schemes: [
      {
        name: "PM-KISAN",
        benefit: "₹6000/year",
        eligibility: "All landholding farmers",
      },
      {
        name: "PMKSY",
        benefit: "55% subsidy on drip irrigation",
        eligibility: "All farmers",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <WifiOff className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
          <p className="text-gray-600">Access essential agricultural information without internet</p>
          <Badge variant="secondary" className="mt-2">
            Offline Mode Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Common Queries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Common Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {offlineData.commonQueries.map((item, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-medium text-gray-900">{item.question}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {offlineData.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{contact.name}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${contact.number}`}>{contact.number}</a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Government Schemes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Government Schemes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {offlineData.schemes.map((scheme, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{scheme.name}</h4>
                    <Badge variant="secondary">{scheme.benefit}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{scheme.eligibility}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weather Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="w-5 h-5 mr-2" />
                Weather Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Monsoon Season</h4>
                <p className="text-sm text-blue-700">June-September: Kharif crops, drainage management</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900">Winter Season</h4>
                <p className="text-sm text-orange-700">November-February: Rabi crops, frost protection</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900">Summer Season</h4>
                <p className="text-sm text-yellow-700">March-May: Water conservation, heat stress management</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sync Button */}
        <div className="text-center mt-8">
          <Button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700">
            Try to Reconnect
          </Button>
          <p className="text-sm text-gray-500 mt-2">Data will sync automatically when connection is restored</p>
        </div>
      </div>
    </div>
  )
}

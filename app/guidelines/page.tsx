import React from "react";
import { Mic, MapPin, WifiOff, Bell, MessageSquare } from "lucide-react";

export default function GuidelinePage() {
  const guidelines = [
    {
      icon: MessageSquare,
      title: "Ask Clear Questions",
      text: "Be specific about your crop, location, and issue for better advice.",
    },
    {
      icon: Mic,
      title: "Use Voice Input",
      text: "Tap the mic and speak your query for quick, hands-free help.",
    },
    {
      icon: MapPin,
      title: "Check Dashboard",
      text: "Monitor your crop status and get timely updates.",
    },
    {
      icon: Bell,
      title: "Stay Updated",
      text: "Look out for new features and improvements regularly.",
    },
    {
      icon: WifiOff,
      title: "Offline Mode",
      text: "Get support even with limited connectivity.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black p-8 text-white">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-lime-400 text-transparent bg-clip-text">
        🌱 KrishiGPT Guidelines
      </h1>
      <p className="text-lg text-gray-300 mb-12 max-w-2xl text-center">
        Make the most out of KrishiGPT by following these tips and best practices.
        A smarter farmer is a stronger farmer!
      </p>

      {/* Guidelines Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        {guidelines.map((g, i) => (
          <div
            key={i}
            className="bg-[#020402] border border-green-500 rounded-xl p-6 flex items-start space-x-4 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
          >
            <g.icon className="w-10 h-10 text-green-400 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-green-400">{g.title}</h3>
              <p className="text-gray-300">{g.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Do's and Don'ts */}
      <div className="mt-12 max-w-4xl w-full">
        <h2 className="text-3xl font-bold mb-4 text-lime-400">✅ Do's & ❌ Don'ts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#020402] border border-green-500 rounded-xl p-6">
            <h3 className="text-green-400 font-semibold mb-2">Do's</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Be specific about your needs</li>
              <li>Use regional language support if needed</li>
              <li>Keep checking weather updates</li>
              <li>Follow crop-specific suggestions</li>
            </ul>
          </div>
          <div className="bg-[#020402] border border-green-500 rounded-xl p-6">
            <h3 className="text-red-400 font-semibold mb-2">Don'ts</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Ignore pest or disease alerts</li>
              <li>Share incomplete location details</li>
              <li>Rely on old crop data</li>
              <li>Overlook soil health reports</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-green-500 to-lime-400 text-black px-8 py-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold">Need More Help?</h3>
        <p className="mt-2 text-lg">
          Our AI is here 24/7 to assist you with farming queries in multiple languages.
        </p>
        <button className="mt-4 bg-black text-green-400 px-6 py-2 rounded-lg border border-green-400 hover:bg-green-400 hover:text-black transition">
          Start Asking Questions
        </button>
      </div>
    </main>
  );
}

import React from "react";
import { Languages, CloudSun, Leaf, Smartphone, ShieldCheck, Wifi, BrainCircuit } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: BrainCircuit,
      title: "AI-Powered Advice",
      text: "Get instant, accurate agricultural guidance powered by cutting-edge AI.",
    },
    {
      icon: Languages,
      title: "15+ Language Support",
      text: "Ask questions in your preferred language for better understanding.",
    },
    {
      icon: CloudSun,
      title: "Real-time Weather Insights",
      text: "Receive location-based weather forecasts and crop recommendations.",
    },
    {
      icon: Leaf,
      title: "Crop Health Monitoring",
      text: "Track and improve crop conditions with expert-backed suggestions.",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      text: "Access KrishiGPT anytime, anywhere from your smartphone or tablet.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      text: "Your farming data stays private and protected.",
    },
    {
      icon: Wifi,
      title: "Offline Mode",
      text: "Get support even when you have limited or no internet connectivity.",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black p-8 text-white">
      {/* Heading */}
      <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-green-400 to-lime-400 text-transparent bg-clip-text">
        🚜 KrishiGPT Features
      </h1>
      <p className="text-lg text-gray-300 mb-12 max-w-2xl text-center">
        Powerful tools to help modern farmers make informed decisions, improve productivity, and
        stay ahead with AI-powered farming solutions.
      </p>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl w-full">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-[#020402] border border-green-500 rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
          >
            <f.icon className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-green-400">{f.title}</h3>
            <p className="text-gray-300 mt-2">{f.text}</p>
          </div>
        ))}
      </div>

      {/* Highlight Section */}
      <div className="mt-16 max-w-4xl w-full bg-gradient-to-r from-green-500 to-lime-400 text-black px-8 py-6 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold">10,000+ Farmers Empowered</h2>
        <p className="mt-2 text-lg">
          Join thousands of farmers already using KrishiGPT to boost their productivity and
          efficiency.
        </p>
        <button className="mt-4 bg-black text-green-400 px-6 py-2 rounded-lg border border-green-400 hover:bg-green-400 hover:text-black transition">
          Start Using KrishiGPT
        </button>
      </div>
    </main>
  );
}

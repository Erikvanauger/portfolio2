"use client"
import React from "react";
import { ArrowLeft, Code } from "lucide-react"
import { useTranslation } from "../hooks/useTranslation";

export default function Portfolio() {
    const {t, language, setLanguage} = useTranslation();


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => console.log("back to landing")}
              className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">{t.nav.backHome}</span>
            </button>

            <div className="flex items-center space-x-6">
              <a
                href="#projects"
                className="text-white hover:text-blue-400 transition-colors duration-300"
              >
                {t.nav.projects}
              </a>
              <a
                href="#about"
                className="text-white hover:text-purple-400 transition-colors duration-300"
              >
                {t.nav.about}
              </a>
              <a
                href="#contact"
                className="text-white hover:text-pink-400 transition-colors duration-300"
              >
                {t.nav.contact}
              </a>
            </div>
            {/* Språkändring */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "sv")}
              className="bg-black/30 text-white rounded px-2 py-1"
            >
              <option value="en">EN</option>
              <option value="sv">SV</option>
            </select>
          </div>
        </div>
      </nav>
        {/*Hero*/}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-8 inline-block">
            <Code size={48} className="text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Portfolio</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Crafting digital experiences through code, creativity, and continuous learning
          </p>
        </div>
      </section>
    </div>
  );
}

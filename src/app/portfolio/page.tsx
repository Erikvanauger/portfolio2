"use client"
import React from "react";
import { ArrowLeft, Calendar, Code, MapPin } from "lucide-react"
import { useTranslation } from "../hooks/useTranslation";

export default function Portfolio() {
    const {t, language, setLanguage} = useTranslation();
const skills = [
    "JavaScript", "React", "TypeScript", "Vue.js",
     "AWS", "Git", "Tailwind CSS"
  ];

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
            {/*Change language*/}
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
            {t.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      {/*Projects*/}
      <section id="projects" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16 text-center">
            {t.projects.titlePart1}
            <span className="ml-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              {t.projects.titlePart2}
            </span>
          </h2>
        </div>
      </section>

      {/*About*/}
      <section id="about" className="py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                About <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Me</span>
              </h2>
              
              <div className="space-y-6 text-white/80">
                <p className="text-lg leading-relaxed">
                  {t.about.description1} <br />
                  {t.about.description2} <br />
                </p>
                
                <p className="text-lg leading-relaxed">
                  {t.about.description3}
                </p>
                
                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex items-center space-x-2 text-white/60">
                    <MapPin size={18} />
                    <span>Location</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/60">
                    <Calendar size={18} />
                    <span>Available for Projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/*Skills*/}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Skills & Technologies</h3>
              <div className="grid grid-cols-3 gap-4">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center text-white hover:bg-white/20 transition-colors duration-300"
                  >
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*Contact*/}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            {t.contact.titlePart1}{" "}
            <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              {t.contact.titlePart2}
            </span>
          </h2>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60">
            © 2025 Erik Åhlberg. Built with React and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

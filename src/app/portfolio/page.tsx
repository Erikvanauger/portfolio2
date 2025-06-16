"use client"
import React from "react";
import { ArrowLeft, BriefcaseBusiness, Calendar, ChevronDown, Github, Globe, Mail, MapPin } from "lucide-react"
import { useTranslation } from "../hooks/useTranslation";
import { useRouter } from "next/navigation";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";

export default function Portfolio() {
    const {t, language, setLanguage} = useTranslation();
    const router = useRouter();
    const skills = [
    "JavaScript", "React", "TypeScript", "Vue.js",
     "AWS", "Git", "Tailwind CSS"
  ];
  const languages = [
  { id: "en", name: "English" },
  { id: "sv", name: "Svenska" },
];

  const projects = [
    {
      id: 1,
      title: "Health App",
      description: "Full-stack e-commerce solution with React, Node.js, and MongoDB. Features user authentication, payment processing, and admin dashboard.",
      technologies: ["React", "NextJS", "Tailwind"],
      image: "/api/placeholder/400/250",
      liveUrl: "https://your-project.netlify.app",
      githubUrl: "https://github.com/yourusername/project",
    },
    {
      id: 2,
      title: "Car Valuation Website",
      description: "Collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      technologies: ["React", "AWS", "Typescript"],
      image: "/api/placeholder/400/250",
      liveUrl: "https://your-project.netlify.app",
      githubUrl: "https://github.com/yourusername/project"
    },
    
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
      <nav className="bg-black/30 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="group flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="font-medium">{t.nav.backHome}</span>
            </button>
            <div className="hidden md:flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1 border border-white/20">
              <a
                href="#projects"
                className="relative px-6 py-2 text-white font-medium transition-all duration-300 rounded-full hover:bg-white/20 group"
              >
                <span className="relative z-10">{t.nav.projects}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="#about"
                className="relative px-6 py-2 text-white font-medium transition-all duration-300 rounded-full hover:bg-white/20 group"
              >
                <span className="relative z-10">{t.nav.about}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/50 to-blue-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="#contact"
                className="relative px-6 py-2 text-white font-medium transition-all duration-300 rounded-full hover:bg-white/20 group"
              >
                <span className="relative z-10">{t.nav.contact}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/50 to-orange-500/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>

            <div className="md:hidden flex items-center space-x-6 font-bold">
              <a
                href="#projects"
                className="text-white hover:text-blue-400 transition-colors duration-300 relative group"
              >
                {t.nav.projects}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a
                href="#about"
                className="text-white hover:text-purple-400 transition-colors duration-300 relative group"
              >
                {t.nav.about}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a
                href="#contact"
                className="text-white hover:text-pink-400 transition-colors duration-300 relative group"
              >
                {t.nav.contact}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-full"></div>
              </a>
            </div>

            {/* Language Selector */}
            <div className="relative z-50 w-32">
              <Listbox value={language} onChange={(val) => setLanguage(val)}>
                <div className="relative">
                  <Listbox.Button className="w-full flex items-center justify-between bg-white/10 backdrop-blur-sm text-white rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300 focus:outline-none ">
                    <span>
                      {languages.find((lang) => lang.id === language)?.name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute mt-1 w-full bg-black/50 text-white backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden">
                    {languages.map((lang) => (
                      <Listbox.Option
                        key={lang.id}
                        value={lang.id}
                        className={({ active, selected }) =>
                          clsx(
                            "px-4 py-2 cursor-pointer transition-colors",
                            active ? "bg-white/20" : "",
                            selected ? "font-semibold" : ""
                          )
                        }
                      >
                        {lang.name}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
      </nav>
      {/*Hero*/}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-8 inline-block">
            <BriefcaseBusiness size={48} className="text-white" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {projects.map((project) => (
            <div
              key={project.id}
              className="relative group bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/15"
              /* onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)} */
            >
              {/* Project Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-white/70 text-sm mb-6 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center space-x-4">
                  <a
                    /* href={project.liveUrl} */
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    <Globe size={16} />
                    <span>Live Demo</span>
                  </a>
                  <a
                    /* href={project.githubUrl} */
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    <Github size={16} />
                    <span>Code</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*About*/}
      <section id="about" className="py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                {t.about.titlePart1}{" "}
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  {t.about.titlePart2}
                </span>
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
                    <span>{t.about.iconText1}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/60">
                    <Calendar size={18} />
                    <span>{t.about.iconText2}</span>
                  </div>
                </div>
              </div>
            </div>

            {/*Skills*/}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">
                {t.skills.title}
              </h3>
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
              {" "}
              {t.contact.titlePart2}
            </span>
          </h2>

          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a
              href="mailto:your.email@example.com"
              className="flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Mail size={20} />
              <span className="font-medium">{t.contact.buttonText}</span>
            </a>

            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 hover:scale-105 border border-white/20 text-white px-8 py-4 rounded-full transition-all duration-300"
            >
              <Github size={20} />
              <span className="font-medium">GitHub</span>
            </a>
          </div>
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

"use client"
import React, { useState } from 'react';
import { Music, ArrowRight, Headphones, BriefcaseBusiness} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PortfolioLanding() {
  const [hoveredSide, setHoveredSide] = useState<"portfolio"| "music" |null>(null);
  const router = useRouter();

  return (
    <div className="h-screen w-full flex overflow-hidden bg-black">
      {/*Portfolio*/}
      <div
        className={`relative flex-1 cursor-pointer transition-all duration-700 ease-out ${
          hoveredSide === "music"
            ? "flex-[0.3]"
            : hoveredSide === "portfolio"
            ? "flex-[0.7]"
            : "flex-1"
        }`}
        onMouseEnter={() => setHoveredSide("portfolio")}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => {
          router.push('/portfolio');          
        }}
      >
        {/*Background image left*/}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/portfolio.png")' }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/*Content*/}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-8">
          <div
            className={`transform transition-all duration-500 ${
              hoveredSide === "portfolio" ? "scale-110" : "scale-100"
            }`}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-6">
              <BriefcaseBusiness size={48} className="text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
              Portfolio
            </h1>

            <p className="text-xl md:text-2xl text-center text-white/90 mb-8 max-w-md">
              Explore my development projects and technical
              work.
            </p>

            <div className="flex items-center justify-center space-x-2 text-lg font-medium">
              <span>View Projects</span>
              <ArrowRight
                size={24}
                className={`transition-transform duration-300 ${
                  hoveredSide === "portfolio" ? "translate-x-2" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 transition-opacity duration-500 ${
            hoveredSide === "portfolio" ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>

      {/* Divider Line */}
      <div className="w-px bg-white/20 relative"></div>

      {/* Music Side */}
      <div
        className={`relative flex-1 cursor-pointer transition-all duration-700 ease-out ${
          hoveredSide === "portfolio"
            ? "flex-[0.3]"
            : hoveredSide === "music"
            ? "flex-[0.7]"
            : "flex-1"
        }`}
        onMouseEnter={() => setHoveredSide("music")}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={() => {
          /* router.push('/music'); */
        }}
      >
        {/* Background image right */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/festival.png")' }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white p-8">
          <div
            className={`transform transition-all duration-500 ${
              hoveredSide === "music" ? "scale-110" : "scale-100"
            }`}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-6">
              <Music size={48} className="text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
              Music
            </h1>

            <p className="text-xl md:text-2xl text-center text-white/90 mb-8 max-w-md">
              Hobby music projects
            </p>

            <div className="flex items-center justify-center space-x-2 text-lg font-medium">
              <Headphones size={24} />
              <span>Listen Now</span>
              <ArrowRight
                size={24}
                className={`transition-transform duration-300 ${
                  hoveredSide === "music" ? "translate-x-2" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-l from-pink-400/20 to-orange-400/20 transition-opacity duration-500 ${
            hoveredSide === "music" ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>
    </div>
  );
}
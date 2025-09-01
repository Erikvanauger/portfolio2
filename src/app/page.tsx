"use client"
import React, { useState, useEffect } from 'react';
import { Music, ArrowRight, Headphones, BriefcaseBusiness, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PortfolioLanding() {
  const [hoveredSide, setHoveredSide] = useState<"portfolio"| "music" |null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const router = useRouter();

  const handleImageLoad = () => {
    setLoadedImages(prev => {
      const newCount = prev + 1;
      if (newCount === 2) {
        setTimeout(() => setIsLoading(false), 300);
      }
      return newCount;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
              <Loader2 className="absolute inset-0 w-8 h-8 text-white/60 animate-pulse m-auto" />
            </div>
            <h2 className="text-white text-xl font-semibold mb-2">Loading Portfolio</h2>
            <p className="text-white/60">Preparing your experience...</p>
            <div className="mt-4 w-48 bg-white/10 rounded-full h-2 mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500 ease-out"
                style={{ width: `${(loadedImages / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className={`min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-black transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/*Portfolio*/}
        <div
          className={`relative flex-1 cursor-pointer transition-all duration-700 ease-out md:${
            hoveredSide === "music"
              ? "flex-[0.3]"
              : hoveredSide === "portfolio"
              ? "flex-[0.7]"
              : "flex-1"
          } h-screen md:h-screen`}
          onMouseEnter={() => setHoveredSide("portfolio")}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={() => {
            router.push("/portfolio");
          }}
        >
          {/*Background image left*/}
          <div
            className="absolute inset-0 bg-cover md:bg-center bg-top"
            
          >
            <Image
              src="/portfolio.PNG"
              alt="Hero-left"
              fill
              className='object-cover'
              priority 
              onLoad={handleImageLoad}
            />

            <div className="absolute inset-0 bg-black/30 md:bg-black/20"></div>
          </div>

          {/*Content*/}
          <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-white p-4 md:p-8">
            <div
              className={`transform transition-all duration-500 text-center ${
                hoveredSide === "portfolio" ? "md:scale-110" : "scale-100"
              }`}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 md:p-6 mb-4 md:mb-6 mx-auto">
                <BriefcaseBusiness
                  size={32}
                  className="text-white md:w-12 md:h-12"
                />
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 text-center">
                Portfolio
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-center text-white/90 mb-6 md:mb-8 max-w-xs md:max-w-md mx-auto px-4">
                Explore my development projects and technical work.
              </p>

              <div className="flex items-center justify-center space-x-2 text-base md:text-lg font-medium">
                <span>View Projects</span>
                <ArrowRight
                  size={20}
                  className={`md:w-6 md:h-6 transition-transform duration-300 ${
                    hoveredSide === "portfolio" ? "md:translate-x-2" : ""
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

        {/* Divider*/}
        <div className="h-px md:h-auto md:w-px bg-white/20 relative"></div>

        {/* Music Side */}
        <div
          className={`relative flex-1 cursor-pointer  transition-all duration-700 ease-out md:${
            hoveredSide === "portfolio"
              ? "flex-[0.3]"
              : hoveredSide === "music"
              ? "flex-[0.7]"
              : "flex-1"
          } h-screen md:h-screen`}
          onMouseEnter={() => setHoveredSide("music")}
          onMouseLeave={() => setHoveredSide(null)}
          onClick={() => {
            router.push("/music");
          }}
        >
          {/* Background image right */}
          <div
            className="absolute inset-0 bg-cover md:bg-center bg-top"
          >
            <Image
              src="/festival.PNG"
              alt="Hero-right"
              fill
              className='object-cover'
              priority 
              onLoad={handleImageLoad}
            />
            <div className="absolute inset-0 bg-black/30 md:bg-black/20"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-white p-4 md:p-8">
            <div
              className={`transform transition-all duration-500 text-center ${
                hoveredSide === "music" ? "md:scale-110" : "scale-100"
              }`}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 md:p-6 mb-4 md:mb-6 mx-auto">
                <Music size={32} className="text-white md:w-12 md:h-12" />
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-4 text-center">
                Music/Hobby
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-center text-white/90 mb-6 md:mb-8 max-w-xs md:max-w-md mx-auto px-4">
                Music projects & ideas
              </p>

              <div className="flex items-center justify-center space-x-2 text-base md:text-lg font-medium">
                <Headphones size={20} className="md:w-6 md:h-6" />
                <span>Listen Now</span>
                <ArrowRight
                  size={20}
                  className={`md:w-6 md:h-6 transition-transform duration-300 ${
                    hoveredSide === "music" ? "md:translate-x-2" : ""
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
    </>
  );
}
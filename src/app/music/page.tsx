'use client'
import React, { useState, useRef, useEffect, JSX, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, X } from 'lucide-react';
import { getSongs } from './getSongs';
import MusicLibrary from './musicLibrary';

interface Track {
  id: number;
  name: string;
  url: string;
  artist?: string;
  duration?: number;
  file_path?: string;
}

interface WebkitWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

export default function MusicPlayer(): JSX.Element {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [audioData, setAudioData] = useState<number>(0.5);
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(64).fill(0));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const updateAudioData = useCallback((): void => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    // Update blob intensity
    const average =
      dataArrayRef.current.reduce((sum, value) => sum + value, 0) /
      dataArrayRef.current.length;
    const normalizedData = average / 255;

    setAudioData(isPlaying ? Math.max(0.4, normalizedData) : 0.2);

    // Update frequency data for visualizer 
    const frequencyBars = 64;
    const dataArray = dataArrayRef.current;
    const newFrequencyData: number[] = [];

    for (let i = 0; i < frequencyBars; i++) {
      const index = Math.floor(
        Math.pow(i / frequencyBars, 1.7) * dataArray.length
      );
      const value = dataArray[index] / 255;
      const enhanced = Math.min(value * 1.4, 1); // Boosts, but clips
      newFrequencyData.push(enhanced);
    }

    setFrequencyData(newFrequencyData);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateAudioData);
    }
  }, [isPlaying]);

  const setupAudioContext = useCallback((): void => {
    const audio = audioRef.current;
    if (!audio || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as unknown as WebkitWindow).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audio);
      
      analyser.fftSize = 512;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      sourceRef.current = source;
      
      updateAudioData();
    } catch (error) {
      console.error('Error setting up audio context:', error);
    }
  }, [updateAudioData]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = (): void => {
      if (audio) {
        setCurrentTime(audio.currentTime);
      }
    };
    
    const updateDuration = (): void => {
      if (audio && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    
    const handleEnded = (): void => {
      if (currentTrack < playlist.length - 1) {
        setCurrentTrack(currentTrack + 1);
      } else {
        setIsPlaying(false);
      }
    };

    const handlePlay = (): void => {
      if (!audioContextRef.current) {
        setupAudioContext();
      }
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      updateAudioData();
    };

    const handlePause = (): void => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleError = (e: Event): void => {
      console.error('Audio error:', e);
      setError('Error loading audio file');
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentTrack, playlist.length, isPlaying, setupAudioContext, updateAudioData]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Load tracks from Supabase
  const loadTracksFromDatabase = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const tracks = await getSongs();

      if (tracks.length === 0) {
        setError("No audio files found in Supabase storage. Please check your bucket name and upload some audio files.");
      } else {
        setPlaylist(tracks);
        console.log(`Successfully loaded ${tracks.length} tracks`);
      }
    } catch (err) {
      console.error("Error loading tracks:", err);
      setError(`Failed to load tracks: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracksFromDatabase();
  }, []);

  const togglePlay = (): void => {
    if (playlist.length === 0) return;
    
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => {
        console.error('Play failed:', err);
        setError('Failed to play audio. Please check the file URL.');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index: number): void => {
    if (index < 0 || index >= playlist.length) return;
    
    setCurrentTrack(index);
    setIsPlaying(true);
    setError(null); 
    
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch((err) => {
          console.error('Play failed:', err);
          setError('Failed to play audio. Please check the file URL.');
          setIsPlaying(false);
        });
      }
    }, 100);
  };

  const handlePlayTrack = (track: Track): void => {
    const index = playlist.findIndex(t => t.id === track.id);
    if (index !== -1) {
      playTrack(index);
    }
  };

  const previousTrack = (): void => {
    if (currentTrack > 0) {
      playTrack(currentTrack - 1);
    }
  };

  const nextTrack = (): void => {
    if (currentTrack < playlist.length - 1) {
      playTrack(currentTrack + 1);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>): void => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = progressBar.offsetWidth;
    const newTime = (clickX / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTrackData = playlist[currentTrack];

  // blob animation styles
  const blobScale = 0.8 + (audioData * 1.2);
  const blobOpacity = 0.6 + (audioData * 0.4);

  // Generate frequency bar styles
  const getFrequencyBarStyle = (value: number, index: number) => {
    const height = Math.max(4, value * 100);
    const hue = (index / frequencyData.length) * 360;
    const opacity = 0.8 + value * 0.2;
    const brightness = 1 + value * 0.5;
    const shadowSize = value * 10;
    
    return {
      height: `${height}%`,
      width: '4px',
      background: `linear-gradient(to top, hsl(${hue}, 70%, 60%), transparent)`,
      opacity: opacity,
      filter: `brightness(${brightness})`,
      boxShadow: `0 0 ${shadowSize}px hsl(${hue}, 70%, 60%)`,
      borderRadius: '2px 2px 0 0',
      transition: 'all 0.075s ease-out'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-neutral-800 to-zinc-700 p-4 relative overflow-hidden">
      {/* main background blob */}
      <div
        className="fixed top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{
          transform: `translate(-50%, -50%) scale(${blobScale})`,
          opacity: blobOpacity,
          transition: "transform 0.05s ease-out, opacity 0.2s ease-out",
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-700/60 via-indigo-800/60 to-cyan-600/60 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* 2nd blob top right */}
      <div
        className="fixed top-1/4 right-1/6 w-80 h-80 pointer-events-none z-0"
        style={{
          transform: `scale(${0.5 + audioData * 0.8})`,
          opacity: blobOpacity * 0.5,
          transition: "transform 0.1s ease-out, opacity 0.2s ease-out",
        }}
      >
        <div
          className="w-full h-full bg-gradient-to-tl from-cyan-400/50 via-blue-500/50 to-purple-600/50 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* 3rd blob bottom left */}
      <div
        className="fixed bottom-1/6 left-1/4 w-64 h-64 pointer-events-none z-0"
        style={{
          transform: `scale(${0.5 + audioData * 0.7})`,
          opacity: blobOpacity * 0.7,
          transition: "transform 0.15s ease-out, opacity 0.2s ease-out",
        }}
      >
        <div
          className="w-full h-full bg-gradient-to-tr from-sky-500/35 via-blue-700/35 to-indigo-800/35 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Portfolio Player
          </h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-300">
              <X size={20} />
              <span className="font-medium">Error:</span>
            </div>
            <p className="text-red-200 mt-1">{error}</p>
          </div>
        )}

        {/* Main player card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6 border border-white/20">
          {/* Music Visualizer */}
          <div className="mb-8">
            <div className="relative h-28 w-4/5 mx-auto bg-black/20 rounded-xl p-4 overflow-hidden">
              {/* Visualizer background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-2xl blur-xl" />

              {/* Frequency bars */}
              <div className="relative flex items-end justify-center gap-2 h-full">
                {frequencyData.map((value, index) => (
                  <div
                    key={index}
                    style={getFrequencyBarStyle(value, index)}
                  />
                ))}
              </div>

              {/* Reflection on eq visualizer */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/30 to-transparent rounded-b-2xl" />

              {/* Center frequency indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div
                  className="w-4 h-4 rounded-full bg-white/30 blur-sm"
                  style={{
                    transform: `scale(${1 + audioData * 2})`,
                    opacity: audioData,
                    transition: "transform 0.1s ease-out",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto mb-4">
              {/* ring around album */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-pink-400/70 to-purple-600/70 rounded-2xl blur-sm"
                style={{
                  transform: `scale(${0.9 + audioData * 0.2})`,
                  transition: "transform 0.05s ease-out",
                }}
              />
              <div className="relative w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Music size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentTrackData ? currentTrackData.name : "No track selected"}
            </h2>
            <p className="text-blue-200">
              {playlist.length > 0
                ? `Track ${currentTrack + 1} of ${playlist.length}`
                : "Add music to get started"}
            </p>
          </div>

          {/* Progress Bar */}
          {playlist.length > 0 && (
            <div className="mb-6">
              <div
                className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-2"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full transition-all duration-300"
                  style={{
                    width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-blue-200">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={previousTrack}
              disabled={currentTrack === 0 || playlist.length === 0}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <SkipBack size={24} className="text-white" />
            </button>

            <button
              onClick={togglePlay}
              disabled={playlist.length === 0}
              className="p-4 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              style={{
                transform: isPlaying
                  ? `scale(${1 + audioData * 0.15})`
                  : "scale(1)",
                transition: "transform 0.05s ease-out",
              }}
            >
              {isPlaying ? (
                <Pause size={32} className="text-white" />
              ) : (
                <Play size={32} className="text-white" />
              )}
            </button>

            <button
              onClick={nextTrack}
              disabled={
                currentTrack >= playlist.length - 1 || playlist.length === 0
              }
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <SkipForward size={24} className="text-white" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center justify-center gap-3">
            <Volume2 size={20} className="text-white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVolume(parseFloat(e.target.value))
              }
              className="w-32 accent-sky-700"
            />
            <span className="text-white text-sm w-8">
              {Math.round(volume * 100)}%
            </span>
          </div>
        </div>

        {/* Music Library Component */}
        <MusicLibrary
          playlist={playlist}
          loading={loading}
          error={error}
          onRefresh={loadTracksFromDatabase}
          onPlayTrack={handlePlayTrack}
        />

        {/* Audio Element */}
        {currentTrackData && (
          <audio
            ref={audioRef}
            src={currentTrackData.url}
            onLoadedMetadata={() => {
              const audio = audioRef.current;
              if (audio && !isNaN(audio.duration)) {
                setDuration(audio.duration);
              }
            }}
            crossOrigin="anonymous"
          />
        )}
      </div>
    </div>
  );
}
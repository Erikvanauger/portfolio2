'use client'
import React, { useState, useRef, useEffect, JSX } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Plus, Music, X } from 'lucide-react';

interface Track {
  id: number;
  name: string;
  url: string;
  file: File;
}

export default function MusicPlayer(): JSX.Element {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  

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

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;
    
    const filesArray = Array.from(files);
    const newTracks: Track[] = filesArray.map((file, index) => ({
      id: playlist.length + index,
      name: file.name.replace(/\.[^/.]+$/, ""),
      url: URL.createObjectURL(file),
      file: file
    }));
    setPlaylist([...playlist, ...newTracks]);
  };

  const togglePlay = (): void => {
    if (playlist.length === 0) return;
    
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index: number): void => {
    setCurrentTrack(index);
    setIsPlaying(true);
    setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch(console.error);
      }
    }, 100);
  };

  const previousTrack = (): void => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
      setIsPlaying(true);
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().catch(console.error);
        }
      }, 100);
    }
  };

  const nextTrack = (): void => {
    if (currentTrack < playlist.length - 1) {
      setCurrentTrack(currentTrack + 1);
      setIsPlaying(true);
      setTimeout(() => {
        const audio = audioRef.current;
        if (audio) {
          audio.play().catch(console.error);
        }
      }, 100);
    }
  };

  const removeTrack = (index: number): void => {
    const newPlaylist = playlist.filter((_, i) => i !== index);
    setPlaylist(newPlaylist);
    if (index === currentTrack && newPlaylist.length > 0) {
      setCurrentTrack(Math.min(currentTrack, newPlaylist.length - 1));
    } else if (index < currentTrack) {
      setCurrentTrack(currentTrack - 1);
    }
    if (newPlaylist.length === 0) {
      setIsPlaying(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Music Player</h1>
          <p className="text-blue-200">Your personal audio experience</p>
        </div>

        {/* Main Player Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20">
          {/* Current Track Display */}
          <div className="text-center mb-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Music size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {currentTrackData ? currentTrackData.name : 'No track selected'}
            </h2>
            <p className="text-blue-200">
              {playlist.length > 0 ? `Track ${currentTrack + 1} of ${playlist.length}` : 'Add music to get started'}
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
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
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
              className="p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isPlaying ? <Pause size={32} className="text-white" /> : <Play size={32} className="text-white" />}
            </button>
            
            <button
              onClick={nextTrack}
              disabled={currentTrack >= playlist.length - 1 || playlist.length === 0}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <SkipForward size={24} className="text-white" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-center gap-3">
            <Volume2 size={20} className="text-white" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value))}
              className="w-32 accent-purple-500"
            />
            <span className="text-white text-sm w-8">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* Add Music Button */}
        <div className="text-center mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="audio/*"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-full font-semibold transition-all duration-200 shadow-lg"
          >
            <Plus size={20} />
            Add Music
          </button>
        </div>

        {/* Playlist */}
        {playlist.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Playlist</h3>
            <div className="space-y-2">
              {playlist.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    index === currentTrack 
                      ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                  onClick={() => playTrack(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <Music size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{track.name}</p>
                      <p className="text-blue-200 text-sm">Audio File</p>
                    </div>
                  </div>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      removeTrack(index);
                    }}
                    className="p-2 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
          />
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { Music, RefreshCw, X, Info } from 'lucide-react';
import { Track } from './interfaces/track';
interface MusicLibraryProps {
  playlist: Track[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onPlayTrack: (track: Track) => void;
}

export default function MusicLibrary({
  playlist,
  loading,
  error,
  onRefresh,
  onPlayTrack,
}: MusicLibraryProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold font-nunito text-white flex items-center gap-2">
          <Music size={24} />
          Music Library
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/80">Loading tracks from database...</p>
        </div>
      ) : error && playlist.length === 0 ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <X size={32} className="text-red-400" />
          </div>
          <p className="text-red-400 text-lg mb-2">No tracks found</p>
          <p className="text-white/60 text-sm mb-4">
            Make sure you have songs in your database or audio files in your Supabase storage bucket songlist1
          </p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      ) : playlist.length === 0 ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full flex items-center justify-center mb-4">
            <Music size={32} className="text-white/60" />
          </div>
          <p className="text-white/80 text-lg mb-2">No tracks found</p>
          <p className="text-white/60 text-sm">
            Upload audio files to your songlist1 bucket or add entries to your songs database
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-white/70 text-sm mb-4">
            Found {playlist.length} track{playlist.length !== 1 ? 's' : ''}
          </div>
          {playlist.map((track) => (
            <div
              key={track.id}
              className="flex items-center justify-between bg-white/5 p-3 rounded-lg hover:bg-white/10 transition group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music size={16} className="text-white " />
                </div>
                <div className="flex flex-col min-w-0 flex-1 font-nunito">
                  <span className="text-white truncate">{track.name}</span>
                  <span className="text-white/60 text-sm truncate">
                    {track.artist}
                  </span>
                  {track.description && (
                    <div className="flex items-center gap-1 mt-1">
                      <Info size={12} className="text-white/50" />
                      <span className="text-white/50 text-xs truncate">
                        {track.description}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onPlayTrack(track)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors opacity-70 group-hover:opacity-100"
              >
                Play
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
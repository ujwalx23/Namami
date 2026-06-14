import React, { useState, useEffect, useRef } from "react";
import { useAudio } from "@/lib/AudioContext";
import { useLocation } from "@tanstack/react-router";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  ChevronDown,
  ListMusic,
} from "lucide-react";

export function FloatingPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    trackList,
    playTrack,
    progress,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    playNext,
    playPrevious,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const location = useLocation();
  const playerRef = useRef<HTMLDivElement>(null);

  // Collapse player on route navigation
  useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname]);

  // Handle click outside to minimize
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isExpanded &&
        playerRef.current &&
        !playerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
  };

  const getMinimizedIcon = () => {
    if (isPlaying) {
      return (
        <Pause
          className="hover:scale-110 transition-transform duration-300"
          size={24}
        />
      );
    }
    return (
      <Music
        className="animate-pulse hover:rotate-12 transition-transform duration-300"
        size={24}
      />
    );
  };

  // Format time (seconds -> MM:SS)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div
      ref={playerRef}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 font-devanagari select-none"
    >
      {/* Minimized View */}
      {!isExpanded && (
        <button
          onClick={handleClick}
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 border-gold bg-cream text-maroon hover:text-saffron hover:border-saffron hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
            isPlaying ? "shadow-gold animate-ripple" : "animate-ripple"
          }`}
          aria-label="Open Devotional Player"
        >
          {getMinimizedIcon()}
        </button>
      )}

      {/* Expanded Player View */}
      {isExpanded && (
        <div className="animate-fade-in w-[calc(100vw-32px)] max-w-[360px] rounded-3xl border-2 border-gold bg-cream p-5 md:p-6 shadow-sacred transition-all duration-500 ease-expo">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gold/20 pb-3 mb-4">
            <span className="text-xs uppercase tracking-wider text-saffron font-bold">
              Divine Audio Player
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                className={`text-muted-foreground hover:text-maroon transition p-1 ${isPlaylistOpen ? "text-saffron" : ""}`}
                title="Playlist"
              >
                <ListMusic size={16} />
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-maroon transition p-1"
                title="Minimize"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Track Detail Info */}
          {!currentTrack ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Please select a track from the playlist.
            </div>
          ) : !isPlaylistOpen ? (
            <div className="text-center py-2">
              {/* Title & Artist */}
              <h3 className="text-lg font-bold text-maroon line-clamp-1">{currentTrack.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {currentTrack.artist}
              </p>
            </div>
          ) : (
            /* Playlist Drawer */
            <div className="h-44 overflow-y-auto pr-1 space-y-2 mb-4 scrollbar-thin">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-2 mb-1">
                <span>Select Track</span>
                <button
                  onClick={() => setIsPlaylistOpen(false)}
                  className="hover:text-maroon cursor-pointer"
                >
                  Back
                </button>
              </div>
              {trackList.map((track) => (
                <div
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer hover:bg-gold/10 transition ${
                    currentTrack?.id === track.id
                      ? "border-gold bg-gold/10 text-maroon font-semibold"
                      : "border-transparent text-foreground/80"
                  }`}
                >
                  <Music
                    size={14}
                    className={
                      currentTrack?.id === track.id ? "text-saffron" : "text-muted-foreground"
                    }
                  />
                  <div className="text-left text-xs truncate flex-1">
                    <p className="truncate">{track.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  {currentTrack?.id === track.id && isPlaying && (
                    <span className="flex gap-0.5 h-4 items-end pb-0.5 shrink-0">
                      <span
                        className="w-0.5 bg-saffron rounded-full animate-bar-grow"
                        style={{ animationDelay: "0.1s", animationDuration: "1s" }}
                      ></span>
                      <span
                        className="w-0.5 bg-saffron rounded-full animate-bar-grow"
                        style={{ animationDelay: "0.4s", animationDuration: "0.7s" }}
                      ></span>
                      <span
                        className="w-0.5 bg-saffron rounded-full animate-bar-grow"
                        style={{ animationDelay: "0.2s", animationDuration: "1.2s" }}
                      ></span>
                      <span
                        className="w-0.5 bg-saffron rounded-full animate-bar-grow"
                        style={{ animationDelay: "0.5s", animationDuration: "0.9s" }}
                      ></span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress Bar & Seek */}
          {currentTrack && (
            <div className="mt-4">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full accent-saffron h-1 bg-muted rounded-lg appearance-none cursor-pointer focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-6 my-4">
            <button
              onClick={playPrevious}
              className="text-maroon/80 hover:text-saffron hover:scale-125 active:scale-90 transition-transform duration-300 cursor-pointer"
              title="Previous Track"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-sacred text-cream shadow-gold hover:opacity-95 hover:scale-115 active:scale-90 transition-transform duration-300 cursor-pointer ${isPlaying ? "animate-ripple" : ""}`}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </button>
            <button
              onClick={playNext}
              className="text-maroon/80 hover:text-saffron hover:scale-125 active:scale-90 transition-transform duration-300 cursor-pointer"
              title="Next Track"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2 justify-center border-t border-gold/20 pt-3">
            <button
              onClick={toggleMute}
              className="text-muted-foreground hover:text-maroon transition"
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 md:w-24 accent-saffron h-1 bg-muted rounded-lg appearance-none cursor-pointer focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}

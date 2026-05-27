import React, { useState } from "react";
import { useAudio } from "@/lib/AudioContext";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Music, 
  ChevronDown, 
  ListMusic
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
    playPrevious
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

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

  if (!currentTrack && !isExpanded) {
    // Mini entry button if no music is active yet
    return (
      <button
        onClick={() => {
          setIsExpanded(true);
          // Auto play first track on expand
          if (!currentTrack && trackList.length > 0) {
            playTrack(trackList[0]);
          }
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-card/90 shadow-sacred backdrop-blur-md text-maroon hover:text-saffron hover:scale-105 transition-all duration-300"
        aria-label="Open Devotional Player"
      >
        <Music className="animate-pulse" size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 font-devanagari select-none">
      {/* Minimized Pill View */}
      {!isExpanded && currentTrack && (
        <div 
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-gold/30 bg-card/95 shadow-sacred backdrop-blur-md cursor-pointer hover:border-gold/60 transition-all duration-300"
        >
          {/* Spin disk */}
          <div className={`relative h-10 w-10 overflow-hidden rounded-full border-2 border-gold/50 bg-maroon shrink-0 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
            <img 
              src={currentTrack.cover || "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=100"} 
              alt="" 
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 m-auto h-3 w-3 rounded-full bg-card border border-gold/50"></div>
          </div>
          <div className="max-w-[120px] md:max-w-[180px]">
            <p className="truncate text-xs font-semibold text-maroon">{currentTrack.title}</p>
            <p className="truncate text-[10px] text-muted-foreground">{isPlaying ? 'Playing...' : 'Paused'}</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-sacred text-cream shadow hover:opacity-90 transition shrink-0"
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
          </button>
        </div>
      )}

      {/* Expanded Player View */}
      {isExpanded && currentTrack && (
        <div className="w-[320px] md:w-[360px] rounded-3xl border border-gold/30 bg-card/95 p-6 shadow-sacred backdrop-blur-md transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <span className="text-xs uppercase tracking-wider text-saffron font-bold">Divine Audio Player</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                className={`text-muted-foreground hover:text-maroon transition p-1 ${isPlaylistOpen ? 'text-saffron' : ''}`}
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
          {!isPlaylistOpen ? (
            <div className="text-center py-2">
              {/* Disc Visualizer */}
              <div className="flex justify-center mb-4">
                <div className={`relative h-28 w-28 overflow-hidden rounded-full border-4 border-gold/50 bg-gradient-sacred shadow-sacred ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }}>
                  <img 
                    src={currentTrack.cover || "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=400"} 
                    alt="" 
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-card border border-gold/50 flex items-center justify-center">
                    <Music size={12} className="text-saffron animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Title & Artist */}
              <h3 className="text-lg font-bold text-maroon line-clamp-1">{currentTrack.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{currentTrack.artist}</p>
            </div>
          ) : (
            /* Playlist Drawer */
            <div className="h-44 overflow-y-auto pr-1 space-y-2 mb-4 scrollbar-thin">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-2 mb-1">
                <span>Select Track</span>
                <button onClick={() => setIsPlaylistOpen(false)} className="hover:text-maroon">Back</button>
              </div>
              {trackList.map((track) => (
                <div 
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={`flex items-center gap-3 p-2 rounded-xl border cursor-pointer hover:bg-gold/5 transition ${
                    currentTrack.id === track.id 
                      ? 'border-gold bg-gold/5 text-maroon font-semibold' 
                      : 'border-transparent text-foreground/80'
                  }`}
                >
                  <Music size={14} className={currentTrack.id === track.id ? 'text-saffron' : 'text-muted-foreground'} />
                  <div className="text-left text-xs truncate flex-1">
                    <p className="truncate">{track.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  {currentTrack.id === track.id && isPlaying && (
                    <span className="flex gap-0.5 h-3 items-end pb-0.5 shrink-0">
                      <span className="w-0.5 h-2 bg-saffron animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-0.5 h-3 bg-saffron animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      <span className="w-0.5 h-1 bg-saffron animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Progress Bar & Seek */}
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

          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-6 my-4">
            <button 
              onClick={playPrevious}
              className="text-maroon/80 hover:text-saffron hover:scale-105 transition"
              title="Previous Track"
            >
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-sacred text-cream shadow-gold hover:opacity-95 hover:scale-105 transition duration-300"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </button>
            <button 
              onClick={playNext}
              className="text-maroon/80 hover:text-saffron hover:scale-105 transition"
              title="Next Track"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2 justify-center border-t border-border pt-3">
            <button onClick={toggleMute} className="text-muted-foreground hover:text-maroon transition">
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

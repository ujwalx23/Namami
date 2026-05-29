import React, { createContext, useContext, useState, useRef, useEffect } from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover?: string;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  trackList: Track[];
  progress: number; // percentage 0-100
  duration: number; // seconds
  currentTime: number; // seconds
  seek: (value: number) => void;
  volume: number; // 0-1
  setVolume: (value: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: "1",
    title: "Maa Vindhyavasini Aarti",
    artist: "Traditional Aarti",
    url: "/audio/maa_vindhyavasini_aarti.webm",
    cover:
      "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&q=80&w=400",
  },
];

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onDurationChange = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      playNext();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  // Update volume and mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = (track: Track) => {
    if (!audioRef.current) return;

    const isSameTrack = currentTrack?.id === track.id;
    if (isSameTrack) {
      if (!isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(console.error);
      }
      return;
    }

    // Stop current
    audioRef.current.pause();
    setCurrentTrack(track);
    audioRef.current.src = track.url;
    audioRef.current.load();

    // Play new
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
  };

  const pauseTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (!currentTrack) {
      playTrack(DEFAULT_TRACKS[0]);
      return;
    }

    if (isPlaying) {
      pauseTrack();
    } else {
      audioRef.current
        ?.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const seek = (value: number) => {
    if (!audioRef.current || !duration) return;
    const newTime = (value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const setVolume = (value: number) => {
    const safeValue = Math.max(0, Math.min(1, value));
    setVolumeState(safeValue);
    if (safeValue > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playNext = () => {
    if (DEFAULT_TRACKS.length === 0) return;
    if (!currentTrack) {
      playTrack(DEFAULT_TRACKS[0]);
      return;
    }
    const currentIndex = DEFAULT_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % DEFAULT_TRACKS.length;
    playTrack(DEFAULT_TRACKS[nextIndex]);
  };

  const playPrevious = () => {
    if (DEFAULT_TRACKS.length === 0) return;
    if (!currentTrack) {
      playTrack(DEFAULT_TRACKS[0]);
      return;
    }
    const currentIndex = DEFAULT_TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + DEFAULT_TRACKS.length) % DEFAULT_TRACKS.length;
    playTrack(DEFAULT_TRACKS[prevIndex]);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
        togglePlay,
        trackList: DEFAULT_TRACKS,
        progress,
        duration,
        currentTime,
        seek,
        volume,
        setVolume,
        isMuted,
        toggleMute,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

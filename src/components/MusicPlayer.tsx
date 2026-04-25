import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Grid Drift',
    artist: 'AI SynthEngine v1',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_22f7b8c7e0.mp3',
    duration: '2:38'
  },
  {
    id: 2,
    title: 'Cybernetic Overture',
    artist: 'Neural Beats',
    url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_823193eec3.mp3',
    duration: '2:12'
  },
  {
    id: 3,
    title: 'Data Stream Override',
    artist: 'Ghost in the Module',
    url: 'https://cdn.pixabay.com/audio/2021/11/25/audio_91b3cb81ed.mp3',
    duration: '1:54'
  }
];

export function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIdx];

  // Initialize and clean up audio
  useEffect(() => {
    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.loop = false;
    audioRef.current.volume = isMuted ? 0 : 0.5;

    const updateProgress = () => {
      if (audioRef.current) {
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
      }
    };

    const handleEnded = () => {
      handleNext();
    };

    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('ended', handleEnded);

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => setIsPlaying(false));
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIdx]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : 0.5;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleNext = () => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="w-full max-w-sm ml-auto mr-auto lg:mr-0 lg:ml-0 bg-black/60 border border-fuchsia-500/30 rounded-2xl p-4 backdrop-blur-md shadow-[0_0_30px_rgba(217,70,239,0.15)] flex flex-col gap-4">
      {/* Vinyl/Currently Playing Visualizer area */}
      <div className="flex items-center gap-4">
        <div className={`relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-600 to-indigo-900 shadow-[0_0_15px_rgba(217,70,239,0.5)] ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
           <Disc3 className="text-white/80 w-10 h-10" />
           <div className="absolute w-3 h-3 bg-black rounded-full border border-fuchsia-400"></div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="w-full text-xs font-mono text-fuchsia-400/80 mb-1 tracking-wider uppercase">Now Playing</div>
          <h3 className="text-base font-bold text-white truncate text-shadow-neon">{currentTrack.title}</h3>
          <p className="text-sm text-cyan-300/80 truncate font-mono">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-300 ease-linear shadow-[0_0_8px_theme('colors.fuchsia.500')]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={toggleMute}
          className="text-cyan-400/70 hover:text-cyan-400 transition-colors p-2"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={handlePrev}
            className="text-fuchsia-400 hover:text-fuchsia-300 hover:shadow-[0_0_10px_theme('colors.fuchsia.400')] rounded-full p-2 transition-all"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button 
            onClick={togglePlay}
            className="bg-fuchsia-500 hover:bg-fuchsia-400 text-black border border-fuchsia-300 shadow-[0_0_15px_theme('colors.fuchsia.500')] rounded-full w-12 h-12 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button 
            onClick={handleNext}
            className="text-fuchsia-400 hover:text-fuchsia-300 hover:shadow-[0_0_10px_theme('colors.fuchsia.400')] rounded-full p-2 transition-all"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>

        <div className="text-xs font-mono text-cyan-400/50 w-8 text-right">
          {isPlaying ? (
            <div className="flex gap-0.5 items-end justify-end h-3">
              <div className="w-1 bg-cyan-400 animate-[bounce_1s_infinite] shadow-[0_0_5px_theme('colors.cyan.400')]"></div>
              <div className="w-1 bg-fuchsia-400 animate-[bounce_1.2s_infinite] shadow-[0_0_5px_theme('colors.fuchsia.400')]"></div>
              <div className="w-1 bg-cyan-400 animate-[bounce_0.8s_infinite] shadow-[0_0_5px_theme('colors.cyan.400')]"></div>
            </div>
          ) : (
            '--'
          )}
        </div>
      </div>
    </div>
  );
}

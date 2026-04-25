import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-fuchsia-500/30 overflow-x-hidden border-t-4 border-fuchsia-500">
      
      {/* Futuristic Grid Background (CSS generated) */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00f0ff15 1px, transparent 1px),
            linear-gradient(to bottom, #00f0ff15 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between w-full mb-8 sm:mb-12 gap-8">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
              NEON_SNAKE
            </h1>
          </div>

          <div className="flex bg-black/40 border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.1)] rounded-full px-6 py-2 pb-2 backdrop-blur-sm">
            <span className="text-cyan-400 font-mono text-sm tracking-widest mr-4 opacity-70 flex items-center">SCORE</span>
            <span className="text-fuchsia-400 font-mono text-2xl font-bold tracking-wider text-shadow-neon">{score.toString().padStart(4, '0')}</span>
          </div>
        </header>

        {/* Main Content Layout */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full">
          
          {/* Decorative left sidebar elements (hidden on mobile) */}
          <div className="hidden xl:flex flex-col gap-4 text-cyan-500/20 font-mono text-xs uppercase origin-top-left -rotate-90 absolute left-8 top-1/2">
            <span>System.Online // Access.Granted</span>
            <span>Grid.Size: 20x20 // Delay: 120ms</span>
          </div>

          <main className="flex-shrink-0 animate-in fade-in zoom-in duration-700 ease-out">
            <SnakeGame onScoreChange={setScore} />
          </main>

          <aside className="w-full lg:w-auto animate-in fade-in slide-in-from-right-8 duration-700 delay-150 fill-mode-both ease-out">
            <MusicPlayer />
          </aside>

        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs font-mono text-cyan-500/40 uppercase tracking-widest">
          SYS.VER_0.9.4 // AI_GENERATED_AUDIO // REACT.19
        </footer>
      </div>
    </div>
  );
}


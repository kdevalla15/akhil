import { useState, useCallback, useEffect } from 'react';
import { useInterval } from '../hooks/useInterval';

export type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const [dirQueue, setDirQueue] = useState<Point[]>([]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setDirQueue([]);
    onScoreChange(0);
  }, [generateFood, onScoreChange]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      let currentDir = direction;
      
      setDirQueue((prevQueue) => {
        if (prevQueue.length > 0) {
          currentDir = prevQueue[0];
          return prevQueue.slice(1);
        }
        return prevQueue;
      });

      setDirection(currentDir);
      
      const head = prevSnake[0];
      const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, onScoreChange]);

  useInterval(moveSnake, gameOver || isPaused ? null : 120);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling functionality for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused((p) => !p);
        return;
      }

      setDirQueue((prevQueue) => {
        const lastDir = prevQueue.length > 0 ? prevQueue[prevQueue.length - 1] : direction;
        let newDir: Point | null = null;

        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            if (lastDir.y !== 1) newDir = { x: 0, y: -1 };
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            if (lastDir.y !== -1) newDir = { x: 0, y: 1 };
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            if (lastDir.x !== 1) newDir = { x: -1, y: 0 };
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            if (lastDir.x !== -1) newDir = { x: 1, y: 0 };
            break;
        }

        if (newDir) {
           // Limit queue size to avoid massive queues of rapid key presses
           if (prevQueue.length < 3) {
             return [...prevQueue, newDir];
           }
           return prevQueue;
        }
        return prevQueue;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative border-4 border-cyan-500 rounded-xl shadow-[0_0_20px_theme('colors.cyan.500')] bg-black/50 overflow-hidden backdrop-blur-sm">
        
        {/* Game Grid */}
        <div 
          className="grid gap-px bg-cyan-950/20 p-2"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={idx} 
                className={`w-4 h-4 sm:w-6 sm:h-6 rounded-sm transition-all duration-75 ${
                  isHead ? 'bg-fuchsia-400 shadow-[0_0_10px_theme("colors.fuchsia.400")] z-10' :
                  isSnake ? 'bg-cyan-400 shadow-[0_0_8px_theme("colors.cyan.400")]' :
                  isFood ? 'bg-rose-500 shadow-[0_0_12px_theme("colors.rose.500")] animate-pulse rounded-full' :
                  'bg-transparent'
                }`}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-4 text-rose-500 tracking-wider shadow-[0_0_10px_theme('colors.rose.500')] text-shadow-neon">SYSTEM FAILURE</h2>
            <div className="text-xl text-cyan-300 mb-6 font-mono">SCORE: {score}</div>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold rounded hover:bg-cyan-400/20 hover:shadow-[0_0_15px_theme('colors.cyan.400')] transition-all tracking-widest"
            >
              REBOOT
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-4 text-amber-400 tracking-wider text-shadow-neon">PAUSED</h2>
            <p className="text-cyan-300/70 font-mono">Press SPACE to resume</p>
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-cyan-500/50 font-mono flex gap-4">
        <span>WASD / ARROWS to move</span>
        <span>SPACE to pause</span>
      </p>
    </div>
  );
}

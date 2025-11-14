"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Gamepad2, X, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GameConfig {
  dinoColor: string;
  obstacleColor: string;
  groundColor: string;
  skyColor: string;
  textColor: string;
  gameTitle: string;
}

const defaultConfig: GameConfig = {
  dinoColor: "#4a5568",
  obstacleColor: "#e53e3e",
  groundColor: "#2d3748",
  skyColor: "#1a202c",
  textColor: "#e2e8f0",
  gameTitle: "RunBound",
};

export default function Game() {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameOver">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [config, setConfig] = useState<GameConfig>(defaultConfig);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const runnerImageRef = useRef<HTMLImageElement | null>(null);
  const hurdleImageRef = useRef<HTMLImageElement | null>(null);
  const imagesLoadedRef = useRef(false);
  const dinoRef = useRef({
    x: 50,
    y: 0,
    width: 60,
    height: 60,
    velocityY: 0,
    isJumping: false,
    groundY: 0,
  });
  const obstaclesRef = useRef<Array<{ x: number; y: number; width: number; height: number }>>([]);
  const gameSpeedRef = useRef(5);
  const lastObstacleTimeRef = useRef(0);
  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentScoreRef = useRef(0);

  // Initialize game
  const initGame = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const groundY = canvas.height - 80;
    
    dinoRef.current = {
      x: 50,
      y: groundY - 60,
      width: 60,
      height: 60,
      velocityY: 0,
      isJumping: false,
      groundY: groundY - 60,
    };
    
    obstaclesRef.current = [];
    gameSpeedRef.current = 3;
    lastObstacleTimeRef.current = 0;
    currentScoreRef.current = 0;
    setScore(0);
    setGameState("playing");
  }, []);

  // Jump function
  const jump = useCallback(() => {
    if (gameState !== "playing" || dinoRef.current.isJumping) return;
    
    dinoRef.current.velocityY = -15;
    dinoRef.current.isJumping = true;
  }, [gameState]);

  // Check collision with padding for better feel
  const checkCollision = useCallback(() => {
    const dino = dinoRef.current;
    const padding = 5; // Collision padding for better feel
    
    for (const obstacle of obstaclesRef.current) {
      if (
        dino.x + padding < obstacle.x + obstacle.width - padding &&
        dino.x + dino.width - padding > obstacle.x + padding &&
        dino.y + padding < obstacle.y + obstacle.height - padding &&
        dino.y + dino.height - padding > obstacle.y + padding
      ) {
        return true;
      }
    }
    return false;
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw sky
      ctx.fillStyle = config.skyColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      const groundY = canvas.height - 80;
      ctx.fillStyle = config.groundColor;
      ctx.fillRect(0, groundY, canvas.width, 80);
      
      // Ground line
      ctx.strokeStyle = config.textColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      // Update dino
      const dino = dinoRef.current;
      dino.velocityY += 0.8; // Gravity
      dino.y += dino.velocityY;

      // Ground collision
      if (dino.y >= dino.groundY) {
        dino.y = dino.groundY;
        dino.velocityY = 0;
        dino.isJumping = false;
      }

      // Draw runner
      if (runnerImageRef.current && imagesLoadedRef.current) {
        ctx.drawImage(
          runnerImageRef.current,
          dino.x,
          dino.y,
          dino.width,
          dino.height
        );
      } else {
        // Fallback rectangle while images load
        ctx.fillStyle = config.dinoColor;
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
      }

      // Update obstacles
      const now = Date.now();
      const obstacleInterval = Math.max(800, 2000 - gameSpeedRef.current * 50);
      if (now - lastObstacleTimeRef.current > obstacleInterval) {
        const obstacleWidth = 40;
        const obstacleHeight = hurdleImageRef.current 
          ? hurdleImageRef.current.height * (obstacleWidth / hurdleImageRef.current.width) 
          : 40;
        obstaclesRef.current.push({
          x: canvas.width,
          y: groundY - obstacleHeight,
          width: obstacleWidth,
          height: obstacleHeight,
        });
        lastObstacleTimeRef.current = now;
      }

      // Move and draw obstacles
      obstaclesRef.current = obstaclesRef.current.filter((obstacle) => {
        obstacle.x -= gameSpeedRef.current;
        
        // Draw hurdle
        if (hurdleImageRef.current && imagesLoadedRef.current) {
          ctx.drawImage(
            hurdleImageRef.current,
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
          );
        } else {
          // Fallback rectangle while images load
          ctx.fillStyle = config.obstacleColor;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
        
        return obstacle.x + obstacle.width > 0;
      });

      // Increase game speed based on time and score (more aggressive)
      const baseSpeedIncrease = 0.005; // Base speed increase per frame
      const scoreBasedIncrease = currentScoreRef.current * 0.0001; // Additional speed based on score
      const totalIncrease = baseSpeedIncrease + scoreBasedIncrease;
      gameSpeedRef.current = Math.min(gameSpeedRef.current + totalIncrease, 20);

      // Check collision
      if (checkCollision()) {
        setGameState("gameOver");
        setScore((currentScore) => {
          if (currentScore > highScore) {
            setHighScore(currentScore);
            localStorage.setItem("gameHighScore", currentScore.toString());
          }
          return currentScore;
        });
        return;
      }

      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, config, checkCollision, highScore]);

  // Score increment
  useEffect(() => {
    if (gameState !== "playing") {
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
        scoreIntervalRef.current = null;
      }
      return;
    }

    scoreIntervalRef.current = setInterval(() => {
      setScore((prev) => {
        const newScore = prev + 1;
        currentScoreRef.current = newScore;
        return newScore;
      });
    }, 100);

    return () => {
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
        scoreIntervalRef.current = null;
      }
    };
  }, [gameState]);

  // Reset game when window closes
  useEffect(() => {
    if (!isOpen && gameState === "playing") {
      setGameState("idle");
      setScore(0);
      currentScoreRef.current = 0;
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
        scoreIntervalRef.current = null;
      }
    }
  }, [isOpen, gameState]);

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        if (gameState === "idle") {
          initGame();
        } else if (gameState === "playing") {
          jump();
        } else if (gameState === "gameOver") {
          initGame();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, gameState, initGame, jump]);

  // Load images
  useEffect(() => {
    const runnerImg = new Image();
    const hurdleImg = new Image();
    
    runnerImg.src = "/assets/runner.png";
    hurdleImg.src = "/assets/hurdle.png";
    
    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        runnerImageRef.current = runnerImg;
        hurdleImageRef.current = hurdleImg;
        imagesLoadedRef.current = true;
      }
    };
    
    runnerImg.onload = checkLoaded;
    hurdleImg.onload = checkLoaded;
    runnerImg.onerror = () => console.error("Failed to load runner image");
    hurdleImg.onerror = () => console.error("Failed to load hurdle image");
  }, []);

  // Load high score (client-side only to avoid hydration mismatch)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gameHighScore");
      if (saved) {
        setHighScore(parseInt(saved, 10));
      }
    }
  }, []);

  // Handle canvas click/tap for mobile
  const handleCanvasClick = () => {
    if (gameState === "idle") {
      initGame();
    } else if (gameState === "playing") {
      jump();
    } else if (gameState === "gameOver") {
      initGame();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full",
          "bg-gradient-to-br from-primary to-secondary text-primary-foreground",
          "shadow-lg shadow-primary/20 border border-primary/30",
          "hover:shadow-xl hover:shadow-primary/30 hover:scale-110",
          "transition-all duration-300 backdrop-blur-sm"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle game"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Gamepad2 className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Game Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className={cn(
              "fixed bottom-24 left-6 z-40 flex flex-col",
              "rounded-2xl border border-muted/30 bg-card/95 backdrop-blur-xl",
              "shadow-2xl shadow-primary/10",
              "overflow-hidden w-[500px] max-w-[calc(100vw-3rem)]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-muted/30 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">{config.gameTitle}</h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  High: {highScore}
                </span>
                <button
                  onClick={initGame}
                  className="rounded-lg p-1.5 hover:bg-muted/50 transition-colors"
                  aria-label="Restart game"
                >
                  <RotateCcw className="h-4 w-4 text-foreground" />
                </button>
              </div>
            </div>

            {/* Game Canvas */}
            <div className="relative bg-background">
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                onClick={handleCanvasClick}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleCanvasClick();
                }}
                className="w-full h-auto cursor-pointer touch-none"
                style={{ backgroundColor: config.skyColor }}
              />
              
              {/* Overlay Messages */}
              {gameState === "idle" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                >
                  <p className="text-lg font-semibold mb-2" style={{ color: config.textColor }}>
                    Click or Press Space to Start
                  </p>
                  <p className="text-sm" style={{ color: config.textColor, opacity: 0.7 }}>
                    Tap/Click to Jump
                  </p>
                </motion.div>
              )}
              
              {gameState === "gameOver" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/40"
                >
                  <p className="text-2xl font-bold mb-2" style={{ color: config.textColor }}>
                    Game Over!
                  </p>
                  <p className="text-lg mb-1" style={{ color: config.textColor }}>
                    Score: {score}
                  </p>
                  {score >= highScore && score > 0 && (
                    <p className="text-sm mb-4 text-primary font-semibold">
                      New High Score! 🎉
                    </p>
                  )}
                  <p className="text-sm" style={{ color: config.textColor, opacity: 0.7 }}>
                    Click or Press Space to Restart
                  </p>
                </motion.div>
              )}

              {/* Score Display */}
              {gameState === "playing" && (
                <div className="absolute top-4 left-4 pointer-events-none">
                  <p className="text-xl font-bold" style={{ color: config.textColor }}>
                    Score: {score}
                  </p>
                </div>
              )}
            </div>

            {/* Controls Info */}
            <div className="border-t border-muted/30 bg-background/50 backdrop-blur-sm p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Space / Click / Tap to Jump</span>
                <span>Auto-run enabled</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


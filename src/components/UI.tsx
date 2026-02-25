import { useCallback, useEffect, useState } from 'react'
import { useGame } from '../context/GameContext'

interface UIProps {
  score: number
  highScore: number
  gameState: 'idle' | 'playing' | 'paused' | 'gameover'
  showInstructions: boolean
  onStart: () => void
  onRestart: () => void
  onPause: () => void
  onResume: () => void
}

export function UI({
  score,
  highScore,
  gameState,
  showInstructions,
  onStart,
  onRestart,
  onPause,
  onResume
}: UIProps) {
  const { setDirection } = useGame()
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  // Handle swipe controls for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart || gameState !== 'playing') return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const minSwipe = 30

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > minSwipe) setDirection('RIGHT')
      else if (deltaX < -minSwipe) setDirection('LEFT')
    } else {
      if (deltaY > minSwipe) setDirection('DOWN')
      else if (deltaY < -minSwipe) setDirection('UP')
    }

    setTouchStart(null)
  }, [touchStart, gameState, setDirection])

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-3 md:p-6">
        {/* Score display */}
        <div
          className="p-2 md:p-4 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(255,0,255,0.1) 100%)',
            border: '2px solid rgba(0,255,255,0.5)',
            boxShadow: '0 0 20px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.1)'
          }}
        >
          <p
            className="text-[10px] md:text-xs uppercase tracking-wider mb-1"
            style={{
              color: '#00ffff',
              fontFamily: "'Press Start 2P', monospace",
              textShadow: '0 0 10px #00ffff'
            }}
          >
            Score
          </p>
          <p
            className="text-xl md:text-3xl"
            style={{
              color: '#ffff00',
              fontFamily: "'Press Start 2P', monospace",
              textShadow: '0 0 15px #ffff00, 0 0 30px #ffaa00'
            }}
          >
            {score.toString().padStart(5, '0')}
          </p>
        </div>

        {/* High Score */}
        <div
          className="p-2 md:p-4 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(255,0,255,0.1) 0%, rgba(0,255,255,0.1) 100%)',
            border: '2px solid rgba(255,0,255,0.5)',
            boxShadow: '0 0 20px rgba(255,0,255,0.3), inset 0 0 20px rgba(255,0,255,0.1)'
          }}
        >
          <p
            className="text-[10px] md:text-xs uppercase tracking-wider mb-1"
            style={{
              color: '#ff00ff',
              fontFamily: "'Press Start 2P', monospace",
              textShadow: '0 0 10px #ff00ff'
            }}
          >
            High
          </p>
          <p
            className="text-xl md:text-3xl"
            style={{
              color: '#00ff00',
              fontFamily: "'Press Start 2P', monospace",
              textShadow: '0 0 15px #00ff00, 0 0 30px #00aa00'
            }}
          >
            {highScore.toString().padStart(5, '0')}
          </p>
        </div>
      </div>

      {/* Pause Button - only show during gameplay */}
      {gameState === 'playing' && (
        <button
          className="absolute top-20 md:top-24 right-3 md:right-6 pointer-events-auto p-2 md:p-3 rounded-lg transition-all hover:scale-110"
          style={{
            background: 'rgba(255,0,255,0.2)',
            border: '2px solid rgba(255,0,255,0.6)',
            boxShadow: '0 0 15px rgba(255,0,255,0.4)',
            fontFamily: "'Press Start 2P', monospace",
            color: '#ff00ff',
            textShadow: '0 0 10px #ff00ff'
          }}
          onClick={onPause}
        >
          <span className="text-sm md:text-base">||</span>
        </button>
      )}

      {/* Center Overlays */}
      {showInstructions && gameState === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div
            className="text-center p-4 md:p-8 rounded-xl max-w-[90vw] md:max-w-md mx-4"
            style={{
              background: 'linear-gradient(180deg, rgba(10,0,30,0.95) 0%, rgba(30,0,50,0.95) 100%)',
              border: '3px solid #00ffff',
              boxShadow: '0 0 40px rgba(0,255,255,0.4), inset 0 0 40px rgba(0,255,255,0.1), 0 0 80px rgba(255,0,255,0.2)'
            }}
          >
            <h1
              className="text-2xl md:text-4xl mb-4 md:mb-6"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: '#00ff00',
                textShadow: '0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00aa00',
                lineHeight: 1.3
              }}
            >
              SNAKE
            </h1>
            <p
              className="text-[10px] md:text-sm mb-4 md:mb-6 leading-relaxed"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: '#00ffff',
                textShadow: '0 0 10px #00ffff'
              }}
            >
              RETRO EDITION
            </p>

            <div
              className="mb-6 md:mb-8 text-left p-3 md:p-4 rounded-lg"
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(0,255,255,0.3)'
              }}
            >
              <p
                className="text-[8px] md:text-xs mb-3 uppercase"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#ffff00',
                  textShadow: '0 0 10px #ffff00'
                }}
              >
                Controls
              </p>
              <p
                className="text-[8px] md:text-[10px] mb-2"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#ffffff',
                  lineHeight: 2
                }}
              >
                <span className="hidden md:inline">Arrow Keys / WASD</span>
                <span className="md:hidden">Swipe to move</span>
              </p>
              <p
                className="text-[8px] md:text-[10px] hidden md:block"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#ffffff',
                  lineHeight: 2
                }}
              >
                Space to pause
              </p>
            </div>

            <button
              className="px-6 py-3 md:px-8 md:py-4 text-xs md:text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                background: 'linear-gradient(180deg, #00ff00 0%, #00aa00 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#000000',
                boxShadow: '0 0 30px rgba(0,255,0,0.6), 0 4px 0 #006600',
                cursor: 'pointer'
              }}
              onClick={onStart}
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Paused Overlay */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div
            className="text-center p-6 md:p-8 rounded-xl mx-4"
            style={{
              background: 'rgba(10,0,30,0.95)',
              border: '3px solid #ffff00',
              boxShadow: '0 0 40px rgba(255,255,0,0.4)'
            }}
          >
            <h2
              className="text-xl md:text-3xl mb-6 md:mb-8"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: '#ffff00',
                textShadow: '0 0 20px #ffff00'
              }}
            >
              PAUSED
            </h2>
            <button
              className="px-6 py-3 md:px-8 md:py-4 text-xs md:text-sm uppercase tracking-wider transition-all hover:scale-105"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                background: 'linear-gradient(180deg, #00ffff 0%, #0088aa 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#000000',
                boxShadow: '0 0 30px rgba(0,255,255,0.6), 0 4px 0 #006666',
                cursor: 'pointer'
              }}
              onClick={onResume}
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <div
            className="text-center p-6 md:p-8 rounded-xl mx-4"
            style={{
              background: 'linear-gradient(180deg, rgba(50,0,0,0.95) 0%, rgba(30,0,30,0.95) 100%)',
              border: '3px solid #ff0000',
              boxShadow: '0 0 40px rgba(255,0,0,0.5), 0 0 80px rgba(255,0,0,0.3)'
            }}
          >
            <h2
              className="text-xl md:text-3xl mb-4"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: '#ff0000',
                textShadow: '0 0 20px #ff0000, 0 0 40px #ff0000'
              }}
            >
              GAME OVER
            </h2>
            <p
              className="text-lg md:text-2xl mb-2"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: '#ffff00',
                textShadow: '0 0 15px #ffff00'
              }}
            >
              {score}
            </p>
            <p
              className="text-[10px] md:text-xs mb-6 md:mb-8"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: '#00ffff',
                textShadow: '0 0 10px #00ffff'
              }}
            >
              {score >= highScore && score > 0 ? 'NEW HIGH SCORE!' : 'POINTS'}
            </p>
            <button
              className="px-6 py-3 md:px-8 md:py-4 text-xs md:text-sm uppercase tracking-wider transition-all hover:scale-105"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                background: 'linear-gradient(180deg, #ff00ff 0%, #aa0088 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                boxShadow: '0 0 30px rgba(255,0,255,0.6), 0 4px 0 #660044',
                cursor: 'pointer'
              }}
              onClick={onRestart}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Mobile Controls - D-Pad */}
      {gameState === 'playing' && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 md:hidden pointer-events-auto">
          <div className="relative w-36 h-36">
            {/* Up */}
            <button
              className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-lg active:scale-95"
              style={{
                background: 'rgba(0,255,255,0.3)',
                border: '2px solid rgba(0,255,255,0.6)',
                boxShadow: '0 0 15px rgba(0,255,255,0.3)'
              }}
              onTouchStart={() => setDirection('UP')}
            >
              <span className="text-cyan-400 text-xl">^</span>
            </button>
            {/* Down */}
            <button
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-lg active:scale-95"
              style={{
                background: 'rgba(0,255,255,0.3)',
                border: '2px solid rgba(0,255,255,0.6)',
                boxShadow: '0 0 15px rgba(0,255,255,0.3)'
              }}
              onTouchStart={() => setDirection('DOWN')}
            >
              <span className="text-cyan-400 text-xl rotate-180 inline-block">^</span>
            </button>
            {/* Left */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg active:scale-95"
              style={{
                background: 'rgba(0,255,255,0.3)',
                border: '2px solid rgba(0,255,255,0.6)',
                boxShadow: '0 0 15px rgba(0,255,255,0.3)'
              }}
              onTouchStart={() => setDirection('LEFT')}
            >
              <span className="text-cyan-400 text-xl -rotate-90 inline-block">^</span>
            </button>
            {/* Right */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg active:scale-95"
              style={{
                background: 'rgba(0,255,255,0.3)',
                border: '2px solid rgba(0,255,255,0.6)',
                boxShadow: '0 0 15px rgba(0,255,255,0.3)'
              }}
              onTouchStart={() => setDirection('RIGHT')}
            >
              <span className="text-cyan-400 text-xl rotate-90 inline-block">^</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

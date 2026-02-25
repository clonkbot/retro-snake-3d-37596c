import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback } from 'react'
import { Game } from './components/Game'
import { UI } from './components/UI'
import { GameProvider, useGame } from './context/GameContext'

function AppContent() {
  const { gameState, score, highScore, startGame, pauseGame, resumeGame } = useGame()
  const [showInstructions, setShowInstructions] = useState(true)

  const handleStart = useCallback(() => {
    setShowInstructions(false)
    startGame()
  }, [startGame])

  const handleRestart = useCallback(() => {
    startGame()
  }, [startGame])

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* CRT Scanlines Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          mixBlendMode: 'multiply'
        }}
      />

      {/* CRT Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 12, 8], fov: 50 }}
        style={{ background: 'linear-gradient(180deg, #0a0015 0%, #1a0030 50%, #0a0020 100%)' }}
      >
        <Suspense fallback={null}>
          <Game />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <UI
        score={score}
        highScore={highScore}
        gameState={gameState}
        showInstructions={showInstructions}
        onStart={handleStart}
        onRestart={handleRestart}
        onPause={pauseGame}
        onResume={resumeGame}
      />

      {/* Footer */}
      <footer className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center z-30">
        <p
          className="text-[10px] md:text-xs tracking-widest uppercase"
          style={{
            color: 'rgba(0, 255, 255, 0.4)',
            fontFamily: "'Press Start 2P', monospace",
            textShadow: '0 0 10px rgba(0, 255, 255, 0.2)'
          }}
        >
          Requested by @Nishant293 · Built by @clonkbot
        </p>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'
import { Snake } from './Snake'
import { Food } from './Food'
import { Grid } from './Grid'

export function Game() {
  const { gameState, gridSize } = useGame()
  const groupRef = useRef<THREE.Group>(null!)

  // Subtle scene rotation when idle
  useFrame((state) => {
    if (groupRef.current && gameState === 'idle') {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <>
      {/* Ambient lighting with retro purple tint */}
      <ambientLight intensity={0.3} color="#ff00ff" />

      {/* Main directional light */}
      <directionalLight
        position={[10, 20, 5]}
        intensity={0.5}
        color="#00ffff"
        castShadow
      />

      {/* Point lights for neon glow effect */}
      <pointLight position={[-gridSize, 5, -gridSize]} intensity={1} color="#ff00ff" distance={30} />
      <pointLight position={[gridSize, 5, gridSize]} intensity={1} color="#00ffff" distance={30} />
      <pointLight position={[0, 8, 0]} intensity={0.5} color="#ffff00" distance={25} />

      {/* Subtle fog for depth */}
      <fog attach="fog" args={['#0a0015', 15, 40]} />

      {/* Game elements */}
      <group ref={groupRef}>
        <Grid gridSize={gridSize} />
        <Snake />
        <Food />
      </group>

      {/* Camera controls - disabled during gameplay for better experience */}
      <OrbitControls
        enablePan={false}
        enableZoom={gameState !== 'playing'}
        enableRotate={gameState !== 'playing'}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={10}
        maxDistance={25}
        target={[0, 0, 0]}
      />
    </>
  )
}

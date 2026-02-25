import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

export function Food() {
  const { food, gameState } = useGame()
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.PointLight>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      // Floating and rotating animation
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      meshRef.current.rotation.y += 0.03
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
    if (glowRef.current) {
      // Pulsing glow
      glowRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.5
    }
    if (ringRef.current) {
      // Rotating ring
      ringRef.current.rotation.z += 0.02
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  if (gameState === 'idle') return null

  return (
    <group position={[food.x, 0, food.z]}>
      {/* Main food item - glowing cube */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color="#ffff00"
          emissive="#ffaa00"
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Outer rotating ring */}
      <mesh ref={ringRef} position={[0, 0.5, 0]}>
        <torusGeometry args={[0.6, 0.05, 8, 16]} />
        <meshBasicMaterial color="#ff00ff" opacity={0.7} transparent />
      </mesh>

      {/* Ground glow effect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.8, 16]} />
        <meshBasicMaterial
          color="#ffff00"
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Point light for glow */}
      <pointLight
        ref={glowRef}
        position={[0, 0.5, 0]}
        intensity={1}
        color="#ffff00"
        distance={4}
      />
    </group>
  )
}

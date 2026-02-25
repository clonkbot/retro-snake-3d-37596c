import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '../context/GameContext'

export function Snake() {
  const { snake, direction, gameState } = useGame()
  const groupRef = useRef<THREE.Group>(null!)

  // Calculate rotation based on direction
  const headRotation = useMemo(() => {
    switch (direction) {
      case 'UP': return Math.PI
      case 'DOWN': return 0
      case 'LEFT': return Math.PI / 2
      case 'RIGHT': return -Math.PI / 2
    }
  }, [direction])

  // Animate the snake slightly
  useFrame((state) => {
    if (groupRef.current && gameState === 'playing') {
      // Subtle bobbing animation
      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 4 + i * 0.5) * 0.05
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {snake.map((segment, index) => {
        const isHead = index === 0
        const isTail = index === snake.length - 1

        return (
          <group key={index} position={[segment.x, 0.3, segment.z]}>
            {/* Main segment */}
            <mesh rotation={isHead ? [0, headRotation, 0] : [0, 0, 0]}>
              {isHead ? (
                <boxGeometry args={[0.85, 0.5, 0.85]} />
              ) : isTail ? (
                <boxGeometry args={[0.55, 0.35, 0.55]} />
              ) : (
                <boxGeometry args={[0.7, 0.4, 0.7]} />
              )}
              <meshStandardMaterial
                color={isHead ? '#00ff00' : '#00cc00'}
                emissive={isHead ? '#00ff00' : '#00aa00'}
                emissiveIntensity={isHead ? 0.6 : 0.3}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>

            {/* Head details */}
            {isHead && (
              <>
                {/* Eyes */}
                <mesh position={[0.25, 0.15, -0.35]} rotation={[0, headRotation, 0]}>
                  <sphereGeometry args={[0.12, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
                <mesh position={[-0.25, 0.15, -0.35]} rotation={[0, headRotation, 0]}>
                  <sphereGeometry args={[0.12, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
                {/* Pupils */}
                <mesh position={[0.25, 0.15, -0.42]} rotation={[0, headRotation, 0]}>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshBasicMaterial color="#000000" />
                </mesh>
                <mesh position={[-0.25, 0.15, -0.42]} rotation={[0, headRotation, 0]}>
                  <sphereGeometry args={[0.06, 8, 8]} />
                  <meshBasicMaterial color="#000000" />
                </mesh>
                {/* Head glow */}
                <pointLight
                  position={[0, 0.5, 0]}
                  intensity={0.5}
                  color="#00ff00"
                  distance={3}
                />
              </>
            )}

            {/* Segment glow (reduced for performance) */}
            {index % 3 === 0 && (
              <pointLight
                position={[0, 0.3, 0]}
                intensity={0.15}
                color="#00ff00"
                distance={1.5}
              />
            )}
          </group>
        )
      })}
    </group>
  )
}

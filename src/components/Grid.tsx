import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GridProps {
  gridSize: number
}

export function Grid({ gridSize }: GridProps) {
  const gridRef = useRef<THREE.Group>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  // Create grid lines geometry
  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = []
    const size = gridSize + 0.5

    // Grid lines
    for (let i = -gridSize; i <= gridSize; i++) {
      // X-axis lines
      lines.push(
        <line key={`x-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([-size, 0.01, i, size, 0.01, i])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffff" opacity={0.3} transparent />
        </line>
      )
      // Z-axis lines
      lines.push(
        <line key={`z-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([i, 0.01, -size, i, 0.01, size])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ffff" opacity={0.3} transparent />
        </line>
      )
    }
    return lines
  }, [gridSize])

  // Animated pulse for border
  useFrame((state) => {
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.15
    }
  })

  const borderSize = gridSize + 0.5

  return (
    <group ref={gridRef}>
      {/* Base plane with gradient */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[borderSize * 2, borderSize * 2]} />
        <meshBasicMaterial
          color="#0a0020"
          opacity={0.9}
          transparent
        />
      </mesh>

      {/* Grid lines */}
      {gridLines}

      {/* Border glow effect */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[borderSize * 1.35, borderSize * 1.42, 4]} />
        <meshBasicMaterial
          color="#ff00ff"
          opacity={0.4}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Corner posts - neon pillars */}
      {[
        [-borderSize, borderSize],
        [borderSize, borderSize],
        [-borderSize, -borderSize],
        [borderSize, -borderSize]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.2, 1, 0.2]} />
            <meshStandardMaterial
              color="#ff00ff"
              emissive="#ff00ff"
              emissiveIntensity={0.5}
            />
          </mesh>
          <pointLight
            position={[0, 0.5, 0]}
            intensity={0.3}
            color="#ff00ff"
            distance={5}
          />
        </group>
      ))}

      {/* Boundary walls - invisible but show glow lines */}
      {/* Top wall */}
      <mesh position={[0, 0.1, -borderSize]}>
        <boxGeometry args={[borderSize * 2, 0.2, 0.05]} />
        <meshBasicMaterial color="#ff00ff" opacity={0.6} transparent />
      </mesh>
      {/* Bottom wall */}
      <mesh position={[0, 0.1, borderSize]}>
        <boxGeometry args={[borderSize * 2, 0.2, 0.05]} />
        <meshBasicMaterial color="#ff00ff" opacity={0.6} transparent />
      </mesh>
      {/* Left wall */}
      <mesh position={[-borderSize, 0.1, 0]}>
        <boxGeometry args={[0.05, 0.2, borderSize * 2]} />
        <meshBasicMaterial color="#ff00ff" opacity={0.6} transparent />
      </mesh>
      {/* Right wall */}
      <mesh position={[borderSize, 0.1, 0]}>
        <boxGeometry args={[0.05, 0.2, borderSize * 2]} />
        <meshBasicMaterial color="#ff00ff" opacity={0.6} transparent />
      </mesh>
    </group>
  )
}

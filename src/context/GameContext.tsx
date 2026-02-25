import { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react'

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type GameState = 'idle' | 'playing' | 'paused' | 'gameover'
type Position = { x: number; z: number }

interface GameContextType {
  snake: Position[]
  food: Position
  direction: Direction
  gameState: GameState
  score: number
  highScore: number
  gridSize: number
  startGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  setDirection: (dir: Direction) => void
}

const GameContext = createContext<GameContextType | null>(null)

const GRID_SIZE = 10
const INITIAL_SNAKE: Position[] = [
  { x: 0, z: 0 },
  { x: -1, z: 0 },
  { x: -2, z: 0 }
]

function getRandomFood(snake: Position[]): Position {
  let newFood: Position
  do {
    newFood = {
      x: Math.floor(Math.random() * (GRID_SIZE * 2 + 1)) - GRID_SIZE,
      z: Math.floor(Math.random() * (GRID_SIZE * 2 + 1)) - GRID_SIZE
    }
  } while (snake.some(s => s.x === newFood.x && s.z === newFood.z))
  return newFood
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>({ x: 5, z: 5 })
  const [direction, setDirectionState] = useState<Direction>('RIGHT')
  const [gameState, setGameState] = useState<GameState>('idle')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore')
    return saved ? parseInt(saved, 10) : 0
  })

  const directionRef = useRef<Direction>('RIGHT')
  const gameLoopRef = useRef<number | null>(null)
  const lastDirectionRef = useRef<Direction>('RIGHT')

  const setDirection = useCallback((newDir: Direction) => {
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    }
    if (opposites[newDir] !== lastDirectionRef.current) {
      directionRef.current = newDir
      setDirectionState(newDir)
    }
  }, [])

  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    // Wall collision
    if (Math.abs(head.x) > GRID_SIZE || Math.abs(head.z) > GRID_SIZE) {
      return true
    }
    // Self collision (skip head)
    for (let i = 1; i < body.length; i++) {
      if (body[i].x === head.x && body[i].z === head.z) {
        return true
      }
    }
    return false
  }, [])

  const gameLoop = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0]
      const dir = directionRef.current
      lastDirectionRef.current = dir

      const newHead: Position = { ...head }
      switch (dir) {
        case 'UP': newHead.z -= 1; break
        case 'DOWN': newHead.z += 1; break
        case 'LEFT': newHead.x -= 1; break
        case 'RIGHT': newHead.x += 1; break
      }

      const newSnake = [newHead, ...prevSnake]

      if (checkCollision(newHead, newSnake)) {
        setGameState('gameover')
        setScore(prev => {
          if (prev > highScore) {
            setHighScore(prev)
            localStorage.setItem('snakeHighScore', prev.toString())
          }
          return prev
        })
        return prevSnake
      }

      // Check food collision
      setFood(currentFood => {
        if (newHead.x === currentFood.x && newHead.z === currentFood.z) {
          setScore(prev => prev + 10)
          return getRandomFood(newSnake)
        }
        newSnake.pop()
        return currentFood
      })

      return newSnake
    })
  }, [checkCollision, highScore])

  useEffect(() => {
    if (gameState === 'playing') {
      const speed = Math.max(100, 200 - Math.floor(score / 50) * 10)
      gameLoopRef.current = window.setInterval(gameLoop, speed)
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
      gameLoopRef.current = null
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameState, gameLoop, score])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          setDirection('UP')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          setDirection('DOWN')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          setDirection('LEFT')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          setDirection('RIGHT')
          break
        case ' ':
          e.preventDefault()
          setGameState('paused')
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, setDirection])

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE)
    setFood(getRandomFood(INITIAL_SNAKE))
    directionRef.current = 'RIGHT'
    lastDirectionRef.current = 'RIGHT'
    setDirectionState('RIGHT')
    setScore(0)
    setGameState('playing')
  }, [])

  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused')
    }
  }, [gameState])

  const resumeGame = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing')
    }
  }, [gameState])

  return (
    <GameContext.Provider value={{
      snake,
      food,
      direction,
      gameState,
      score,
      highScore,
      gridSize: GRID_SIZE,
      startGame,
      pauseGame,
      resumeGame,
      setDirection
    }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within GameProvider')
  return context
}

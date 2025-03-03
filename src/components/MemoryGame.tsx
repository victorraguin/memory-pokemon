import React, { useState, useEffect } from 'react'
import './MemoryGame.css'
import { useFetchPokemonList } from '../hooks/data/useFetchPokemonList'

type MemoryGameProps = {
  images: string[]
}

type DifficultyLevel = 7 | 14 | 28

const DIFFICULTY_OPTIONS: DifficultyLevel[] = [7, 14, 28]

export default function MemoryGame ({ images }: MemoryGameProps) {
  const [flipped, setFlipped] = useState<number[]>([])
  const [solved, setSolved] = useState<number[]>([])
  const [cards, setCards] = useState<string[]>([])
  const [moves, setMoves] = useState<number>(0)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [gameCompleted, setGameCompleted] = useState<boolean>(false)
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(7)
  const { fetchPokemonList, isLoading, data } = useFetchPokemonList()

  const loadGame = (pairCount: DifficultyLevel) => {
    setDifficulty(pairCount)
    setFlipped([])
    setSolved([])
    setMoves(0)
    setGameCompleted(false)
    setGameStarted(false)
    fetchPokemonList(pairCount)
  }

  useEffect(() => {
    if (images.length > 0) {
      setCards(shuffle([...images, ...images]))
      setGameStarted(true)
    } else if (!gameStarted && !isLoading && data.length === 0) {
      loadGame(difficulty)
    }
  }, [images, gameStarted, isLoading, data.length])

  useEffect(() => {
    if (
      solved.length > 0 &&
      cards.length > 0 &&
      solved.length === cards.length
    ) {
      setGameCompleted(true)
    }
  }, [solved, cards])

  useEffect(() => {
    if (data.length > 0) {
      setCards(shuffle([...data, ...data]))
      if (!gameStarted) setGameStarted(true)
    }
  }, [data])

  const handleCardClick = (index: number) => {
    if (
      flipped.includes(index) ||
      solved.includes(index) ||
      flipped.length === 2 ||
      gameCompleted
    )
      return

    setFlipped(prev => [...prev, index])

    if (flipped.length === 1) {
      setMoves(prev => prev + 1)
    }
  }

  useEffect(() => {
    if (flipped.length === 2) {
      const [firstCard, secondCard] = flipped

      if (cards[firstCard] === cards[secondCard]) {
        setSolved(prev => [...prev, firstCard, secondCard])
        setFlipped([])
      } else {
        const timer = setTimeout(() => {
          setFlipped([])
        }, 1000)

        return () => clearTimeout(timer)
      }
    }
  }, [flipped, cards])

  const resetGame = () => {
    setFlipped([])
    setSolved([])
    setMoves(0)
    setGameCompleted(false)
    setGameStarted(false)
    fetchPokemonList(difficulty)
  }

  const preventDragHandler = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <div className='memory-game-container'>
      <div className='memory-game-header'>
        <h2>Jeu de Mémoire Pokémon</h2>

        <div className='difficulty-selector'>
          <p>Nombre de paires :</p>
          <div className='difficulty-buttons'>
            {DIFFICULTY_OPTIONS.map(option => (
              <button
                key={option}
                className={`difficulty-button ${
                  difficulty === option ? 'active' : ''
                }`}
                onClick={() => loadGame(option)}
                disabled={isLoading}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className='memory-game-stats'>
          <span>Coups: {moves}</span>
          <span>
            Paires trouvées: {solved.length / 2} / {cards.length / 2}
          </span>
        </div>
        <button
          className='reset-button'
          onClick={resetGame}
          disabled={isLoading}
        >
          Recommencer
        </button>
      </div>

      <div className='memory-game'>
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card-container ${
              solved.includes(index) ? 'solved-card' : ''
            }`}
            onClick={() => handleCardClick(index)}
          >
            <div className='card'>
              <img
                src={card}
                alt={`Carte ${index} correspondant à une image du jeu`}
                onMouseDown={preventDragHandler}
                onDragStart={preventDragHandler}
                draggable={false}
                loading='lazy'
                className={`card-image ${
                  flipped.includes(index) || solved.includes(index)
                    ? ''
                    : 'hidden'
                } ${solved.includes(index) ? 'solved' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>

      {gameCompleted && (
        <div className='victory-message'>
          <h3>Félicitations !</h3>
          <p>Vous avez terminé le jeu en {moves} coups.</p>
          <button className='reset-button' onClick={resetGame}>
            Jouer à nouveau
          </button>
        </div>
      )}

      {isLoading && (
        <div className='loading-indicator'>
          <div className='spinner'></div>
          <p>Chargement des Pokémon...</p>
        </div>
      )}
    </div>
  )
}

const shuffle = (array: any[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

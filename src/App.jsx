import MemoryGame from './components/MemoryGame'
import { useFetchPokemonList } from './hooks/data/useFetchPokemonList'
import { useEffect } from 'react'
function App () {
  const { data, isLoading, error, fetchPokemonList } = useFetchPokemonList()

  // Charger les Pokémon au démarrage (7 paires par défaut)
  useEffect(() => {
    fetchPokemonList(7)
  }, [])

  if (isLoading && data.length === 0) {
    return (
      <div className='loading-indicator'>
        <div className='spinner'></div>
        <p>Chargement des Pokémon...</p>
      </div>
    )
  }

  if (error) {
    return <div>Erreur: {error.message}</div>
  }

  return (
    <>
      <MemoryGame images={data} />
    </>
  )
}

export default App

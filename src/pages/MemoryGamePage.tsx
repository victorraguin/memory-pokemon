import React, { useState, useEffect } from 'react'
import { Pokemon, useFetchPokemonList } from '../hooks/data/useFetchPokemonList'
import MemoryGame from '../components/MemoryGame'

export default function MemoryGamePage () {
  const { isLoading, data, error } = useFetchPokemonList()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
      <MemoryGame images={data} />
    </>
  )
}

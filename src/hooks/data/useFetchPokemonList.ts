import { useState, useEffect } from 'react'

type PokemonList = {
  count: number
  next: string
  previous: string
  results: Pokemon[]
}
export type Pokemon = {
  name: string
  url: string
}

export const useFetchPokemonList = () => {
  const [data, setData] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [offset, setOffset] = useState<number>(0)
  const [initialLoad, setInitialLoad] = useState<boolean>(true)

  const fetchPokemonList = async (limit: number = 5) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      })

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?${params}`
      )

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }

      const result = await response.json()
      const pokemonList = result.results.map((pokemon: Pokemon) => pokemon.url)

      const pokemonImages = await fetchPokemonImages(pokemonList)

      setData(pokemonImages)
      setOffset(prevOffset => prevOffset + limit)
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Une erreur inconnue est survenue')
      )
    } finally {
      setIsLoading(false)
      setInitialLoad(false)
    }
  }

  const fetchPokemonImages = async (pokemonUrls: string[]) => {
    const pokemonImages = await Promise.all(
      pokemonUrls.map(async pokemonUrl => {
        const response = await fetch(pokemonUrl)
        const data = await response.json()
        return data.sprites.other['official-artwork'].front_default
      })
    )
    return pokemonImages
  }

  return { data, isLoading, error, fetchPokemonList, initialLoad }
}

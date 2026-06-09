import { useEffect, useState } from 'react'
import { useGameClock } from '../../hooks/useGameClock'
import { GAME_STORAGE_KEYS } from '../data/GameStorageKeys.data'
import type { CharacterEntity } from '../entities/character/types/Character.types'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export type GameMode =
  | 'boot'
  | 'character_create'
  | 'travel'
  | 'world'


interface GameScreenProps {

}

export default function GameScreen(props: GameScreenProps) {
  const now = useGameClock()

  const [mode, setMode] = useState<GameMode>('boot')
  const [characters, setCharacters] = useLocalStorage<CharacterEntity[] | undefined>(
    GAME_STORAGE_KEYS.CHARACTERS_GAME,
    []
  )

  useEffect(() => {
    if(!characters || characters.length === 0){
      setMode('character_create')
    }
  }, [])

  return <div>
    

  </div>
}
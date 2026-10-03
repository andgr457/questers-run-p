import { useEffect, useState } from 'react';
import { CharacterService } from '../entities/character/CharacterService';
import type { Character } from '../entities/character/Character.types';

interface Props {
  characterService: CharacterService
}

export default function useCharacter(props: Props){
  const [character, setCharacter] = useState<Character | null>(
    null
  )

  useEffect(() => {
    const c = props.characterService.get()
    console.log('character changed', c)
    if(c){
      setCharacter(c)
    }
  }, [
    props.characterService.get()
  ])

  return {
    character
  }
}
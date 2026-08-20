import { useEffect, useState, type RefObject } from 'react';
import { characterEventService } from '../services/CharacterEventService';
import { eventBus } from '../EventBus';
import { useFloatingTextEvents } from './useFloatingTextEvents';
import type { Character } from '../../../interfaces/Character.types';
import { formatNumberValueToStringWithPlus } from '../../../core/utils/Formatting.utils';

const EVENT_TYPE_INCLUDES = 'character:'

//References used by UI to show popup text over their div elements.
interface Props {
  characterId: string
  xpReference: RefObject<HTMLDivElement | null>
  goldReference: RefObject<HTMLDivElement | null>
  levelReference: RefObject<HTMLDivElement | null>
  hpReference: RefObject<HTMLDivElement | null>
  manaReference: RefObject<HTMLDivElement | null>
  staminaReference: RefObject<HTMLDivElement | null>
}

export function useCharacterEvents(props: Props){
  const [character, setCharacter] = useState<Character | undefined>(
    characterEventService.getCharacterById(props.characterId)
  )

  const {
    floatingTexts: characterFloatingTexts,
    addFloatingText: characterAddFloatingText,
    removeFloatingText: characterRemoveFloatingText
  } = useFloatingTextEvents()

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(!event.type.includes(EVENT_TYPE_INCLUDES)) return

      if(event.type === 'character:created' || event.type === 'character:saved'){
        setCharacter(characterEventService.getCharacterById(props.characterId))
      }
     
      if(event.type === 'character:xp:added'){
        setCharacter(characterEventService.getCharacterById(props.characterId))
        const floatText = formatNumberValueToStringWithPlus(event.meta.value)
        characterAddFloatingText({
          id: crypto.randomUUID(),
          color: 'purple',
          ref: props.goldReference,
          text: `${floatText}`
        })
      }

      if(event.type === 'character:hp:added'){
        setCharacter(characterEventService.getCharacterById(props.characterId))
        const floatText = formatNumberValueToStringWithPlus(event.meta.value)
        characterAddFloatingText({
          id: crypto.randomUUID(),
          color: 'red',
          ref: props.goldReference,
          text: `${floatText}`
        })
      }

      if(event.type === 'character:stamina:added'){
        setCharacter(characterEventService.getCharacterById(props.characterId))
        const floatText = formatNumberValueToStringWithPlus(event.meta.value)
        characterAddFloatingText({
          id: crypto.randomUUID(),
          color: 'green',
          ref: props.goldReference,
          text: `${floatText}`
        })
      }

      if(event.type === 'character:mana:added'){
        setCharacter(characterEventService.getCharacterById(props.characterId))
        const floatText = formatNumberValueToStringWithPlus(event.meta.value)
        characterAddFloatingText({
          id: crypto.randomUUID(),
          color: 'red',
          ref: props.goldReference,
          text: `${floatText}`
        })
      }

      if(event.type === 'character:gold:added'){
        setCharacter(characterEventService.getCharacterById(props.characterId))
        const floatText = formatNumberValueToStringWithPlus(event.meta.value)

        characterAddFloatingText({
          id: crypto.randomUUID(),
          color: 'gold',
          ref: props.goldReference,
          text: `${floatText}g`
        })
      }
      
    })
    return unsub
  }, [])

  return {
    character,
    characterFloatingTexts,
    characterRemoveFloatingText
  }
}
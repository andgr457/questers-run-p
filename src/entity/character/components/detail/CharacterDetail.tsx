import { useState, useEffect } from 'react'
import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import { getCharacterGold } from '../../utils/Character.utils'
import { eventBus } from '../../../../engine/event/EventBus'
import { GAME_EVENT_BUS_CHARACTER_TYPES } from '../../../../engine/event/utils/EventBus.utils'
import DetailRow from '../../../../game/detail/DetailRow'
import GamePanelSection from '../../../../ui/panel/GamePanelSection'

interface Props {
  characterId: string
}

export default function CharacterDetail(props: Props){
  const {
    characterId
  } = props
  const [gold, setGold] = useState(getCharacterGold(characterId))
  const [character, setCharacter] = useState(characterRuntimeService.getCharacter(characterId))

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'character:gold:added'){
        setGold(getCharacterGold(characterId))
      }
      if(GAME_EVENT_BUS_CHARACTER_TYPES.includes(event.type)){
        setCharacter(characterRuntimeService.getCharacter(characterId))
      }
    })
    return unsub
  }, [])

  return <GamePanelSection
    actions={[]}
    title=''
  >
    <div className='detail-wrapper'>
      <div className='detail-header'>
        Character Detail
      </div>
      <div className='detail-rows'>
        <DetailRow field='Name' value={character?.name ?? ''} />
        <DetailRow field='ID' value={character?.id ?? ''} />
        <DetailRow field='Level' value={`${character?.level ?? -1}`} />
        <DetailRow field='XP' value={character?.xp?.toFixed(0) ?? ''} />
        <DetailRow field='XP Next Level' value={character?.xpNextLevel.toFixed(0) ?? ''} />
        <DetailRow field='Gold' value={gold.toFixed(0)} />
      </div>
    </div>
  </GamePanelSection>
}
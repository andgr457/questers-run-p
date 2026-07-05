import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import DetailRow from '../../../../game/detail/DetailRow'
import GamePanelSection from '../../../../ui/panel/GamePanelSection'
import type { CharacterClassEntity } from '../../types/CharacterClassEntity.types'

interface Props {
  characterClass: CharacterClassEntity
}

export default function CharacterClassDetail(props: Props){
  const {
    characterClass
  } = props

  const charactersWithClass = characterRuntimeService.getCharacters().filter(c => c.classId === characterClass.id)

  return <GamePanelSection
      actions={[]}
      title=''
    >
    <div className='detail-wrapper'>
      <div className='detail-header'>
        {characterClass?.name} Class
      </div>
      <div className='detail-rows'>
        <DetailRow field='Name' value={characterClass?.name ?? ''} />
        <DetailRow field='Description' value={`${characterClass?.description ?? ''}`} />
        <DetailRow field='Strength Bonus' value={characterClass?.strength?.toFixed(0) ?? ''} />
        <DetailRow field='Agility Bonus' value={characterClass?.agility?.toFixed(0) ?? ''} />
        <DetailRow field='Intellect Bonus' value={characterClass?.intellect?.toFixed(0) ?? ''} />
        <DetailRow field='Characters w/ Class' value={charactersWithClass?.length.toFixed(0) ?? 0} />
      </div>
    </div>
  </GamePanelSection>
}
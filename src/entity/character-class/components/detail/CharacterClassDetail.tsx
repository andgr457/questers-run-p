import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import DetailRow from '../../../../game/detail/DetailRow'
import GamePanelSection from '../../../../ui/panel/GamePanelSection'
import { GAME_PARTY_ROLE_DESCRIPTIONS, GAME_PARTY_ROLE_NAMES } from '../../../party/data/PartyRole.data'
import type { CharacterClassEntity } from '../../types/CharacterClassEntity.types'

interface Props {
  characterClass: CharacterClassEntity
}

export default function CharacterClassDetail(props: Props){
  const {
    characterClass
  } = props

  const charactersWithClass = characterRuntimeService.getCharacters().filter(c => c.classId === characterClass.id)
  const partyRolesDetail = characterClass.roles.map(role => {
    return {
      name: GAME_PARTY_ROLE_NAMES[role],
      description: GAME_PARTY_ROLE_DESCRIPTIONS[role]
    }
  })
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
      <div>
        <div className='detail-header'>Party Roles</div>
        <div className='detail-rows'>
          {partyRolesDetail.map(role => {
            return <DetailRow field={role.name} value={role.description} />
          })}
        </div>
      </div>
    </div>
  </GamePanelSection>
}
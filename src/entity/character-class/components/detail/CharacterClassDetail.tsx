import { characterRuntimeService } from '../../../../engine/character/CharacterRuntimeService'
import DetailRow from '../../../../game/detail/DetailRow'
import GamePanelSection from '../../../../ui/panel/GamePanelSection'
import { GAME_PARTY_ROLE_DESCRIPTIONS, GAME_PARTY_ROLE_NAMES } from '../../../party/data/PartyRole.data'
import type { CharacterClassEntity } from '../../types/CharacterClassEntity.types'
import styles from './CharacterClassDetail.module.css'

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
    title={characterClass.name}
    expandable={false}
  >
    <div className={styles.wrapper}>
      <div className={styles.description}>
        {characterClass.description}
      </div>
      <div className={styles.fields}>

        <div className={styles.field}>
          <div className={styles.fieldTitle}>
            Strength
          </div>
          <div className={styles.fieldValue}>
            {characterClass.strength}
          </div>
        </div>
        
        <div className={styles.field}>
          <div className={styles.fieldTitle}>
            Agility
          </div>
          <div className={styles.fieldValue}>
            {characterClass.agility}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.fieldTitle}>
            Intellect
          </div>
          <div className={styles.fieldValue}>
            {characterClass.intellect}
          </div>
        </div>

      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statTitle}>
            Character(s) w/ Class
          </div>
          <div className={styles.statValue}>
            {charactersWithClass?.length.toFixed(0) ?? 0}
          </div>
        </div>
      </div>

      <div className={styles.classRoles}>
          {partyRolesDetail.map(role => {
          return <div className={styles.classRole}>
            <div className={styles.classRoleTitle}>
              {role.name}
            </div>
            <div className={styles.classRoleDescription}>
              {role.description}
            </div>
          </div>
        })}
      </div>
    </div>
  </GamePanelSection>
}
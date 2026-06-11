import type { CharacterClassEntity } from '../types/CharacterClassEntity.types'
import { getCharacterClassCharactersAmountByPlayerLevel } from '../utils/CharacterClassEntity.utils'
import styles from './CharacterClassEntityMini.module.css'

interface Props {
  characterClass: CharacterClassEntity
  currentCharacterClassId: string
  numberOfCharactersCreatable: number
  numberOfCharactersWithClass: number
  numberOfCharacterTokens: number
  setCharacterClassId: (characterClassId: string) => void
}
export default function CharacterClassEntityMini(props: Props) {
  const {
    characterClass,
    currentCharacterClassId,
    setCharacterClassId,
    numberOfCharactersWithClass,
    numberOfCharactersCreatable,
    numberOfCharacterTokens
  } = props

  const selected = currentCharacterClassId === characterClass.id
  const cardStyle = selected ? styles.cardSelected : styles.card

  const classAvailableColor = 
    numberOfCharacterTokens <= 0 || numberOfCharactersWithClass >= numberOfCharactersCreatable ? 'red' :
    'green'

  if(!characterClass){
    return null
  }
  return <div 
    className={cardStyle} 
    title={characterClass.description}
    onClick={() => {setCharacterClassId(characterClass.id)}}
    >
    <div className={styles.attributes}>
      <div className={styles.attribute}>
        {characterClass.name}
      </div>

      <div className={styles.attribute} style={{color: classAvailableColor}}>
        {numberOfCharactersWithClass ?? 0}/{numberOfCharactersCreatable} MAX
      </div>

      {characterClass.strength > 0 && <div className={styles.attribute}>
        <div>
          STR
        </div>
        <div>
          +
        </div>
        <div>
          {characterClass.strength}
        </div>
      </div>}

      {characterClass.agility > 0 && <div className={styles.attribute}>
        <div>
          AGI
        </div>
        <div>
          +
        </div>
        <div>
          {characterClass.agility}
        </div>
      </div>}

      {characterClass.intellect > 0 && <div className={styles.attribute}>
        <div>
          INT
        </div>
        <div>
          +
        </div>
        <div>
          {characterClass.intellect}
        </div>
      </div>}

    </div>
    <div className={styles.classDescription} >
        {characterClass.description}
      </div>
  </div>
}
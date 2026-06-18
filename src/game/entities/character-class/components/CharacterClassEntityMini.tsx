import type { CharacterClassEntity } from '../types/CharacterClassEntity.types'
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
  } = props

  const selected = currentCharacterClassId === characterClass.id
  const cardStyle = selected ? styles.cardSelected : styles.card

  if(!characterClass){
    return null
  }
  return <div 
    className={cardStyle} 
    title={characterClass.description}
    onClick={() => {
      if(selected){
        setCharacterClassId('')
      } else {
        setCharacterClassId(characterClass.id)}
      }
    }
  >
    <div className={styles.attributes}>
      <div className={styles.attribute}>
        {characterClass.name}
      </div>

      <div className={styles.attribute}>
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
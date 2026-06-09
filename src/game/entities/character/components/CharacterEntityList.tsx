import type { CharacterEntity } from '../types/Character.types'
import CharacterEntityListRecord from './CharacterEntityListRecord'
import styles from './CharacterEntityList.module.css'

type Props = {
  characters: CharacterEntity[]
  onCreateCharacter: () => void
}

export default function CharacterEntityList({
  characters,
  onCreateCharacter
}: Props) {

  return (
    <div className={styles.list}>
      <div>
        <button className='button-basic' onClick={onCreateCharacter}>
          Create Character
        </button>
      </div>
      {characters.map(character => (
        <CharacterEntityListRecord
          key={character.id}
          character={character}
          
        />
      ))}

    </div>
  )
}
import type { CharacterEntity } from '../../types/Character.types'
import CharacterEntityListRecord from './CharacterEntityListRecord'
import styles from './CharacterEntityList.module.css'

type Props = {
  characters: CharacterEntity[],
}

export default function CharacterEntityList({
  characters,
}: Props) {

  return (
    <div className={styles.list}>
      {characters.map(character => (
        <CharacterEntityListRecord
          key={character.id}
          character={character}
          canShowActions={true}
        />
      ))}

    </div>
  )
}
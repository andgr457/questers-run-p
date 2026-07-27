import { useCharacters } from '../../../../engine/character/hooks/useCharacters'
import styles from './CharacterList.module.css'
import CharacterListItem from './CharacterListItem'

export default function CharacterList(){
  const {characters} = useCharacters()
  const filtered = characters
  return <div className={styles.wrapper}>
    {/* <div className={styles.top}>
      TOP - Filters left, Counts right (# all, #idle)

    </div> */}
    <div className={styles.list}>
      {filtered.map(character => {

        return <CharacterListItem character={character} />
      })}
      
    </div>
  </div>
}
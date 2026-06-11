import { GAME_CLASSES } from '../data/CharacterClassEntity.data';
import CharacterClassEntityMini from './CharacterClassEntityMini';
import styles from './CharacterClassEntityMini.module.css'

interface Props {
  currentCharacterClassId: string
  playerCharacterClassAmounts: Record<string, number>
  numberOfCharactersCreatable: number
  numberOfCharacterTokens: number
  setCharacterClassId: (characterClassId: string) => void
}
export default function CharacterClassEntityMiniList(props: Props){
  const {
    playerCharacterClassAmounts
  } = props
  return <div className={styles.list}>
    {GAME_CLASSES.map(gc => {
      return <CharacterClassEntityMini 
        characterClass={gc}
        numberOfCharactersWithClass={playerCharacterClassAmounts?.[gc.id]}
        {...props}
      />
    })}
  </div>
}
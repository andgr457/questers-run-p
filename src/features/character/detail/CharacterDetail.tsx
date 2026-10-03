import type { Character } from '../../../interfaces/Character.types'
import styles from './CharacterDetail.module.css'

interface Props {
  character: Character
}

export default function CharacterDetail(props: Props){

  const {
    character
  } = props

  return (
    <div
      className={styles.wrapper}
    >
      {character.title}
    </div>
  )
}
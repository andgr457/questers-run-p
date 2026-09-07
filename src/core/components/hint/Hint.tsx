import { GAME_ICONS } from '../../data/Icons.data'
import styles from './Hint.module.css'

interface Props {
  text: string
}

export default function Hint(props: Props){

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        HINT {GAME_ICONS.STAR} 
      </div>
      <div className={styles.text}>
        {props.text}
      </div>
    </div>
  )
}

import { formatPrimitiveValueToString } from '../../../utils/Game.utils'
import styles from './TutorialHintListItem.module.css'

interface Props {
  title: string
  value: string | number | boolean
}

export default function TutorialHintListItem(props: Props){
  const {
    title,
    value,
  } = props

  return (
    <div className={styles.wrapper}>
      {title && <div className={styles.title}>
        {title}
      </div>}
      <div className={styles.value}>
        {formatPrimitiveValueToString(value)}
      </div>
    </div>
  )
}
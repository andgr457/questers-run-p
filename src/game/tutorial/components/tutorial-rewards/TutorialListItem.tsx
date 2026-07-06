import { formatPrimitiveValueToString } from '../../../utils/Game.utils'
import styles from '../Tutorial.module.css'

interface Props {
  title: string
  value: string | number | boolean
}

export default function TutorialListItem(props: Props){
  const {
    title,
    value,
  } = props

  return (
    <div className={styles.item}>
      <div className={styles.itemTitle}>
        {title}
      </div>
      <div className={styles.description}>
        {formatPrimitiveValueToString(value)}
      </div>
    </div>
  )
}
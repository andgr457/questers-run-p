import { formatPrimitiveValueToString } from '../../utils/Formatting.utils'
import styles from './Gold.module.css'

interface Props {
  value: number
}

export default function Gold(props: Props){

  return <div className={styles.wrapper}>
    <div className={styles.icon}>
      ◉
    </div>
    <div className={styles.value}>
      {formatPrimitiveValueToString(props.value)}g
    </div>
  </div>
}
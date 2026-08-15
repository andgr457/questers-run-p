import { formatPrimitiveValueToString } from '../../../../core/utils/Formatting.utils'
import styles from './Tokens.module.css'

interface Props {
  value: number
}

export default function Tokens(props: Props){

  return <div className={styles.wrapper}>
    <div className={styles.icon}>
      ⌬
    </div>
    <div className={styles.value}>
      {formatPrimitiveValueToString(props.value)}
    </div>
  </div>
}
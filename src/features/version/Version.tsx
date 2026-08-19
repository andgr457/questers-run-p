import {version} from '../../../package.json'
import styles from './Version.module.css'

export default function Version() {

  return (
    <div className={styles.wrapper}>
      {version}
    </div>
  )
}
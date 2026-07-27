import styles from './SiteTitle.module.css'

export default function SiteTitle() {

  return <div className={styles.wrapper}>
      <div className={styles.title}>
        Quester's Run
      </div>
      <div className={styles.subTitle}>
        A FANTASY CHARACTER MANAGER / IDLE / CLICKER GAME
      </div>
  </div>
}
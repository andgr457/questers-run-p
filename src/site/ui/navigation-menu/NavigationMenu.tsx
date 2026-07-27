import type { SiteMode } from '../../Site'
import styles from './NavigationMenu.module.css'

interface Props {
  setMode: (mode: SiteMode) => void
}

export default function NavigationMenu(props: Props){

  return <div className={styles.wrapper}>
    NAV 
  </div>
}
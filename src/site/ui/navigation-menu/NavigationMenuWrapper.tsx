import styles from './NavigationMenuWrapper.module.css'
import NavigationMenu from './NavigationMenu';
import type { SiteMode } from '../../Site';

interface Props {
  setMode: (mode: SiteMode) => void
}

export default function NavigationMenuWrapper(props: Props){

  return <div className={styles.wrapper}>
    <NavigationMenu setMode={props.setMode} />
  </div>
}
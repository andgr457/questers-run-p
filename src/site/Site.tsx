import { useState } from 'react'
import styles from './Site.module.css'
import NavigationMenuWrapper from './ui/navigation-menu/NavigationMenuWrapper'
import SiteTitle from './ui/site-title/SiteTitle'
import FeatureWrapper from './ui/feature-wrapper/FeatureWrapper'
import SiteHome from './features/home/SiteHome'

export type SiteMode = 'home'
  | 'about'
  | 'contact'
  | 'encyclopedia'

export default function Site(){
  const [mode, setMode] = useState<SiteMode>('home')

  return <div className={styles.wrapper}>
    <SiteTitle />
    <NavigationMenuWrapper setMode={setMode} />
    <FeatureWrapper>
      {mode === 'home' && (
        <SiteHome />
      )}
    </FeatureWrapper>
  </div>
}
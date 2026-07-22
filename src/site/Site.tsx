import styles from './Site.module.css'
import NavigationWrapper from './ui/navigation-menu/components/NavigationWrapper'
import { NAVIGATION_NODES } from './ui/navigation-menu/data/NavigationNode.data'
import { useSiteNavigation } from './engine/events/navigation/hooks/useSiteNavigation'
import AboutGame from './features/about/game/components/AboutGame'

export default function Site() {
  const { navigationMode } = useSiteNavigation()

  return (
    <div className={styles.site}>
      <h1 className={styles.title}>
        Quester's Run
      </h1>
      <NavigationWrapper
        nodes={NAVIGATION_NODES}
      />
      {navigationMode === 'about-game' && (
        <AboutGame />
      )}
    </div>
  )
}
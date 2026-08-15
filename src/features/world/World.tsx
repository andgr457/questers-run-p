import { useWorldModeEvents } from '../../engine/events/hooks/useWorldModeEvents'
import Guild from '../guild/Guild'
import Intro from '../intro/Intro'
import styles from './World.module.css'

export default function World() {
  const {
    worldModeMain,
    worldModeOverlay
  } = useWorldModeEvents()
  console.log(worldModeMain)
  console.log(worldModeOverlay)

  return (
    <div className={styles.world}>
      {worldModeMain === 'guild' && (
        <Guild />
      )}

      {worldModeOverlay === 'intro' && (
        <Intro />
      )}
    </div>
  )
}
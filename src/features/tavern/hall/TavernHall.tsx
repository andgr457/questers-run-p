import FeatureBody from '../../../core/components/feature/components/body/FeatureBody';
import FeatureHeader from '../../../core/components/feature/components/header/FeatureHeader';
import styles from './TavernHall.module.css'

export default function TavernHall() {

  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Tavern Hall'}
      />

      <FeatureBody>
        BODY
      </FeatureBody>

    </div>
  )
}
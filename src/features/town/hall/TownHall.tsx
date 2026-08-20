import FeatureBody from '../../../core/components/feature/components/body/FeatureBody'
import FeatureHeader from '../../../core/components/feature/components/header/FeatureHeader'
import styles from './TownHall.module.css'

export default function TownHall(){

  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Town Hall'}
      />

      <FeatureBody>
        BODY
      </FeatureBody>

    </div>
  )
}


import FeatureBody from '../../../core/components/feature/components/body/FeatureBody'
import FeatureHeader from '../../../core/components/feature/components/header/FeatureHeader'
import styles from './TownMap.module.css'

export default function TownMap() {

  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Town Map'}
      />

      <FeatureBody>
        BODY
      </FeatureBody>

    </div>
  )
}
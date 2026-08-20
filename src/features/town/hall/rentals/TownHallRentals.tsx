import FeatureBody from '../../../../core/components/feature/components/body/FeatureBody'
import FeatureHeader from '../../../../core/components/feature/components/header/FeatureHeader'
import styles from './TownHallRentals.module.css'

export default function TownHallRentals() {

  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Town Hall Rentals'}
      />

      <FeatureBody>
        BODY
      </FeatureBody>

    </div>
  )
}
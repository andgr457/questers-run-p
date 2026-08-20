import FeatureBody from '../../../../core/components/feature/components/body/FeatureBody'
import FeatureHeader from '../../../../core/components/feature/components/header/FeatureHeader'
import styles from './TownHallRegistrar.module.css'

export default function TownHallRegistrar() {

  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Tavern Hall Registrar'}
      />

      <FeatureBody>
        BODY
      </FeatureBody>

    </div>
  )
}
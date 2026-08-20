import FeatureBody from '../../core/components/feature/components/body/FeatureBody'
import FeatureHeader from '../../core/components/feature/components/header/FeatureHeader'
import styles from './Wiki.module.css'

export default function Wiki(){

  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Wiki'}
      />

      <FeatureBody>
        BODY
      </FeatureBody>

    </div>
  )
}
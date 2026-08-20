import FeatureBody from '../../../core/components/feature/components/body/FeatureBody';
import FeatureHeader from '../../../core/components/feature/components/header/FeatureHeader';
import styles from './GuildHall.module.css'

export default function GuildHall() {
  
  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Guild Hall'}
      />

      <FeatureBody>
        BODY
      </FeatureBody>

    </div>
  )
}
import styles from './GuildHall.module.css'
import FeatureBody from '../../core/components/feature/components/body/FeatureBody';
import FeatureHeader from '../../core/components/feature/components/header/FeatureHeader';
import PlayerDetail from '../../entities/player/components/detail/PlayerDetail';

export default function GuildHall() {

  return <div className={styles.wrapper}>
              
    <FeatureHeader
      text={'Guild Hall'}
    />

    <FeatureBody>
      <PlayerDetail />
    </FeatureBody>

  </div>
}
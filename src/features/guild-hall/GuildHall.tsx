import styles from './GuildHall.module.css'
import FeatureBody from '../../core/components/feature/components/body/FeatureBody';
import FeatureHeader from '../../core/components/feature/components/header/FeatureHeader';
import GuildMasterDetail from '../../entities/guild-master/components/detail/GuildMasterDetail';

interface Props{
  guildId: string
}

export default function GuildHall(props: Props) {
  const {
    guildId
  } = props
  
  return <div className={styles.wrapper}>
              
    <FeatureHeader
      text={'Guild Hall'}
    />

    <FeatureBody>
      <GuildMasterDetail />
    </FeatureBody>

  </div>
}
import type { UpgradeEntity, UpgradeRewardEntity } from '../../types/UpdateEntity.types'
import styles from './UpgradeEntityDetail.module.css'
import UpgradeEntityDetailRequirementRecord from './UpgradeEntityDetailRequirement'
import UpgradeEntityDetailRewardRecord from './UpgradeEntityDetailReward'

interface Props {
  upgrade: UpgradeEntity

  onUpgrade?: (entity: UpgradeEntity) => void
}

export default function UpgradeEntityDetail(props: Props) {
  const {
    upgrade,
    onUpgrade,
  } = props

  return (
    <div className={styles.card}>
      <div className={styles.title}>
        {upgrade.title}
      </div>
      <div className={styles.label}>
        {upgrade.description}
      </div>
      <div className={styles.header}>
        Requirements
      </div>
      <div className={styles.label}>
        {upgrade.requirements.map(requirement => (
          <UpgradeEntityDetailRequirementRecord 
            key={requirement.id}
            requirement={requirement}
          />
        ))}
      </div>
      <div className={styles.header}>
        Rewards
      </div>
      <div className={styles.label}>
        {upgrade.rewards.map(reward => (
          <UpgradeEntityDetailRewardRecord 
            reward={reward as UpgradeRewardEntity}
          />
        ))}
      </div>
    </div>
  )
}




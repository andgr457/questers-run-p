import GameList from '../../../../components/ui/list/GameList'
import { GAME_UPGRADES } from '../../data/UpgradeEntity.data'
import type { UpgradeEntity } from '../../types/UpdateEntity.types'
import UpgradeEntityDetail from '../detail/UpgradeEntityDetail'

interface Props {
  onUpgrade: (upgrade: UpgradeEntity) => void
  onView: (upgrade: UpgradeEntity) => void
}

export default function UpgradeEntityList(props: Props) {
  const {
    onUpgrade,
    onView
  } = props

  return <GameList<UpgradeEntity> 
    actions={[
      {
        name: 'Upgrade',
        fn: onUpgrade
      },
      {
        name: 'View',
        fn: onView
      }
    ]}
    entities={GAME_UPGRADES}
    getEntityContent={(entity) => {
      return <UpgradeEntityDetail 
        upgrade={entity}
        onUpgrade={onUpgrade}
        
      />
    }}
  />
}
import type { UpgradeEntity } from '../../types/UpdateEntity.types'
import UpgradeEntityDetail from '../detail/UpgradeEntityDetail'

interface Props {
  upgrade: UpgradeEntity

  onUpgrade: (upgrade: UpgradeEntity) => void
  onView: (upgrade: UpgradeEntity) => void
}

export default function UpgradeEntityListRecord(props: Props) {
  const {
    upgrade,
    onUpgrade,
    onView
  } = props

  return (
    <div
      className='game-list-item'
    >
      <div className='game-list-item-content'>
        <UpgradeEntityDetail 
          upgrade={upgrade}
          onUpgrade={() => {onUpgrade(upgrade)}}
        />

        <div className='game-list-item-actions'>
          <div className='game-list-item-action'>
            <button
              className="button-basic dark"
              onClick={() => {onView(upgrade)}}
            >
              VIEW
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
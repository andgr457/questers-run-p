import type { SettingsListItemUI } from './types/SettingsPanel.types'

interface Props {
  entity: SettingsListItemUI
}
export default function SettingsPanelListItem(props: Props){
  const {
    entity
  } = props

  return <>
    <div className='game-list-item-title'>
      {entity.title}
    </div>
    <div className='game-list-item-label'>
      {entity.description}
    </div>
  </>
}
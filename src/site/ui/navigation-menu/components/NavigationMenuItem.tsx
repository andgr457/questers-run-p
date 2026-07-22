import styles from './NavigationMenuItem.module.css'
import type { NavigationNode } from '../types/NavigationNode.types'
import { eventBus } from '../../../engine/events/bus/EventBus'

interface NavigationMenuItemProps {
  node: NavigationNode
  menuIndex: number
  selected: boolean
  active: boolean
  onSelect: (node: NavigationNode, menuIndex: number) => void
}

export default function NavigationMenuItem({
  node,
  menuIndex,
  selected,
  active,
  onSelect
}: NavigationMenuItemProps) {
  function handleClick() {
    if(!active){
      return
    }

    onSelect(node, menuIndex)
  }

  function handleNav(event: React.MouseEvent) {
    event.stopPropagation()

    if(!active){
      return
    }

    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'site:navigation:start',
      created: Date.now(),
      meta: {
        navigationMode: node.navMode,
        navigationFilter: node.filterType
      }
    })
  }

  return (
    <div className={`${styles.item} ${selected ? styles.selected : ''}`}>
      <button
        className={styles.button}
        title={node.description}
        onClick={handleClick}
      >
        {node.title}
      </button>

      {(node.navMode || node.filterType) && (
        <button
          className={styles.navButton}
          title={`Navigate to ${node.title}`}
          onClick={handleNav}
        >
          GO
        </button>
      )}
    </div>
  )
}
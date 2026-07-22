import styles from './NavigationMenu.module.css'
import NavigationMenuLevel from './NavigationMenuLevel'
import type { NavigationNode } from '../types/NavigationNode.types'

interface NavigationMenuLevelData {
  nodes: NavigationNode[]
  selectedNode?: NavigationNode
}

interface NavigationMenuProps {
  title: string
  description: string
  layout: 'desktop' | 'vertical'
  activeMenuIndex: number
  menuLevels: NavigationMenuLevelData[]
  onSelect: (node: NavigationNode, menuIndex: number) => void
}

export default function NavigationMenu({
  title,
  description,
  layout,
  activeMenuIndex,
  menuLevels,
  onSelect
}: NavigationMenuProps) {
  const levelOffset = activeMenuIndex * 120

  return (
    <div className={`${styles.menu} ${styles[layout]}`}>
      {title && (
        <div className={styles.header}>
          <div className={styles.title}>
            {title}
          </div>
          {description && (
            <div className={styles.description}>
              {description}
            </div>
          )}
        </div>
      )}

      <div
        className={styles.levels}
        style={{
          transform: layout === 'desktop'
            ? `translateY(-${levelOffset}px)`
            : `translateX(-${levelOffset}px)`
        }}
      >
        {menuLevels.map((menuLevel, menuIndex) => (
          <NavigationMenuLevel
            key={menuIndex}
            nodes={menuLevel.nodes}
            selectedNode={menuLevel.selectedNode}
            menuIndex={menuIndex}
            layout={layout}
            active={activeMenuIndex === menuIndex}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}
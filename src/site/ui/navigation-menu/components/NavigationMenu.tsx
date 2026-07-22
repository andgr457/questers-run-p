import styles from './NavigationMenu.module.css'
import NavigationMenuItem from './NavigationMenuItem'
import type { NavigationNode } from '../types/NavigationNode.types'

interface NavigationMenuLevel {
  nodes: NavigationNode[]
  selectedNode?: NavigationNode
}

interface NavigationMenuProps {
  title: string
  description: string
  menuLevels: NavigationMenuLevel[]
  onSelect: (node: NavigationNode, menuIndex: number) => void
}

export default function NavigationMenu({
  title,
  description,
  menuLevels,
  onSelect
}: NavigationMenuProps) {
  return (
    <div className={`${styles.menu} ${styles.desktop}`}>
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

      <div className={styles.levels}>
        {menuLevels.map((menuLevel, menuIndex) => (
          <div
            key={menuIndex}
            className={`${styles.level} ${
              menuLevel.nodes.length === 0
                ? styles.hidden
                : ''
            }`}
          >
            {menuLevel.nodes.map(node => (
              <NavigationMenuItem
                key={node.id}
                node={node}
                menuIndex={menuIndex}
                selected={menuLevel.selectedNode?.id === node.id}
                onSelect={onSelect}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
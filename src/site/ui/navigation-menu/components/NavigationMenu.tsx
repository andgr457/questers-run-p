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
    <div className={styles.menu}>
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

      {menuLevels.map((menuLevel, menuIndex) => {
        if(menuLevel.nodes.length === 0){
          return null
        }

        return (
          <div
            key={menuIndex}
            className={styles.primaryRow}
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
        )
      })}
    </div>
  )
}
import styles from './NavigationMenu.module.css'
import NavigationMenuLevel from './NavigationMenuLevel'
import type { NavigationNode } from '../types/NavigationNode.types'

interface NavigationMenuLevel {
  nodes: NavigationNode[]
  selectedNode?: NavigationNode
}

interface NavigationMenuProps {
  title: string
  description: string
  layout: 'desktop' | 'vertical'
  activeMenuIndex: number
  menuLevels: NavigationMenuLevel[]
  onActivate: (menuIndex: number) => void
  onSelect: (node: NavigationNode, menuIndex: number) => void
}

export default function NavigationMenu({
  title,
  description,
  layout,
  activeMenuIndex,
  menuLevels,
  onActivate,
  onSelect
}: NavigationMenuProps) {
  const hasPrevious = activeMenuIndex > 0 &&
    menuLevels[activeMenuIndex - 1].nodes.length > 0

  const hasNext = activeMenuIndex < menuLevels.length - 1 &&
    menuLevels[activeMenuIndex + 1].nodes.length > 0

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

      <div className={styles.navigation}>
        {hasPrevious && (
          <button
            className={styles.previousButton}
            onClick={() => onActivate(activeMenuIndex - 1)}
          >
            {layout === 'desktop' ? '▲' : '◀'}
          </button>
        )}

        <div className={styles.levels}>
          {menuLevels.map((menuLevel, menuIndex) => {
            let position: 'active' | 'previous' | 'next' | 'hidden' = 'hidden'

            if(menuIndex === activeMenuIndex){
              position = 'active'
            } else if(menuIndex < activeMenuIndex){
              position = 'previous'
            } else if(menuIndex > activeMenuIndex){
              position = 'next'
            }

            return (
              <NavigationMenuLevel
                key={menuIndex}
                nodes={menuLevel.nodes}
                selectedNode={menuLevel.selectedNode}
                activeMenuIndex={activeMenuIndex}
                menuIndex={menuIndex}
                layout={layout}
                position={position}
                onActivate={onActivate}
                onSelect={onSelect}
              />
            )
          })}
        </div>

        {hasNext && (
          <button
            className={styles.nextButton}
            onClick={() => onActivate(activeMenuIndex + 1)}
          >
            {layout === 'desktop' ? '▼' : '▶'}
          </button>
        )}
      </div>
    </div>
  )
}
import styles from './NavigationMenuLevel.module.css'
import NavigationMenuItem from './NavigationMenuItem'
import type { NavigationNode } from '../types/NavigationNode.types'

interface NavigationMenuLevelProps {
  nodes: NavigationNode[]
  selectedNode?: NavigationNode
  menuIndex: number
  layout: 'desktop' | 'vertical'
  active: boolean
  onSelect: (node: NavigationNode, menuIndex: number) => void
}

export default function NavigationMenuLevel({
  nodes,
  selectedNode,
  menuIndex,
  layout,
  active,
  onSelect
}: NavigationMenuLevelProps) {
  if(nodes.length === 0){
    return null
  }

  return (
    <div
      className={`${styles.level} ${styles[layout]} ${
        active
          ? styles.active
          : styles.inactive
      }`}
    >
      {nodes.map(node => (
        <NavigationMenuItem
          key={node.id}
          node={node}
          menuIndex={menuIndex}
          selected={selectedNode?.id === node.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
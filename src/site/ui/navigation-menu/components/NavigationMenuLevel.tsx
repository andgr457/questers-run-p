import styles from './NavigationMenuLevel.module.css'
import NavigationMenuItem from './NavigationMenuItem'
import type { NavigationNode } from '../types/NavigationNode.types'

interface NavigationMenuLevelProps {
  nodes: NavigationNode[]
  selectedNode?: NavigationNode
  menuIndex: number
  layout: 'desktop' | 'vertical'
  position: 'active' | 'previous' | 'next' | 'hidden'
  onActivate: (menuIndex: number) => void
  onSelect: (node: NavigationNode, menuIndex: number) => void
}

export default function NavigationMenuLevel({
  nodes,
  selectedNode,
  menuIndex,
  layout,
  position,
  onActivate,
  onSelect
}: NavigationMenuLevelProps) {
  if(nodes.length === 0){
    return null
  }

  return (
    <div
      className={`${styles.level} ${styles[layout]} ${styles[position]}`}
      onClick={() => onActivate(menuIndex)}
    >
      {nodes.map(node => (
        <NavigationMenuItem
          key={node.id}
          node={node}
          menuIndex={menuIndex}
          selected={selectedNode?.id === node.id}
          active={position === 'active'}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
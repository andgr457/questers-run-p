import styles from './NavigationMenuLevel.module.css'
import NavigationMenuItem from './NavigationMenuItem'
import type { NavigationNode } from '../types/NavigationNode.types'

interface NavigationMenuLevelProps {
  nodes: NavigationNode[]
  selectedNode?: NavigationNode
  menuIndex: number
  layout: 'desktop' | 'vertical'
  active: boolean
  onActivate: (menuIndex: number) => void
  onSelect: (node: NavigationNode, menuIndex: number) => void
}

export default function NavigationMenuLevel({
  nodes,
  selectedNode,
  menuIndex,
  layout,
  active,
  onActivate,
  onSelect
}: NavigationMenuLevelProps) {
  if(nodes.length === 0){
    return null
  }

  function handleActivate() {
    onActivate(menuIndex)
  }

  return (
    <div
      className={`${styles.level} ${styles[layout]} ${
        active
          ? styles.active
          : styles.inactive
      }`}
      onClick={handleActivate}
    >
      {nodes.map(node => (
        <NavigationMenuItem
          key={node.id}
          node={node}
          menuIndex={menuIndex}
          selected={selectedNode?.id === node.id}
          active={active}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
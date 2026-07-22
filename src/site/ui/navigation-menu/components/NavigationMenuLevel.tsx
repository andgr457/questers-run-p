import { useEffect, useRef, useState } from 'react'
import styles from './NavigationMenuLevel.module.css'
import NavigationMenuItem from './NavigationMenuItem'
import type { NavigationNode } from '../types/NavigationNode.types'

interface NavigationMenuLevelProps {
  nodes: NavigationNode[]
  selectedNode?: NavigationNode
  menuIndex: number
  activeMenuIndex: number
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
  const active = position === 'active'

  const trackRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)

  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if(!active || !trackRef.current || !selectedRef.current){
      return
    }

    const track = trackRef.current.getBoundingClientRect()
    const selected = selectedRef.current.getBoundingClientRect()

    const viewportCenter = layout === 'desktop'
      ? track.width / 2
      : track.height / 2

    const selectedCenter = layout === 'desktop'
      ? selected.left - track.left + selected.width / 2
      : selected.top - track.top + selected.height / 2

    setOffset(
      viewportCenter - selectedCenter
    )
  }, [active, selectedNode, layout])

  function handleClick() {
    if(!active){
      onActivate(menuIndex)
    }
  }

  function handleNodeClick(
    event: React.MouseEvent,
    node: NavigationNode
  ) {
    event.stopPropagation()
    onSelect(node, menuIndex)
  }

  return (
    <div
      className={`${styles.level} ${styles[layout]} ${styles[position]}`}
      onClick={handleClick}
    >
      <div
        ref={trackRef}
        className={styles.track}
        style={{
          transform: layout === 'desktop'
            ? `translateX(${active ? offset : 0}px)`
            : `translateY(${active ? offset : 0}px)`
        }}
      >
        <div className={styles.spacer} />

        {nodes.map(node => (
          <div
            key={node.id}
            ref={selectedNode?.id === node.id ? selectedRef : null}
            onClick={(event) => handleNodeClick(event, node)}
          >
            <NavigationMenuItem
              node={node}
              menuIndex={menuIndex}
              selected={selectedNode?.id === node.id}
              active={active}
              onSelect={onSelect}
            />
          </div>
        ))}

        <div className={styles.spacer} />
      </div>
    </div>
  )
}
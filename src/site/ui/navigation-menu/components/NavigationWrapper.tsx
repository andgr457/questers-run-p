import { useState } from 'react'
import styles from './NavigationWrapper.module.css'
import NavigationMenu from './NavigationMenu'
import type { NavigationNode } from '../types/NavigationNode.types'

interface NavigationMenuLevel {
  nodes: NavigationNode[]
  selectedNode?: NavigationNode
}

interface NavigationWrapperProps {
  nodes: NavigationNode[]
}

export default function NavigationWrapper({
  nodes
}: NavigationWrapperProps) {
  const layout = 'desktop'

  const rootNodes = nodes
    .filter(node => !node.parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const [activeMenuIndex, setActiveMenuIndex] = useState(0)

  const [menuLevels, setMenuLevels] = useState<NavigationMenuLevel[]>([
    {
      nodes: rootNodes,
      selectedNode: rootNodes[0]
    },
    {
      nodes: []
    },
    {
      nodes: []
    },
    {
      nodes: []
    }
  ])

  const getChildren = (parentId: string) => {
    return nodes
      .filter(node => node.parentId === parentId)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  const getSelectedPath = () => {
    return menuLevels
      .map(level => level.selectedNode)
      .filter(Boolean) as NavigationNode[]
  }

  const getNavigationTitle = () => {
    const path = getSelectedPath()
    const selected = path[path.length - 1]

    if(!selected){
      return ''
    }

    const parent = path[path.length - 2]

    if(parent){
      return `${parent.title} · ${selected.title}`
    }

    return selected.title
  }

  const getNavigationDescription = () => {
    const path = getSelectedPath()

    return path[path.length - 1]?.description ?? ''
  }

  const handleNodeSelect = (
    node: NavigationNode,
    menuIndex: number
  ) => {
    const children = getChildren(node.id)

    setActiveMenuIndex(
      children.length > 0
        ? menuIndex + 1
        : menuIndex
    )

    setMenuLevels(current => {
      const updated = current.map(level => ({
        nodes: [...level.nodes],
        selectedNode: level.selectedNode
      }))

      updated[menuIndex] = {
        ...updated[menuIndex],
        selectedNode: node
      }

      for(let i = menuIndex + 1; i < updated.length; i++){
        updated[i] = {
          nodes: [],
          selectedNode: undefined
        }
      }

      if(children.length > 0){
        updated[menuIndex + 1] = {
          nodes: children,
          selectedNode: children[0]
        }
      }

      return updated
    })
  }

  return (
    <div className={`${styles.wrapper} ${styles[layout]}`}>
      <NavigationMenu
        title={getNavigationTitle()}
        description={getNavigationDescription()}
        layout={layout}
        activeMenuIndex={activeMenuIndex}
        menuLevels={menuLevels}
        onSelect={handleNodeSelect}
      />
    </div>
  )
}
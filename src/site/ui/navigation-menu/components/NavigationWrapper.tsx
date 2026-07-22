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
  const rootNodes = nodes
    .filter(node => !node.parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

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

  const getNavigationTitle = () => {
    const selectedPath = menuLevels
      .map(level => level.selectedNode)
      .filter(Boolean) as NavigationNode[]

    const selectedNode = selectedPath[selectedPath.length - 1]

    if(!selectedNode){
      return ''
    }

    const parentNode = selectedPath[selectedPath.length - 2]

    if(parentNode){
      return `${parentNode.title} · ${selectedNode.title}`
    }

    return selectedNode.title
  }

  const getNavigationDescription = () => {
    const selectedPath = menuLevels
      .map(level => level.selectedNode)
      .filter(Boolean) as NavigationNode[]

    return selectedPath[selectedPath.length - 1]?.description ?? ''
  }

  const handleNodeSelect = (
    node: NavigationNode,
    menuIndex: number
  ) => {
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

      const children = getChildren(node.id)

      if(
        children.length > 0 &&
        menuIndex + 1 < updated.length
      ){
        updated[menuIndex + 1] = {
          nodes: children,
          selectedNode: children[0]
        }
      }

      return updated
    })
  }

  return (
    <div className={`${styles.wrapper} ${styles.desktop}`}>
      <NavigationMenu
        title={getNavigationTitle()}
        description={getNavigationDescription()}
        menuLevels={menuLevels}
        onSelect={handleNodeSelect}
      />
    </div>
  )
}
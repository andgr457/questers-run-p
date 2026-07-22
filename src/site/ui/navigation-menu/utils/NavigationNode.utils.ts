import type { NavigationNode, NavigationNodeId } from '../types/NavigationNode.types'


export function createNavigationNodeRecord(
  nodes: NavigationNode[]
): Record<NavigationNodeId, NavigationNode> {

  return nodes.reduce<Record<NavigationNodeId, NavigationNode>>(
    (record, node) => {

      record[node.id] = node

      return record
    },
    {}
  )
}


export function getNavigationNode(
  nodes: Record<NavigationNodeId, NavigationNode>,
  id: NavigationNodeId
): NavigationNode | undefined {

  return nodes[id]
}


export function getChildNodes(
  nodes: NavigationNode[],
  parentId: NavigationNodeId
): NavigationNode[] {

  return nodes
    .filter(node => node.parentId === parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}


export function hasChildren(
  nodes: NavigationNode[],
  nodeId: NavigationNodeId
): boolean {

  return nodes.some(node => node.parentId === nodeId)
}


export function getRootNodes(
  nodes: NavigationNode[]
): NavigationNode[] {

  return nodes
    .filter(node => !node.parentId)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}
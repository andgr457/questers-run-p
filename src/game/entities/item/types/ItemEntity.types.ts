import React from 'react'

export type ItemEntityType =
  | 'resource'
  | 'material'
  | 'consumable'
  | 'weapon'
  | 'armor'
  | 'tool'
  | 'quest'
  | 'misc'

export interface ItemEntity {
  id: string

  title: React.ReactNode
  titleString: string

  description: React.ReactNode

  gold: {
    buy: number
    sell: number
  }

  type: ItemEntityType

  stackable: boolean

  icon?: string
}
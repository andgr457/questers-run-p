import React from 'react'

export interface WindowData {
  id: string
  title: string

  Component: React.ComponentType<any>
  props?: any

  x: number
  y: number

  width: number
  height: number

  minWidth?: number
  minHeight?: number

  autoSize?: boolean

  zIndex: number

  hasInitializedSize?: boolean
}
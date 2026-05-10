import React from 'react'

export interface WindowData {
  id: string
  title: string
  content: React.ReactNode

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
export interface Discussion {
  index: number
  content: React.ReactNode
}

export interface DiscussionAction {
  title: string
  element?: React.ReactNode
  placeholder?: string
  onChange?: (e: React.ChangeEvent) => void
  onClick?: () => void
}
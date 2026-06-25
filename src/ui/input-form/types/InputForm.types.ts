
export interface InputScreen {
  index: number
  steps: InputScreenStep[]
}

export interface InputScreenStep {
  id: string
  title?: React.ReactNode
  content?: React.ReactNode
  inputs: ViewInputScreenStepInput[]
  onAccept: () => boolean
  onCancel: () => void
}

export interface ViewInputScreenStepInput {
  label: string
  value: string
  render: (value: string, onChange: (v: string) => void) => React.ReactNode
}


export interface InputScreen {
  index: number
  steps: InputScreenStep[]
}

export interface InputScreenStep {
  id: string
  title?: React.ReactNode
  content: React.ReactNode
  inputs: ViewInputScreenStepInput[]
  onAccept?: () => void
  onCancel?: () => void
}

export interface InputValidationResult {
  isValid: boolean
  error?: string
}

export interface ViewInputScreenStepInput {
  label: string
  value: string
  onValidate: (value: string) => InputValidationResult
  render: (value: string, onChange: (v: string) => void) => React.ReactNode
}

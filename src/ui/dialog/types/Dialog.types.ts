export interface DialogOption {
  label: string
  action: () => void
  disabled?: boolean
}

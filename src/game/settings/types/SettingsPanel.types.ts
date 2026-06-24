export type SettingsMode = 'main'
  | 'debug_events'
  | 'debug_ui'
  | 'reset_everything'
  | 'reset_specific'


export interface SettingsListUI {
  title: string
  description: React.ReactNode
  items: SettingsListItemUI[]
}

export interface SettingsListItemUI {
  title: string
  description: React.ReactNode
  mode: SettingsMode
}
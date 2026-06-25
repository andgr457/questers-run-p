import type { SettingsMode } from '../types/SettingsPanel.types';

export const GAME_SETTINGS_MODE_NAMES: Record<SettingsMode, string> = {
  main: '',
  debug_events: 'Event Categories',
  debug_ui: 'Debug UI',
  reset_everything: 'Reset Everything',
  reset_specific: 'Reset Specifics'
}
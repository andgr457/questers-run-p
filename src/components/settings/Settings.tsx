import type { AppProperties } from '../../interfaces/AppProperties.types'
import './Settings.css'

export interface SettingsState {
  music: {
    musicEnabled: boolean
    musicVolume: number
    musicFile?: string,
  }
}
interface SettingsProps extends AppProperties {}

export default function Settings(props: SettingsProps) {
  const {
    handleResetEverything,
    handleResetProfession,
  } = props

  return (
    <div className='settings-main'>

      {/* RESET */}
      <div className='settings-section'>
        <div className='character-section-title'>
          <div className='page-header-banner'>
            <div className='page-header-title'>
              RESET
            </div>
          </div>
        </div>

        <div className='settings-sections'>

          <div>
            <div className='settings-content'>
              Resets the entire game.
            </div>

            <div className='settings-content'>
              <button
                className='danger'
                onClick={() => handleResetEverything?.()}
              >
                Reset Everything
              </button>
            </div>
          </div>

          <div>
            <div className='settings-content'>
              Resets the gathering profession back to level zero.
            </div>

            <div className='settings-content'>
              <button
                className='danger'
                onClick={() => handleResetProfession?.('gathering')}
              >
                Reset Gathering
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
import type { AppProperties } from '../../interfaces/AppProperties.types';
import './Settings.css'

interface SettingsProps extends AppProperties {

}

export default function Settings(props: SettingsProps){
  const {
    handleResetEverything,
    handleResetProfession
  } = props
  return <div className='settings-main'>
    <div className='settings-section'>
      <div className='settings-header'>
        Reset
      </div>
      <div className='settings-sections'>
        <div>
          <div className='settings-content'>
            Resets the entire game.
          </div>
          <div className='settings-content'>
            <button className='danger' onClick={() => {
              handleResetEverything?.()
            }}>
              Everything
            </button>
          </div>
        </div>

        <div>
          <div className='settings-content'>
            Resets the gathering profession back to level zero.
          </div>
          <div className='settings-content'>
            <button className='danger' onClick={() => {
              handleResetProfession?.('gathering')
            }}>
              Gathering
            </button>
          </div>
        </div>
      </div>

    </div>
    
  </div>
}
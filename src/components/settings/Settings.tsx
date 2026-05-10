import type { AppProperties } from '../../interfaces/AppProperties.types';

interface SettingsProps extends AppProperties {

}

export default function Settings(props: SettingsProps){
  const {
    handleResetEverything,
  } = props
  return <div>
    <div>
      <div>
        Reset
      </div>
      <div>
        <button className='danger' onClick={() => {
          handleResetEverything?.()
        }}>
          Reset Everything
        </button>
      </div>
    </div>
  </div>
}
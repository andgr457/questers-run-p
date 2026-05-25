import Settings from '../../components/settings/Settings';
import type { AppProperties } from '../../interfaces/AppProperties.types';

interface SettingsPageProps extends AppProperties {

}

export default function SettingsPage(props: SettingsPageProps){

  return <div>
    <div className='character-section-title'>
      <div className='page-header-banner'>
        <div className='page-header-title'>
          SETTINGS
        </div>
      </div>
    </div>
    <Settings 
      {...props}
    />
  </div>
}
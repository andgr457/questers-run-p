import FeatureBody from '../../core/components/feature/components/body/FeatureBody'
import FeatureHeader from '../../core/components/feature/components/header/FeatureHeader'
import Actions from '../../core/components/form/Actions'
import styles from './Settings.module.css'

export default function Settings() {

  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Tavern Hall'}
      />

      <FeatureBody>
        <Actions 
          actions={[
            {
              inactive: false,
              text: 'RESET',
              colorScheme: 'danger',
              onClick: () => {
                if(confirm('WARNING: This will completely reset back to the beginning. Are you sure?')){
                  localStorage.clear()
                  location.reload()
                }
              }
            }
          ]}
        />
      </FeatureBody>

    </div>
  )
}
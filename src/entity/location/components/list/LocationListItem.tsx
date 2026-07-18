import type { LocationWithActions } from './LocationList'

import styles from './LocationListItem.module.css'

interface Props {
  locationWithActions: LocationWithActions
}

export default function LocationListItem(props: Props) {
  const {locationWithActions} = props
  const { 
    location,
    actions,
  } = locationWithActions

  return (
    <div className={styles.wrapper}>
      <div className={styles.text}>
        {location.name} 
      </div>

      <div className={styles.text}>
        Lv. {location.level}
      </div>
      
      <div className={styles.actions}>
        {actions.map((a, idx) => {
          
          return <div 
            key={`location-action-${idx}`}
            title={a.title}
            className={`${styles.action} ${a.isTutorial ? 'tutorial-hint pulse-tutorial' : ''}`}
            onClick={() => {
              if(a.fn){
                a.fn?.(location)
              }
            }}
          >
            {a.icon}
          </div>
        })}
      </div>
    </div>
  )
}
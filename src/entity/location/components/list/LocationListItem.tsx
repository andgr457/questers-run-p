import type { LocationWithAction } from './LocationList'

import styles from './LocationListItem.module.css'

interface Props {
  locationWithAction: LocationWithAction
}

export default function LocationListItem(props: Props) {
  const {locationWithAction} = props
  const { 
    location,
    actions,
  } = locationWithAction

  return (
    <div className={styles.wrapper}>
      <div className={styles.text}>
        {location.name} 
      </div>

      <div className={styles.text}>
        Lv. {location.level}
      </div>
      
      <div className={styles.actions}>
        {actions.map(a => {
          
          return <div 
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
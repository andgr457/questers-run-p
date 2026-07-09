import type { LocationWithAction } from './LocationList'

import styles from './LocationListItem.module.css'

interface Props {
  locationWithTravel: LocationWithAction
}

export default function LocationListItem(props: Props) {
  const {locationWithTravel} = props
  const { 
    location,
    actions,
  } = locationWithTravel

  return (
    <div className={styles.row}>
      <div className={styles.main}>
        <div className={styles.title}>
          {location.name}
        </div>

        <div className={styles.description}>
          {location.description}
        </div>
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
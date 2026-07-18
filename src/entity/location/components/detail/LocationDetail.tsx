import styles from './LocationDetail.module.css'
import type { LocationEntity } from '../../types/LocationEntity.types';
import { GAME_LOCATIONS } from '../../data/Location.data';

interface Props {
  entity: LocationEntity
}

export default function LocationDetail(props: Props){
  const {
    entity
  } = props
  const linkedLocations = GAME_LOCATIONS.filter(l => 
    entity?.linkedLocationIds?.includes(l.id)
  )
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        {entity.name}
        <div className={styles.location}>
          Requires Character Level {entity.level}
        </div>
      </div>
      <div className={styles.description}>
        {entity.description}
      </div>
      <div className={styles.title}>
        Linked Locations
      </div>
      <div className={styles.locations}>
        {linkedLocations.map(l => {
          
          return <div 
            className={styles.location}
            >
            {l.name}
          </div>
        })}
      </div>
    </div>
  )
}
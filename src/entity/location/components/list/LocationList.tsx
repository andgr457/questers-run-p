import type { LocationEntity } from '../../types/LocationEntity.types';
import LocationListItem from './LocationListItem';

export interface LocationAction {
  title: string
  icon: string
  isTutorial?: boolean
  isDisabled?: boolean
  fn?: (entity: LocationEntity) => void
}

export interface LocationWithActions {
  location: LocationEntity
  actions: LocationAction[]
}

interface Props {
  locationsWithActions: LocationWithActions[]  
}

export default function LocationList(props: Props){
  const {
    locationsWithActions
  } = props
  
  return (
    <div>
      {locationsWithActions.map((l, idx) => {

        return <LocationListItem 
          key={`location-${idx}`}
          locationWithActions={l}
        />
      })}
    </div>
  )
}
import type { Location } from '../../types/Location.types';
import LocationListItem from './LocationListItem';

export interface LocationAction {
  title: string
  icon: string
  isTutorial?: boolean
  isDisabled?: boolean
  fn?: (entity: Location) => void
}

export interface LocationWithAction {
  location: Location
  actions: LocationAction[]
}

interface Props {
  locationsWithActions: LocationWithAction[]  
}

export default function LocationList(props: Props){
  const {
    locationsWithActions
  } = props
  
  return (
    <div>
      {locationsWithActions.map(l => {

        return <LocationListItem 
          locationWithAction={l}
        />
      })}
    </div>
  )
}
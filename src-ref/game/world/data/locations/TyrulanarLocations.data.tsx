import type { WorldConnection, WorldLocation } from '../../types/WorldLocation.types';

const TYRULANAR_VOID_LOCATION_CONNECTIONS: WorldConnection[] = [
  {
    toId: '',
    travelMs: 0
  }
]

const TYRULANAR_VOID_LOCATION: WorldLocation = {
  id: 'tyrulanar_location_void', //start
  name: 'The Void',
  description: <></>,
  connections: [],
  type: 'void'
}

export const TYRULANAR_LOCATIONS: WorldLocation[] = [
  TYRULANAR_VOID_LOCATION,
]
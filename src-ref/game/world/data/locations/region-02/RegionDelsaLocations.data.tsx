import type { WorldConnection, WorldLocation } from '../../../types/WorldLocation.types'
import { LOCATION_DISTANCES } from '../../../utils/LocationDistance.utils'
import { REGION_IDS } from '../../regions/RegionIds.data'
import { REGION_TYRULANAR_LOCATION_IDS } from '../region-01/RegionTyrulanarLocationIds.data'
import { REGION_DELSA_LOCATION_IDS } from './RegionDelsaLocationIds.data'

/**
 * 1. DELSA BRIDGE - Region Entrance
 */
const DELSA_BRIDGE_ENTRANCE_CONNECTIONS: WorldConnection[] = [
  //BACK TO
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_MOUNTAINS,
    travelMs: LOCATION_DISTANCES.LONG
  },
  //FORWARD TO WIP
]

const DELSA_BRIDGE_ENTRANCE_LOCATION: WorldLocation = {
  id: REGION_DELSA_LOCATION_IDS.BRIDGE_ENTRANCE,
  regionId: REGION_IDS.REGION_02_DELSA_ID,
  name: 'Delsa West Bridge',
  type: 'bridge',
  description: <div className='god-description'>
    A mystical nothingness where you met 
    with <span className='location-description'>Elas</span> the <span className='god-title'>God 
      of Anarchy</span>.</div>,
  connections: [
    ...DELSA_BRIDGE_ENTRANCE_CONNECTIONS,
  ],
}

export const DELSA_LOCATIONS: WorldLocation[] = [
  DELSA_BRIDGE_ENTRANCE_LOCATION,
]
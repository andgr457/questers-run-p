import type { WorldConnection, WorldLocation } from '../../../types/WorldLocation.types';
import { REGION_TYRULANAR_LOCATION_IDS } from './RegionTyrulanarLocationIds.data';

//#region STARTING
const TYRULANAR_VOID_LOCATION_CONNECTIONS: WorldConnection[] = [
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.PLAINS_ORON,
    travelMs: 5000
  }
]

//#region 1ST WORLD LOCATION
//VOID: Where players create their account and first character.
const TYRULANAR_VOID_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.VOID,
  name: 'The Void',
  description: <div className='god-description'>
    A mystical nothingness where you met 
    with <span className='location-description'>Elas</span> the <span className='god-title'>God 
      of Anarchy</span>.</div>,
  connections: [
    ...TYRULANAR_VOID_LOCATION_CONNECTIONS,
  ],
  type: 'void'
}

//#region WORLD START
//PLAINS: Only place connected to the oron town and starter leveling area.
const TYRULARNAR_ORON_PLAINS_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.PLAINS_ORON,
  name: 'Oron Plains',
  description: <div className='location-description'>
    Wide open grassy area with small rolling hills just outside the small town of <span className='town-name'>Oron</span>.
  </div>,
  connections: [
    ...TYRULANAR_VOID_LOCATION_CONNECTIONS,
  ],
  type: 'town'
}



export const TYRULANAR_LOCATIONS: WorldLocation[] = [
  TYRULANAR_VOID_LOCATION,
]
import type { WorldConnection, WorldLocation } from '../../../types/WorldLocation.types';
import { LOCATION_DISTANCES } from '../../../utils/LocationDistance.utils';
import { REGION_IDS } from '../../regions/RegionIds.data';
import { REGION_01_TYRULANAR } from '../../regions/Region.data';
import { REGION_TYRULANAR_LOCATION_IDS } from './RegionTyrulanarLocationIds.data';
import { REGION_DELSA_LOCATION_IDS } from '../region-02/RegionDelsaLocationIds.data';

/**
 * 1. VOID - Account & First Character Create
 */
const TYRULANAR_ORON_VOID_CONNECTIONS: WorldConnection[] = [
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_PLAINS_01,
    travelMs: LOCATION_DISTANCES.LONG
  }
]

const TYRULANAR_ORON_VOID_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.ORON_VOID,
  regionId: REGION_IDS.REGION_01_TYRULANAR_ID,
  name: 'The Void',
  type: 'void',
  description: <div className='god-description'>
    A mystical nothingness where you met 
    with <span className='location-description'>Elas</span> the <span className='god-title'>God 
      of Anarchy</span>.</div>,
  connections: [
    ...TYRULANAR_ORON_VOID_CONNECTIONS,
  ],
}

/**
 * 2. PLAINS #1 - West of Town Oron - Starting Area
 */
const TYRULARNAR_ORON_PLAINS_01_CONNECTIONS: WorldConnection[] = [
  //ONLY TO TOWN
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_TOWN,
    travelMs: LOCATION_DISTANCES.MED
  }
]

const TYRULARNAR_ORON_PLAINS_01_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.ORON_PLAINS_01,
  regionId: REGION_IDS.REGION_01_TYRULANAR_ID,
  name: 'Oron West Plains',
  type: 'plains',
  description: <div className='location-description'>
    Wide open grassy area with small rolling hills 
    just outside the small town 
    of <span className='town-name'>Oron</span>.
  </div>,
  connections: [
    ...TYRULARNAR_ORON_PLAINS_01_CONNECTIONS,
  ],
}

/**
 * 3. TOWN OF ORON - Starter Town
 */
const TYRULARNAR_ORON_TOWN_CONNECTIONS: WorldConnection[] = [
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_PLAINS_01,
    travelMs: LOCATION_DISTANCES.MED
  },
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_PLAINS_02,
    travelMs: LOCATION_DISTANCES.MED
  }
]

const TYRULARNAR_ORON_TOWN_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.ORON_TOWN,
  regionId: REGION_IDS.REGION_01_TYRULANAR_ID,
  name: 'Oron',
  type: 'town',
  description: <div className='location-description'>
    The small town of <span className='town-name'>Oron</span>, 
    located the farthest east of <span className='region-name'>{REGION_01_TYRULANAR.name}</span>. 
  </div>,
  connections: [
    ...TYRULARNAR_ORON_TOWN_CONNECTIONS,
  ],
}

/**
 * 4. PLAINS #2 - East of Oron - BACK TO Town, or Forward to BRIDGE or CAVE.
 */
const TYRULARNAR_ORON_PLAINS_02_CONNECTIONS: WorldConnection[] = [
  //BACK TO TOWN
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_TOWN,
    travelMs: LOCATION_DISTANCES.MED
  },
  //FORWARD TO
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_CAVE,
    travelMs: LOCATION_DISTANCES.MED
  },
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_BRIDGE,
    travelMs: LOCATION_DISTANCES.MED
  }
]

const TYRULARNAR_ORON_PLAINS_02_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.ORON_PLAINS_02,
  regionId: REGION_IDS.REGION_01_TYRULANAR_ID,
  name: 'Oron East Plains',
  type: 'plains',
  description: <div className='location-description'>
    Bustling grassy area just east of the small town 
    of <span className='town-name'>Oron</span>.
  </div>,
  connections: [
    ...TYRULARNAR_ORON_PLAINS_02_CONNECTIONS,
  ],
}

/**
 * 4.a PLAINS #2 Cave - Dead End
 */
const TYRULARNAR_ORON_CAVE_CONNECTIONS: WorldConnection[] = [
  //BACK TO
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_PLAINS_02,
    travelMs: LOCATION_DISTANCES.MED
  },
  //FORWARD TO NOTHING
  
]

const TYRULARNAR_ORON_CAVE_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.ORON_CAVE,
  regionId: REGION_IDS.REGION_01_TYRULANAR_ID,
  name: 'Oron East Plains Cave',
  type: 'cave',
  description: <div className='location-description'>
    A small damp cave found to have <span className='copper-color'>Copper</span> and <span className='tin-color'>Tin</span>, but home to 
    slime and bears.
  </div>,
  connections: [
    ...TYRULARNAR_ORON_CAVE_CONNECTIONS,
  ],
}

/**
 * 4.b PLAINS #2 Bridge
 */
const TYRULARNAR_ORON_BRIDGE_CONNECTIONS: WorldConnection[] = [
  //BACK TO
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_PLAINS_02,
    travelMs: LOCATION_DISTANCES.MED
  },
  //FORWARD TO
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_WOODS,
    travelMs: LOCATION_DISTANCES.SHORT
  }
]

const TYRULARNAR_ORON_BRIDGE_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.ORON_BRIDGE,
  regionId: REGION_IDS.REGION_01_TYRULANAR_ID,
  name: 'Oron Bridge',
  type: 'bridge',
  description: <div className='location-description'>
    A massive bridge spanning the entire Oron river. Tolls are required 
    to keep the roads and bridges in good condition.
  </div>,
  connections: [
    ...TYRULARNAR_ORON_BRIDGE_CONNECTIONS,
  ],
}

/**
 * 5. ORON WOODS
 */
const TYRULARNAR_ORON_WOODS_CONNECTIONS: WorldConnection[] = [
  //BACK TO
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_BRIDGE,
    travelMs: LOCATION_DISTANCES.MED
  },
  //FORWARD TO
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_MOUNTAINS,
    travelMs: LOCATION_DISTANCES.LONG
  }
]

const TYRULARNAR_ORON_WOODS_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.ORON_WOODS,
  regionId: REGION_IDS.REGION_01_TYRULANAR_ID,
  name: 'Oron Bridge',
  type: 'bridge',
  description: <div className='location-description'>
    A massive bridge spanning the entire Oron river. Tolls are required 
    to keep the roads and bridges in good condition.
  </div>,
  connections: [
    ...TYRULARNAR_ORON_WOODS_CONNECTIONS,
  ],
}

/**
 * 5. ORON MOUNTAINS
 */
const TYRULARNAR_ORON_MOUNTAINS_CONNECTIONS: WorldConnection[] = [
  //BACK TO
  {
    toId: REGION_TYRULANAR_LOCATION_IDS.ORON_WOODS,
    travelMs: LOCATION_DISTANCES.LONG
  },
  //FORWARD TO
  {
    toId: REGION_DELSA_LOCATION_IDS.BRIDGE_ENTRANCE,
    travelMs: LOCATION_DISTANCES.SHORT
  }
]

const TYRULARNAR_ORON_MOUNTAINS_LOCATION: WorldLocation = {
  id: REGION_TYRULANAR_LOCATION_IDS.ORON_MOUNTAINS,
  regionId: REGION_IDS.REGION_01_TYRULANAR_ID,
  name: 'Oron Mountains',
  type: 'bridge',
  description: <div className='location-description'>
    A large, windy, mountain range filled with wolves, bears, and other 
    creatures.
  </div>,
  connections: [
    ...TYRULARNAR_ORON_MOUNTAINS_CONNECTIONS,
  ],
}

export const TYRULANAR_LOCATIONS: WorldLocation[] = [
  TYRULANAR_ORON_VOID_LOCATION,
  TYRULARNAR_ORON_PLAINS_01_LOCATION,
  TYRULARNAR_ORON_TOWN_LOCATION,
  TYRULARNAR_ORON_PLAINS_02_LOCATION,
  TYRULARNAR_ORON_CAVE_LOCATION,
  TYRULARNAR_ORON_BRIDGE_LOCATION,
  TYRULARNAR_ORON_WOODS_LOCATION,
  TYRULARNAR_ORON_MOUNTAINS_LOCATION,
]
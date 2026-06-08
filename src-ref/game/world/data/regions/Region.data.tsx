import type { WorldRegion } from '../../types/WorldRegion.types.ts';
import { REGION_IDS } from './RegionIds.data.ts'

export const REGION_01_TYRULANAR: WorldRegion = {
  id: REGION_IDS.REGION_01_TYRULANAR_ID,
  name: 'Tyrulanar',
  levelMin: 1,
  levelMax: 5,
  description: <>
    Tyrulanar was the first region to be established in the world.
  </>,
}

export const REGION_02_DELSA: WorldRegion = {
  id: REGION_IDS.REGION_02_DELSA_ID,
  name: 'Delsa',
  levelMin: 5,
  levelMax: 10,
  description: <>
    Delsa is a heavily wooded region with many caves and a couple of dungeons.
  </>,
}
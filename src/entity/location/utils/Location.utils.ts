import { GAME_LOCATION_ORON_ADVENTURERS_GUILD, GAME_LOCATIONS } from '../data/Location.data';

export function getLocationById(locationId: string){
  const fallback = GAME_LOCATION_ORON_ADVENTURERS_GUILD
  if(!locationId){
    return fallback
  }

  const location = GAME_LOCATIONS.find(l => 
    l.id === locationId
  )
  if(!location){
    return fallback
  }
  
  return location
}
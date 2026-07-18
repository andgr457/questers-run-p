import type { OverlayMode } from '../types/OverlayMode.types';

export function checkForPulse(checkFn: () => boolean, currentOverlayMode: OverlayMode, setsToOverlayMode: OverlayMode){
  //if obj is defined
  const checkPassed = checkFn()
  const onCurrentOverlayMode = currentOverlayMode === setsToOverlayMode
  
  //eg. idleCharacters.length > 0 and on characters overlay mode
  if(checkPassed){
    if(onCurrentOverlayMode){
      return false
    } else {
      return true
    }
  }
}

import { useCallback, useState } from 'react'
import { characterRuntimeService } from '../../../engine/entity/CharacterRuntimeService'
import { playerRuntimeService } from '../../../engine/entity/PlayerRuntimeService'
import type { CharacterEntity } from '../../../entity/character/types/CharacterEntity.types'
import type { PlayerEntity } from '../../../entity/player/types/PlayerEntity.types'
import GamePanel from '../../../ui/panel/GamePanel'
import { useConfirm } from '../../../ui/modal/providers/ConfirmProvider'
import GamePanelSection from '../../../ui/panel/GamePanelSection'
import DetailRow from '../../detail/DetailRow'

export default function ResetEverything() {
  const {showConfirm} = useConfirm()
  const [progress, setProgress] = useState(0)
  const [player, setPlayer] = useState<PlayerEntity | undefined>(playerRuntimeService.getPlayer())
  const [characters, setCharacters] = useState<CharacterEntity[]>(characterRuntimeService.getCharacters())
  
  const handleResetEverythingClicked = useCallback(async () => {
    const confirmResult = await showConfirm({
      isYesNo: true,
      title: 'Confirm Full Reset',
      message: 'Are you absolutely sure you want to do this?'
    })
    if(!confirmResult) return

    localStorage.clear()
    window.location.reload()  
  }, [])
  const resetAction = {
    name: 'RESET EVERYTHING',
    fn: handleResetEverythingClicked
  }
  return <GamePanelSection
    title='WARNING!'
    actions={[
      resetAction,
    ]}
    description={<>
      Confirming this will clear everything on this site, for this browser. 
      Only continue if you are absolutely sure you want this done.
    </>}
  >
    <div>
      <div className='game-list-item-header'>
        Local Storage
      </div>
      <DetailRow field='Player' value={typeof player === 'undefined' ? '' : player.name} />
      <DetailRow field='Characters' value={`${characters.length}`} />
    </div>
  </GamePanelSection>
}
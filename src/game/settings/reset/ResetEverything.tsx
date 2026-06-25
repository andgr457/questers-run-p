import { useCallback } from 'react'
import { characterRuntimeService } from '../../../engine/character/CharacterRuntimeService'
import { playerRuntimeService } from '../../../engine/player/PlayerRuntimeService'
import { useConfirm } from '../../../ui/modal/providers/ConfirmProvider'
import GamePanelSection from '../../../ui/panel/GamePanelSection'
import DetailRow from '../../detail/DetailRow'
import type { SettingsMode } from '../types/SettingsPanel.types'

interface Props {
  setSettingsMode: (mode: SettingsMode) => void
}

export default function ResetEverything(props: Props) {
  const {showConfirm} = useConfirm()
  const {
    setSettingsMode
  } = props
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

  const player = playerRuntimeService.getPlayer()
  const characters = characterRuntimeService.getCharacters()
  return <GamePanelSection
    title='WARNING!'
    actions={[
      {
        name: 'reset everything',
        className: 'button danger',
        fn: () => {
          handleResetEverythingClicked()
        }
      }
    ]}
    onBack={() => {setSettingsMode('main')}}
    onBackLabel='Settings'
    description={<>
      Confirming this will clear everything on this site, for this browser. 
      Only continue if you are absolutely sure you want this done.
    </>}
  >
    <div className='detail-rows'>
      <DetailRow field='Player' value={typeof player === 'undefined' ? '' : player.name} />
      <DetailRow field='Characters' value={`${characters.length}`} />
    </div>
  </GamePanelSection>
}
import GamePanel from '../../../../ui/panel/GamePanel'
import PlayerDetail from '../detail/PlayerDetail'
import { playerRuntimeService } from '../../../../engine/player/PlayerRuntimeService'

export default function PlayerManage(){
  return (
    <GamePanel
      currentScreenName=''
      title={`Manage ${playerRuntimeService.getPlayer()?.name}`}
    >
      <PlayerDetail />
    </GamePanel>    
  )
}
import { useEffect, useState } from 'react';
import GamePanel from '../../../ui/panel/GamePanel';
import type { PlayerEntity } from '../../../entity/player/types/PlayerEntity.types';
import { playerRuntimeService } from '../../../engine/player/PlayerRuntimeService';
import type { CharacterEntity } from '../../../entity/character/types/CharacterEntity.types';
import { characterRuntimeService } from '../../../engine/character/CharacterRuntimeService';
import { eventBus } from '../../../engine/event/EventBus';
import { GAME_EVENT_BUS_CHARACTER_TYPES, GAME_EVENT_BUS_PLAYER_TYPES } from '../../../engine/event/utils/EventBus.utils';
import DetailRow from '../../detail/DetailRow';
import { getPlayerGold } from '../../../engine/player/utils/Player.utils';
import { GAME_CHARACTER_CLASSES } from '../../../entity/character-class/data/CharacterClassEntity.data';
import type { CharacterClassId } from '../../../entity/character-class/types/CharacterClassEntity.types';
import GameList from '../../../ui/list/GameList';

interface CharacterDashboard {
  id: string
  name: string
  characterClassName: string
  level: number
  status: string
}

export default function Dashboard() {
  const [player, setPlayer] = useState<PlayerEntity | undefined>(playerRuntimeService.getPlayer())
  const [characters, setCharacters] = useState<CharacterEntity[]>(characterRuntimeService.getCharacters())

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(GAME_EVENT_BUS_PLAYER_TYPES.includes(event.type)){
        setPlayer(playerRuntimeService.getPlayer())
      }
      if(GAME_EVENT_BUS_CHARACTER_TYPES.includes(event.type)){
        setCharacters(characterRuntimeService.getCharacters())
      }
    })
    return unsub
  }, [])

  const characterDashboards: CharacterDashboard[] = []
  for(const c of characters){
    characterDashboards.push({
      id: c.id,
      characterClassName: GAME_CHARACTER_CLASSES[c.classId as CharacterClassId].name,
      level: c.level,
      name: c.name,
      status: 'Idle'
    })
  }

  return <GamePanel
    title={`Quester's Run`}
    currentScreenName=''
  >
    <div>
      <div className='game-list-item-header'>
        PLAYER
      </div>
      <div className='detail-rows'>
        <DetailRow field='Player' value={player?.name ?? ''} />
        <DetailRow field='Gold' value={getPlayerGold().toLocaleString()} />
        <DetailRow field='Character Tokens' value={player?.characterTokens?.toLocaleString() ?? '0'} />
      </div>
      <div className='game-list-item-header'>
        CHARACTERS
      </div>
      <GameList<CharacterDashboard>
        actions={[]}
        entities={characterDashboards}  
        getEntityContent={(entity) => {
          return <>
            <div className='game-list-item-header'>
              {entity.name}
            </div>
            <div className='detail-rows'>
              <DetailRow field='Class' value={entity.characterClassName} />
              <DetailRow field='Level' value={entity.level.toString()} />
              <DetailRow field='Status' value={entity.status} />

            </div>

          </>
        }}
      >

      </GameList>
    </div>
  </GamePanel>
}
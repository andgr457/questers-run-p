import { useEffect, useState } from 'react';
import GamePanel from '../../../ui/panel/GamePanel';
import type { PlayerEntity } from '../../../entity/player/types/PlayerEntity.types';
import { playerRuntimeService } from '../../../engine/player/PlayerRuntimeService';
import type { CharacterEntity } from '../../../entity/character/types/CharacterEntity.types';
import { characterRuntimeService } from '../../../engine/character/CharacterRuntimeService';
import { eventBus } from '../../../engine/event/EventBus';
import { GAME_EVENT_BUS_CHARACTER_TYPES, GAME_EVENT_BUS_PLAYER_TYPES } from '../../../engine/event/utils/EventBus.utils';
import { getPlayerGold } from '../../../entity/player/utils/Player.utils';
import { GAME_CHARACTER_CLASSES } from '../../../entity/character-class/data/CharacterClassEntity.data';
import type { CharacterClassId } from '../../../entity/character-class/types/CharacterClassEntity.types';
import { getCharacterGold } from '../../../entity/character/utils/Character.utils';
import ProgressBar from '../../../ui/progress-bar/ProgressBar';
import { getProgress } from '../../../ui/progress-bar/utils/ProgressBar.utils';

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
  if(!player) return

  return (
    <GamePanel
      title={`Dashboard`}
      currentScreenName=''
    >
      <div>
        <div className='dashboard-section'>
          <div className='dashboard-section-title'>
            PLAYER
          </div>

          <div className='dashboard-row'>
            <div>{player.name}</div>
            <div>Lv. {player.level ?? 1}</div>
            <div>
              <ProgressBar
                value={getProgress(player.xp, player.xpNextLevel)}
                max={player.xpNextLevel}
                color='#a855f7'
                label='XP'
              />
            </div>
            <div>{getPlayerGold().toLocaleString()}g</div>
            <div>Tokens {player.characterTokens ?? 0}</div>
          </div>
        </div>

        <div className='dashboard-section'>
          <div className='dashboard-section-title'>
            CHARACTERS
          </div>
          {characters.map(c => {

            return <div className='dashboard-row'>
              <div>{c.name}</div>
              <div>Lv. {c.level ?? 1}</div>
              <div>
                <ProgressBar
                  value={getProgress(c.xp, c.xpNextLevel)}
                  max={c.xpNextLevel}
                  color='#a855f7'
                  label='XP'
                />
              </div>
              <div>{getCharacterGold(c.id).toLocaleString()}g</div>
              <div>{GAME_CHARACTER_CLASSES[c.classId as CharacterClassId].name}</div>
              <div>Idle</div>
            </div>
          })}

        </div>
      </div>
    </GamePanel>
  )
}
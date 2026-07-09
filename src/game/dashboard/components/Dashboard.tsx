import GamePanel from '../../../ui/panel/GamePanel';
import { getPlayerGold } from '../../../entity/player/utils/Player.utils';
import { GAME_CHARACTER_CLASSES } from '../../../entity/character-class/data/CharacterClassEntity.data';
import type { CharacterClassId } from '../../../entity/character-class/types/CharacterClassEntity.types';
import { getCharacterGold } from '../../../entity/character/utils/Character.utils';
import ProgressBar from '../../../ui/progress-bar/ProgressBar';
import { getProgress } from '../../../ui/progress-bar/utils/ProgressBar.utils';
import { usePlayer } from '../../../engine/player/hooks/usePlayer';
import { useCharacters } from '../../../engine/character/hooks/useCharacters';

interface CharacterDashboard {
  id: string
  name: string
  characterClassName: string
  level: number
  status: string
}

export default function Dashboard() {
  const {player} = usePlayer()
  const {characters} = useCharacters()

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
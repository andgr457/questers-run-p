import { eventBus } from '../../../../engine/event/EventBus'
import GamePanel from '../../../../ui/panel/GamePanel'
import CharacterListItem from './CharacterListItem'
// import { useConfirm } from '../../../../ui/modal/providers/ConfirmProvider'
import { useTutorial } from '../../../../engine/tutorial/hooks/useTutorial'
import { useCharacters } from '../../../../engine/character/hooks/useCharacters'
import { usePlayer } from '../../../../engine/player/hooks/usePlayer'

export type CharacterListMode = 'list'
  | 'detail'

export default function CharacterList() {
  // const {showConfirm} = useConfirm()
  const {characters} = useCharacters()
  const {player} = usePlayer()
  const {tutorial} = useTutorial()

  const newCharacterBtnFn = !player?.characterTokens ? async () => {
    // await showConfirm({
    //   isYesNo: false,
    //   message: `Complete tutorials, gain achievements, and level your player to earn more character tokens.`,
    //   title: 'Not Enough Character Tokens'
    // })
  } : () => {
    eventBus.emit({
      id: crypto.randomUUID(),
      type: 'world:mode:change',
      meta: {
        worldMode: 'character_create'
      }
    })
  }

  let showTutorialHint = false
  if(tutorial){
    if(tutorial.hints.some(h => h.uiPath === 'characters:manage')){
      showTutorialHint = true
    }
  }
  
  return <GamePanel
    currentScreenName=''
    title='Characters'
  >
    <div className='game-panel-section-actions'>
      <div className='game-panel-section-action'>
        <button className='button dark' onClick={newCharacterBtnFn}>
          New Character - {player?.characterTokens} Token(s)
        </button>
      </div>
    </div>
    {characters.map((c, idx) => {
      
      return <CharacterListItem 
        key={`character-${idx}`}
        showTutorial={showTutorialHint && idx === 0}  
        entity={c} 
        onClick={(entity) => {
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'character:manage',
            meta: {
              characterId: entity.id
            }
          })
          eventBus.emit({
            id: crypto.randomUUID(),
            type: 'world:mode:change',
            meta: {
              worldMode: 'character_manage'
            }
          })
        }} 
      />
    })}
  </GamePanel>
}
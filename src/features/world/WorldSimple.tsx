import Actions from '../../core/components/form/Actions'
import { clockRuntimeService } from '../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../engine/events/EventBus'
import { useCharacterEvents } from '../../engine/events/hooks/characters/useCharacterEvents'
import { useCharacters } from '../../engine/events/hooks/characters/useCharacters'
import { useGuilds } from '../../engine/events/hooks/guild/useGuilds'
import { useWorldModeEvents } from '../../engine/events/hooks/useWorldModeEvents'
import CharacterCreate from '../character/create/CharacterCreate'

export default function WorldSimple() {

  const {
    worldModeMain,
    worldModeOverlay,
    transitionOnCompleteMode,
    transitionText
  } = useWorldModeEvents()
  const {
    characters
  } = useCharacters()
  const {
    guilds
  } = useGuilds()
  
  const hasCharacters = characters.length > 0
  const hasGuild = guilds.length > 0

  let hint = ''
  if(!hasCharacters){
    hint = 'Summon your first character!'
  } else if(!hasGuild){
    hint = 'Register your first guild!'
  }


  return (
    <div>
      <div>
        Quester's Run
      </div>
      <div>
        <div>
          C: {characters.length}
        </div>
        <div>
          G: {guilds.length}
        </div>
      </div>
      {hint && (
        <div>
          Hint: {hint}
        </div>
      )}
      <div>
        <Actions 
          actions={[
            {
              inactive: false,
              onClick: () => {
                if(confirm('Are you sure?')){
                  localStorage.clear()
                  location.reload()
                }    
              },
              text: 'Reset',
            }
          ]}
        />
        <Actions 
          actions={[
            {
              inactive: characters.length > 0 || (characters.length > 0 && guilds.length === 0),
              onClick: () => {
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'world:mode:main:change',
                  created: clockRuntimeService.getNow(),
                  meta: {
                    mode: 'character:create'
                  }
                })
              },
              text: 'Summon Character',
            },
            {
              inactive: guilds.length === 1 || characters.length === 0 ,
              onClick: () => {

              },
              text: 'Register Guild',
            }
          ]}
        />
      </div>
      
      <div>
        {worldModeMain === 'character:create' && (
          <CharacterCreate />
        )}
      </div>
    </div>
  )
}
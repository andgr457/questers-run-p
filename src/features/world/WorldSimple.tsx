import Actions from '../../core/components/form/Actions'
import HeaderFancy from '../../core/components/header/fancy/HeaderFancy'
import Hint from '../../core/components/hint/Hint'
import { clockRuntimeService } from '../../engine/clock/ClockRuntimeService'
import { eventBus } from '../../engine/events/EventBus'
import { useCharacterEvents } from '../../engine/events/hooks/characters/useCharacterEvents'
import { useCharacters } from '../../engine/events/hooks/characters/useCharacters'
import { useGuilds } from '../../engine/events/hooks/guild/useGuilds'
import { useWorldModeEvents } from '../../engine/events/hooks/useWorldModeEvents'
import CharacterCreate from '../character/create/CharacterCreate'
import GuildCreate from '../guild/create/GuildCreate'

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
      <HeaderFancy 
        text={`Quester's Run`}
      />
      {hint && (
        <Hint text={hint} />
      )}
      <div>
        <Actions 
          actions={[
            {
              inactive: characters.length === 0 || guilds.length === 0,
              onClick: () => {
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'world:mode:main:change',
                  created: clockRuntimeService.getNow(),
                  meta: {
                    mode: 'none'
                  }
                })
              },
              text: 'Guild',
            },
            {
              inactive: false,
              onClick: () => {
                if(confirm('This will RESET ALL DATA! Are you sure?')){
                  localStorage.clear()
                  location.reload()
                }    
              },
              text: 'Settings',
            },
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
                eventBus.emit({
                  id: crypto.randomUUID(),
                  type: 'world:mode:main:change',
                  created: clockRuntimeService.getNow(),
                  meta: {
                    mode: 'guild:create'
                  }
                })
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
        {worldModeMain === 'guild:create' && (
          <GuildCreate 
            characters={characters}
          />
        )}
      </div>
    </div>
  )
}
import Actions, { type ActionDetail } from '../../core/components/form/Actions'
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
import GuildHall from '../guild/hall/GuildHall'
import Settings from '../settings/Settings'
import { WORLD_ACTION_GUILD_HALL, WORLD_ACTION_REGISTER_GUILD, WORLD_ACTION_SETTINGS, WORLD_ACTION_SUMMON_CHARACTER } from './actions/WorldActions'

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

  const actions: ActionDetail[] = []
  if(!hasCharacters){
    actions.push(WORLD_ACTION_SUMMON_CHARACTER)
  } else if(!hasGuild){
    actions.push(WORLD_ACTION_REGISTER_GUILD)
  } else {
    actions.push(WORLD_ACTION_GUILD_HALL)
    actions.push(WORLD_ACTION_SETTINGS)
  }

  //setting main character for now
  const mainCharacter = characters.find(c => c.guildId.length > 0)
  //setting main guild for now
  const mainGuild = guilds.find(g => g.id === mainCharacter?.guildId)

  return (
    <div>
      <HeaderFancy 
        text={`Quester's Run`}
        type='main'
      />
      {hint && (
        <Hint text={hint} />
      )}
      <div>
        <Actions 
          actions={actions}
        />
      </div>
      
      <div>
        {worldModeMain === 'settings' && (
          <Settings />
        )}
        {worldModeMain === 'character:create' && (
          <CharacterCreate />
        )}
        {worldModeMain === 'guild:create' && (
          <GuildCreate 
            characters={characters}
          />
        )}
        {worldModeMain === 'guild:hall' && (
          <GuildHall guildId={mainGuild?.id ?? ''} />
        )}
      </div>
    </div>
  )
}
import styles from './World.module.css'
import Actions, { type ActionDetail } from '../../core/components/form/Actions'
import HeaderFancy from '../../core/components/header/fancy/HeaderFancy'
import Hint from '../../core/components/hint/Hint'
import { useCharacters } from '../../engine/events/hooks/characters/useCharacters'
import { useGuilds } from '../../engine/events/hooks/guild/useGuilds'
import { useWorldContextEvents } from '../../engine/events/hooks/useWorldContextEvents'
import { useWorldModeEvents } from '../../engine/events/hooks/useWorldModeEvents'
import CharacterCreate from '../character/create/CharacterCreate'
import GuildCreate from '../guild/create/GuildCreate'
import GuildHall from '../guild/hall/GuildHall'
import GuildList from '../guild/list/GuildList'
import Settings from '../settings/Settings'
import { WORLD_ACTION_CHARACTER_DETAIL, WORLD_ACTION_CHARACTER_LIST, WORLD_ACTION_CHARACTER_UPGRADES, WORLD_ACTION_SUMMON_CHARACTER } from './actions/data/WorldCharacterActions.data'
import { WORLD_ACTION_GUILD_HALL, WORLD_ACTION_GUILD_LIST, WORLD_ACTION_GUILD_UPGRADES, WORLD_ACTION_REGISTER_GUILD } from './actions/data/WorldGuildActions.data'
import { WORLD_ACTION_NONE } from './actions/data/WorldActions.data'
import { WORLD_ACTION_SETTINGS } from './actions/data/WorldSettingsActions.data'
import { WORLD_ACTION_TOWN_HALL } from './actions/data/WorldTownActions.data'

export default function WorldSimple() {

  const {
    worldModeMain,
    worldModeOverlay,
    transitionOnCompleteMode,
    transitionText
  } = useWorldModeEvents()
  const {
    worldContext
  } = useWorldContextEvents()
  const {
    characters
  } = useCharacters()
  const {
    guilds
  } = useGuilds()
  
  const hasCharacters = characters.length > 0
  const hasGuild = guilds.length > 0

  function buildAction(actionProps: {
    detail: ActionDetail,
    inactive?: boolean
  }): ActionDetail {
    return {
      ...actionProps.detail,
      selected: actionProps.detail.mode === worldModeMain,
      inactive: actionProps.inactive ?? false
    }
  }

  let hint = ''
  if(!hasCharacters){
    hint = 'Summon your first character!'
  } else if(!hasGuild){
    hint = 'Register your first guild!'
  }

  const actions: ActionDetail[] = []
  if(!hasCharacters){
    actions.push(buildAction({
      detail: WORLD_ACTION_SUMMON_CHARACTER
    }))
  } else if(!hasGuild){
    actions.push(buildAction({
      detail: WORLD_ACTION_REGISTER_GUILD
    }))
  } else {
    actions.push(buildAction({
      detail: WORLD_ACTION_NONE
    }))
    if(worldModeMain.includes('guild:')){
      //guild row
      actions.push(buildAction({
        detail: WORLD_ACTION_GUILD_LIST
      }))
      actions.push(buildAction({
        detail: WORLD_ACTION_GUILD_HALL,
        inactive: !worldContext.guildId
      }))
      actions.push(buildAction({
        detail: WORLD_ACTION_GUILD_UPGRADES,
        inactive: !worldContext.guildId
      }))  
    } else if(worldModeMain.includes('character:')){
      //character/adv row
      actions.push(buildAction({
        detail: WORLD_ACTION_CHARACTER_LIST
      }))
      
      actions.push(buildAction({
        detail: WORLD_ACTION_CHARACTER_DETAIL,
        inactive: !worldContext.characterId
      }))
      
      actions.push(buildAction({
        detail: WORLD_ACTION_CHARACTER_UPGRADES,
        inactive: !worldContext.characterId
      }))
    } else {
      actions.push(buildAction({
        detail: WORLD_ACTION_TOWN_HALL
      }))
      actions.push(buildAction({
        detail: WORLD_ACTION_SETTINGS
      }))
      actions.push(buildAction({
        detail: WORLD_ACTION_GUILD_LIST
      }))
      actions.push(buildAction({
        detail: WORLD_ACTION_GUILD_HALL,
        inactive: !worldContext.guildId
      }))
      actions.push(buildAction({
        detail: WORLD_ACTION_GUILD_UPGRADES,
        inactive: !worldContext.guildId
      }))  
      //character/adv row
      actions.push(buildAction({
        detail: WORLD_ACTION_CHARACTER_LIST
      }))
      
      actions.push(buildAction({
        detail: WORLD_ACTION_CHARACTER_DETAIL,
        inactive: !worldContext.characterId
      }))
      
      actions.push(buildAction({
        detail: WORLD_ACTION_CHARACTER_UPGRADES,
        inactive: !worldContext.characterId
      }))
    }
  }

  return (
    <div className={styles.world}>
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
          <GuildHall guildId={worldContext.guildId ?? ''} />
        )}
        {worldModeMain === 'guild:list' && (
          <GuildList />
        )}
      </div>
    </div>
  )
}
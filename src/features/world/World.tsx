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
import { WORLD_ACTION_TAVERN_HALL } from './actions/data/WorldTavernActions.data'
import Collapse from '../../core/components/collapse/Collapse'
import { useState } from 'react'

export default function World() {
  const [navCollapsed, setNavCollapsed] = useState(true)
  const {
    worldModeMain,
    // worldModeOverlay,
    // transitionOnCompleteMode,
    // transitionText
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

  const contextGuild = guilds.find(g => g.id === worldContext.guildId)
  const contextCharacter = characters.find(c => c.id === worldContext.characterId)

  function buildAction(actionProps: {
    detail: ActionDetail,
    inactive?: boolean,
    text?: string,
  }): ActionDetail {
    return {
      ...actionProps.detail,
      selected: actionProps.detail.mode === worldModeMain,
      inactive: actionProps.inactive ?? false,
      text: actionProps.text ?? actionProps.detail.text,
      onClick: () => {
        setNavCollapsed(true)
        actionProps.detail.onClick()
      }
    }
  }

  let hint = ''
  if(!hasCharacters){
    hint = 'Summon your first character!'
  } else if(!hasGuild){
    hint = 'Register your first guild!'
  } else {
    hint = 'Quest with guild members to level them, and the guild, up by gaining XP, gold, and loot!'
  }

  const actions: ActionDetail[] = []
  const contextActions: ActionDetail[] = []

  if(!hasCharacters){
    actions.push(buildAction({
      detail: WORLD_ACTION_SUMMON_CHARACTER
    }))
  } else if(!hasGuild){
    actions.push(buildAction({
      detail: WORLD_ACTION_REGISTER_GUILD
    }))
  } else {
    contextActions.push(buildAction({
      detail: WORLD_ACTION_GUILD_HALL,
      inactive: !contextGuild,
      text: `${!contextGuild ? 'Guild Hall' : `${contextGuild.title} Hall`}`
    }))
    contextActions.push(buildAction({
      detail: WORLD_ACTION_CHARACTER_DETAIL,
      inactive: !worldContext.characterId,
      text: `${!contextCharacter ? 'Character Detail' : `${contextCharacter.title} Detail`}`
    }))
    actions.push(buildAction({
      detail: WORLD_ACTION_NONE
    }))
    actions.push(buildAction({
      detail: WORLD_ACTION_TOWN_HALL
    }))
    actions.push(buildAction({
      detail: WORLD_ACTION_TAVERN_HALL
    }))

    actions.push(buildAction({
      detail: WORLD_ACTION_GUILD_LIST
    }))
    
    //character/adv row
    actions.push(buildAction({
      detail: WORLD_ACTION_CHARACTER_LIST
    }))

    actions.push(buildAction({
      detail: WORLD_ACTION_SETTINGS
    }))
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
      <Collapse
        title='='
        collapsed={navCollapsed}
        setCollapsed={setNavCollapsed}
      >
        <Actions 
          actions={actions}
        />
      </Collapse>
      <div>
        <Actions
          actions={contextActions}
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
        {worldModeMain === 'guild:hall' && contextGuild && (
          <GuildHall guild={contextGuild} members={characters.filter(c => c.guildId === contextGuild.id)} />
        )}
        {worldModeMain === 'guild:list' && (
          <GuildList />
        )}
      </div>
    </div>
  )
}
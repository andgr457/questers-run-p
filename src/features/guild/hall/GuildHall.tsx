import { useState } from 'react';
import FeatureBody from '../../../core/components/feature/components/body/FeatureBody';
import FeatureHeader from '../../../core/components/feature/components/header/FeatureHeader';
import Gold from '../../../core/components/gold/Gold';
import ProgressBar from '../../../core/components/progress-bar/ProgressBar';
import { formatPrimitiveValueToString } from '../../../core/utils/Formatting.utils';
import styles from './GuildHall.module.css'
import GuildMemberList from './members/GuildMemberList';
import type { Guild } from '../../../interfaces/Guild.types';
import type { Character } from '../../../interfaces/Character.types';
import type { ActionDetail } from '../../../core/components/form/Actions';
import Actions from '../../../core/components/form/Actions';
import Collapse from '../../../core/components/collapse/Collapse';
import GuildHallGuildDetail from './detail/GuildHallGuildDetail';

interface Props {
  guild: Guild
  members: Character[]
}

export default function GuildHall(props: Props) {
  const {
    guild,
    members
  } = props
  const [guildHallMode, setGuildHallMode] = useState('')
  
  const guildMaster = members.find(gms => gms.guildRole === 'guild_master')

  const actions: ActionDetail[] = [
    {
      id: 'guild_hall_action_members_list',
      inactive: false,
      onClick: () => {
        setGuildHallMode(guildHallMode === 'members' ? '' : 'members')
      },
      text: `Members`,
      selected: guildHallMode === 'members'
    },
    {
      id: 'guild_hall_action_upgrades_list',
      inactive: false,
      onClick: () => {
        setGuildHallMode(guildHallMode === 'upgrades' ? '' : 'upgrades')
      },
      text: `Upgrades`,
      selected: guildHallMode === 'upgrades'
    },
  ]


  if(!guild || !members || !guildMaster) return null

  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Guild Hall'}
        type='sub'
      />

      <GuildHallGuildDetail 
        guild={guild}
        guildMaster={guildMaster}
        members={members}
      />

      <Actions 
        actions={actions}
      />
      
      {guildHallMode === 'members' && (
        <GuildMemberList 
          members={members} 
          guildMaster={guildMaster}
        />
      )}
    </div>
  )
}
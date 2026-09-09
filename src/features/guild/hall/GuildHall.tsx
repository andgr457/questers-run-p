import { useState } from 'react';
import FeatureBody from '../../../core/components/feature/components/body/FeatureBody';
import FeatureHeader from '../../../core/components/feature/components/header/FeatureHeader';
import Actions from '../../../core/components/form/Actions';
import Gold from '../../../core/components/gold/Gold';
import HeaderFancy from '../../../core/components/header/fancy/HeaderFancy';
import ProgressBar from '../../../core/components/progress-bar/ProgressBar';
import { formatPrimitiveValueToString } from '../../../core/utils/Formatting.utils';
import { useCharacters } from '../../../engine/events/hooks/characters/useCharacters';
import { useGuild } from '../../../engine/events/hooks/guild/useGuild';
import { GUILD_MEMBER_ROLES } from '../../../interfaces/GuildRole.types';
import styles from './GuildHall.module.css'
import GuildMemberList from './members/GuildMemberList';

interface Props {
  guildId: string
}

export default function GuildHall(props: Props) {
  const {
    guildId
  } = props
  const {
    guild
  } = useGuild({
    guildId
  })
  const {
    characters
  } = useCharacters()
  const [guildHallMode, setGuildHallMode] = useState('members')
  
  const guildMembers = characters.filter(c => c.guildId === guildId)
  const guildMaster = guildMembers.find(gms => gms.guildRole === 'guild_master')

  if(!guild || !guildMembers || !guildMaster) return null

  return (
    <div 
      className={styles.wrapper}
    >
      <FeatureHeader
        text={'Guild Hall'}
        type='sub'
      />

      <FeatureBody>
        <div className='section'>
          <div className={styles.header}>
            <div className={styles.title}>
              {guild.title}
            </div>
            <div>
              Lv. {guild.level}
            </div>
            <div>
              {formatPrimitiveValueToString(guild.xp.value)}/{guild.xp.valueMax} XP
            </div>
            <div>
              <Gold value={guild.gold} />
            </div>
          </div>
          <div>
            <ProgressBar 
              color='purple'
              max={guild.xp.valueMax}
              value={guild.xp.value}
            />
          </div>
          <div className={styles.guildMaster}>
            Guild Master {guildMaster.title}
          </div>
        </div>
      </FeatureBody>
      {guildHallMode === 'members' && (
        <GuildMemberList members={guildMembers} />
      )}
    </div>
  )
}
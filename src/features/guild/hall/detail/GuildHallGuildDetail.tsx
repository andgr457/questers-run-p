import styles from './GuildHallGuildDetail.module.css'
import type { Guild } from '../../../../interfaces/Guild.types'
import { formatPrimitiveValueToString } from '../../../../core/utils/Formatting.utils'
import Gold from '../../../../core/components/gold/Gold'
import ProgressBar from '../../../../core/components/progress-bar/ProgressBar'
import type { Character } from '../../../../interfaces/Character.types'

interface Props {
  guild: Guild
  members: Character[]
  guildMaster: Character
}

export default function GuildHallGuildDetail(props: Props){
  const {
    guild,
    members,
    guildMaster
  } = props
  return (
    <div
      className={`section`}
    >
      <div className={styles.header}>
        <div className={styles.title}>
          {guild.title}
        </div>
        <div>
          Lv. {guild.level}
        </div>

        <div>
          <Gold value={guild.gold} />
        </div>
      </div>

      <div className={styles.header2}>
        <div >
          Guild Master {guildMaster.title}
        </div>
        <div >
          Members: {formatPrimitiveValueToString(members.length)}
        </div>
        <div>
          Upgrades: 0
        </div>
      </div>

      <div className={styles.progress}>
        <ProgressBar 
          color='purple'
          max={guild.xp.valueMax}
          value={guild.xp.value}
          label='XP'
        />
      </div>
    </div>
  )
}
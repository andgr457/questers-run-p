import styles from './GuildList.module.css'
import { useCharacters } from '../../../engine/events/hooks/characters/useCharacters'
import { useGuilds } from '../../../engine/events/hooks/guild/useGuilds'
import type { Character } from '../../../interfaces/Character.types'
import FeatureHeader from '../../../core/components/feature/components/header/FeatureHeader'
import GuildListItem from './GuildListItem'

export default function GuildList(){
  const {
    guilds
  } = useGuilds()
  const {
    characters
  } = useCharacters()

  const guildCharacterMap: Record<string, Character[]> = {}
  if(guilds && characters){
    for(const guild of guilds){
      if(!guildCharacterMap[guild.id]){
        guildCharacterMap[guild.id] = []
      }
      guildCharacterMap[guild.id].push(
        ...characters.filter(c => c.guildId === guild.id)
      )
    }
  }

  if(!guilds) return null
  if(!characters) return null

  return (
    <div className={styles.wrapper}>
      <FeatureHeader
        text={'Guilds'}
        type='sub'
      />

      {guilds.map(g => {
        const members = guildCharacterMap[g.id]
        return <GuildListItem 
          guild={g}
          membersAmount={members.length}
        />
      })}
    </div>
  )
}
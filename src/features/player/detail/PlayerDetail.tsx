import styles from './PlayerDetail.module.css'
import type { Player } from '../../../entities/player/Player.types'
import { DateTime } from 'luxon'

interface Props {
  player: Player
}

export default function PlayerDetail(props: Props){
  const {
    player
  } = props


  if(!player) return (
    <></>
  )

  return (
    <div
      className={styles.wrapper}
    >
      
      <div
        className={styles.header}
      >
        <div
          className={styles.name}
        >
          {player.name}
        </div>

        <div>
          Lv. {player.level}
        </div>
      </div>

      <div>
        <div>
          Health: {player.health.value} / {player.health.max}
        </div>

        <div>
          Mana: {player.mana.value} / {player.mana.max}
        </div>

        <div>
          Stamina: {player.stamina.value} / {player.stamina.max}
        </div>
      </div>

      <div>
        <div>
          Strength: {player.strength}
        </div>
        <div>
          Intelligence: {player.intelligence}
        </div>
        <div>
          Agility: {player.agility}
        </div>
      </div>

      <div>
        <div>
          Created: {DateTime.fromMillis(player.dateCreated).toLocaleString(DateTime.DATETIME_MED)}
        </div>
        <div>
          Last Save: {DateTime.fromMillis(player.dateSaved).toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
        </div>
      </div>

    </div>
  )
}
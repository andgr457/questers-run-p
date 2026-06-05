import { useNavigate } from 'react-router-dom'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import {
  GuildRankByLevel,
  GuildRankLevelByRank,
  type Character,
} from '../../interfaces/characters/Character.types'
import type { Mob } from '../../interfaces/mobs/Mob.types'
import StateOverlay from '../state-overlay/StateOverlay'
import { useMemo } from 'react'
import { useActivityLock } from '../../features/runtime/activity/useActivityLock'

interface HuntingMobProps extends AppProperties {
  huntingMob: Mob
  canDo: boolean
  handleHuntMobClicked: (mob: Mob, char: Character) => Promise<void>
}

export default function HuntingMob(props: HuntingMobProps) {
  const {
    character,
    canDo,
    allQuestProgress,
    characterMobProgress,
    huntingMob,
    handleHuntMobClicked,
    items,
    showConfirm,
    quests,
  } = props

  const navigate = useNavigate()

  // ✅ SAFE: prevent undefined crashes + stable dependency
  const characterId = character?.id

  const locked = useActivityLock(characterId)

  const clickFn = useMemo(() => {
    if (!canDo || locked || !character) return undefined

    return async () => {
      await handleHuntMobClicked(huntingMob, character)
    }
  }, [canDo, locked, character, huntingMob, handleHuntMobClicked])

  // =========================
  // GUILD RANK LOCK CHECK
  // =========================
  let lockReason: string | null = null

  if (
    character?.guildRank &&
    typeof huntingMob.guildRankLevel === 'number'
  ) {
    const charRankLevel =
      GuildRankLevelByRank[character.guildRank]

    //@ts-ignore
    const mobRank = GuildRankByLevel[huntingMob.guildRankLevel]

    if (charRankLevel < huntingMob.guildRankLevel) {
      lockReason = `Guild Rank ${mobRank} Required`
    }
  }

  // =========================
  // QUEST REQUIREMENT
  // =========================
  const inProgressQuestProgress =
    allQuestProgress?.find(
      aqp =>
        aqp.characterId === character?.id &&
        aqp.status === 'in-progress'
    )

  const relatedInProgressQuest =
    quests?.find(
      q => q.id === inProgressQuestProgress?.questId
    )

  const relatedQuest =
    relatedInProgressQuest?.completionRequirements?.find(
      req => req.mobId === huntingMob.id
    )

  const questRelatedMobProgress =
    characterMobProgress?.filter(
      mp =>
        mp.mobId === huntingMob.id &&
        mp.questProgressId ===
          inProgressQuestProgress?.id
    )

  // =========================
  // CONTENT
  // =========================
  const content = (
    <div
      id={huntingMob.id}
      className="shoppe-item open"
    >
      <div className="shoppe-item-name">
        {huntingMob.name}
      </div>

      <div className="shoppe-item-description">
        {huntingMob.description}
      </div>

      {relatedQuest && (
        <div
          className="shoppe-item-info-list"
          style={{ justifyContent: 'center' }}
        >
          <div
            className="shoppe-item-info small"
            onClick={async () => {
              if (
                await showConfirm({
                  isYesNo: true,
                  title: 'Head Back?',
                  message:
                    'Head back to the adventurers guild?',
                })
              ) {
                navigate(
                  `/town/adventurers-guild#${inProgressQuestProgress?.questId}`
                )
              }
            }}
          >
            <div>
              <span
                style={{
                  color:
                    'var(--blue-sd-lighter-2)',
                }}
              >
                {Math.min(
                  questRelatedMobProgress?.length ??
                    0,
                  relatedQuest.mobAmount as number
                )}
              </span>{' '}
              / {relatedQuest.mobAmount}
            </div>
            <div>Quest Progress</div>
          </div>
        </div>
      )}

      <div
        className="shoppe-item-info-list"
        style={{ justifyContent: 'center' }}
      >
        <div className="shoppe-item-info small">
          <div>Lv.</div>
          <div style={{ color: 'gold' }}>
            {huntingMob.level}
          </div>
        </div>

        <div className="shoppe-item-info small">
          <div>
            <span style={{ color: 'gold' }}>
              +{huntingMob.xp}
            </span>
          </div>
          <div>XP</div>
        </div>

        <div className="shoppe-item-info small">
          <div
            style={{
              textTransform: 'capitalize',
              color: 'gold',
            }}
          >
            {huntingMob.location}
          </div>
        </div>
      </div>

      <div
        className="shoppe-item-description"
        style={{ color: 'gold' }}
      >
        LOOT
      </div>

      <div
        className="shoppe-item-info-list"
        style={{ justifyContent: 'center' }}
      >
        {huntingMob.loot?.map(lootItem => {
          const item = items?.find(
            i => i.id === lootItem.itemId
          )

          return (
            <div
              className="shoppe-item-info small"
              title={`${lootItem.chance * 100}% chance to drop when defeated.`}
            >
              <div>{item?.name}</div>
              <div style={{ color: 'gold' }}>
                x{lootItem.itemAmount}
              </div>
              <div>
                <span
                  style={{
                    color: 'gold',
                    fontSize: 'smaller',
                  }}
                >
                  {lootItem.chance * 100}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="shoppe-item-bottom">
        <div
          className={`shoppe-item-info ${
            locked ? 'zero' : 'add'
          }`}
          onClick={clickFn}
        >
          HUNT
        </div>
      </div>
    </div>
  )

  // =========================
  // FINAL RENDER
  // =========================
  return (
    <StateOverlay
      active={!!locked || !canDo}
      text="LOCKED"
      subText={
        lockReason ??
        `Hunting "${huntingMob.name}"`
      }
    >
      {content}
    </StateOverlay>
  )
}
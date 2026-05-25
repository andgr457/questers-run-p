import { useCallback, useEffect, useState } from 'react'
import { GuildRanks, type Character } from '../../interfaces/characters/Character.types'
import { DateTime } from 'luxon'
import PageHeader from '../../components/PageHeader'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import CharacterQuests from '../../components/quests/CharacterQuests'
import AdventurersGuildClerk from '../../components/adventurers-guild/AdventurersGuildClerk'

import { ACHIEVEMENT_INTRO_ADVENTURERS_GUILD } from '../../data/achievements/Achievements.Intro.data'
import { sleep } from '../../services/CommonServices'

interface AdventurersGuildPageProps extends AppProperties {}

export default function AdventurersGuildPage(props: AdventurersGuildPageProps) {
  const {
    character,
    setLocation,
    handleSetCharacter,
    showConfirm,
    addNotification
  } = props

  useEffect(() => {
    setLocation?.("Adventurer's Guild")
  }, [])

  // -----------------------------
  // MODULE STATE (UNIFIED)
  // -----------------------------
  const [showModule, setShowModule] = useState<'' | 'quest-board' | 'clerk'>(character?.guildRank ? 'quest-board' : 'clerk')

  const [showOneTimeCompletedQuests, setShowOneTimeCompletedQuests] = useState(false)
  const [showIneligibleQuests, setShowIneligibleQuests] = useState(true)

  // -----------------------------
  // TUTORIAL (AGAIN FULLY GENERIC)
  // -----------------------------

  const characterJoined = character?.guildRank !== GuildRanks.None

  // -----------------------------
  // JOIN LOGIC
  // -----------------------------
  const handleJoinClicked = useCallback(async () => {
    const newCharacter: Character = { ...character } as Character

    newCharacter.guildRank = GuildRanks.F

    newCharacter.achievements = [
      ...(newCharacter.achievements ?? []),
      {
        achievementId: ACHIEVEMENT_INTRO_ADVENTURERS_GUILD.id,
        achievementDate: DateTime.utc().toISO()
      }
    ]
    handleSetCharacter?.({ ...newCharacter })

    await showConfirm({
      isYesNo: false,
      title: 'Welcome to the Guild!',
      message: `You are now officially a member of the Adventurer's Guild. Feel free to check out the quest board to get started!"`
    })

    await sleep(3000)
    addNotification?.(`Achievement Earned: ${ACHIEVEMENT_INTRO_ADVENTURERS_GUILD.title}`)
    setShowModule('quest-board')
  }, [character, handleSetCharacter])


  // -----------------------------
  // TUTORIAL OVERLAY
  // -----------------------------
  return (
    <div>

      <div className="page-main">
        <PageHeader showActions={true}>
          
          {/* CLERK */}
          <button
            className={`yellow${showModule === 'clerk' ? '-blink' : ''}`}
            onClick={() => setShowModule('clerk')}
          >
            Guild Clerk
          </button>

          {/* QUEST BOARD */}
          {characterJoined && (
            <button
              className={`yellow${showModule === 'quest-board' ? '-blink' : ''}`}
              onClick={() => setShowModule('quest-board')}
            >
              Quests
            </button>
          )}

          {/* TOGGLES */}
          {characterJoined && (
            <button
              className="basic"
              onClick={() =>
                setShowOneTimeCompletedQuests(v => !v)
              }
            >
              {showOneTimeCompletedQuests ? 'Hide' : 'Show'} 1-Time Completed Quests
            </button>
          )}

          {characterJoined && (
            <button
              className="basic"
              onClick={() =>
                setShowIneligibleQuests(v => !v)
              }
            >
              {showIneligibleQuests ? 'Hide' : 'Show'} Ineligible Quests
            </button>
          )}
        </PageHeader>

        {/* -----------------------------
            CLERK MODULE
        ----------------------------- */}
        {showModule === 'clerk' && (
          <AdventurersGuildClerk
            {...props}
            onJoin={handleJoinClicked}
          />
        )}

        {/* -----------------------------
            QUEST BOARD
        ----------------------------- */}
        {showModule === 'quest-board' && (
          <div>
            <div className="character-section-title">
              <div className="page-header-banner">
                <div className="page-header-title">
                  QUEST BOARD
                </div>
              </div>
            </div>

            <CharacterQuests
              {...props}
              showOneTimeCompletedQuests={showOneTimeCompletedQuests}
              showIneligibleQuests={showIneligibleQuests}
            />
          </div>
        )}
      </div>
    </div>
  )
}
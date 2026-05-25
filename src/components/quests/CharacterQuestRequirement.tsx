import { DateTime } from 'luxon'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { QuestCompletionRequirement } from '../../interfaces/quests/Quests.types'

interface CharacterQuestRequirementProps {
  req: QuestCompletionRequirement
  startDate?: string
  handleRefresh?: () => void
}

export default function CharacterQuestRequirement(
  props: CharacterQuestRequirementProps,
) {
  const {
    req,
    startDate,
    handleRefresh
  } = props

  const {
    completed,
    achievementId,
    achievementDescription,
    achievementTitle,
    itemAmount = 0,
    itemCharacterAmount = 0,
    itemDescription,
    itemId,
    itemName,
    itemProfessionType,
    mobAmount = 0,
    mobCharacterAmount = 0,
    mobDescription,
    mobId,
    mobLevel,
    mobName,
    mobLocationType,
    // timeHours,
    // timeLeftHours = 0,
    // timeLeftMinutes = 0,
    // timeLeftSeconds = 0,
    timeMinutes,
    // timeSeconds,
  } = req

  const navigate = useNavigate()

  const [now, setNow] = useState(Date.now())
  const endTime =
  startDate && timeMinutes
    ? DateTime.fromISO(startDate, { zone: 'utc' })
        .plus({ minutes: timeMinutes })
        .toMillis()
    : null
  const isExpired = endTime ? now >= endTime : false
  let isActiveTimer =
    !completed &&
    !!timeMinutes &&
    !!startDate &&
    !isExpired
  const prevActiveRef = useRef(isActiveTimer)
  useEffect(() => {
    const wasActive = prevActiveRef.current

    if (wasActive && !isActiveTimer) {
      // timer just turned off
      ;(async () => {
        await handleRefresh?.()
      })()
    }

    prevActiveRef.current = isActiveTimer
  }, [isActiveTimer, handleRefresh])
  useEffect(() => {
    if (!isActiveTimer) return

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 250)

    return () => clearInterval(interval)
  }, [isActiveTimer])

  let progressInfo = ''
  let progressPercent = 0

  // TIMER PROGRESS
  if (typeof timeMinutes === 'number' && startDate) {
    const startMillis = DateTime.fromISO(startDate).toMillis()
    const totalMillis = timeMinutes * 60 * 1000
    const elapsedMillis = now - startMillis

    const elapsedMinutes = elapsedMillis / 1000 / 60
    const leftMinutes = Math.max(0, timeMinutes - elapsedMinutes)
    const leftSeconds = leftMinutes / 60
    progressPercent = Math.min(
      100,
      (elapsedMillis / totalMillis) * 100,
    )

    if (leftMinutes > 0) {
      progressInfo = `| ${leftMinutes.toFixed(1)}min ${leftSeconds.toFixed(1)}sec remaining...`
    }
  }

  // ITEM PROGRESS
  if (itemId && itemAmount > 0) {
    progressInfo = ''
    progressPercent = Math.min(
      100,
      (itemCharacterAmount / itemAmount) * 100,
    )
  }

  // MOB PROGRESS
  if (mobId && mobAmount > 0) {
    progressInfo = ''
    progressPercent = Math.min(
      100,
      (mobCharacterAmount / mobAmount) * 100,
    )
  }

  const professionClickFn = itemProfessionType
    ? () => navigate(`/profession/${itemProfessionType}#${itemId}`)
    : () => {}

  const mobClickFn = mobLocationType
    ? () => navigate(`/hunting/${mobLocationType}#${mobId}`)
    : () => {}

  const checkOrX = completed ? '✔' : '✘'

  return (
    <div
      className={
        completed
          ? 'quest-item-requirements-item completed'
          : 'quest-item-requirements-item'
      }
    >
      <div>
        {/* TIMER */}
        {typeof timeMinutes === 'number' && 
        (
          <>
            {checkOrX}{' '}
            <strong>{timeMinutes}</strong> minute(s)
            {' '}
            Long {progressInfo}
          </>
        )}

        {/* ACHIEVEMENT */}
        {achievementId && (
          <div title={achievementDescription}>
            {checkOrX} Achievement:{' '}
            <strong>{achievementTitle}</strong>
          </div>
        )}

        {/* ITEM */}
        {itemId && typeof itemAmount === 'number' && (
          <div title={itemDescription} className="quest-completion-req">
            <div>{checkOrX}</div>
            <div className="quest-completion-req-amounts">
              {itemCharacterAmount} / {itemAmount}
            </div>
            <div className="quest-completion-req-name">
              {itemName}
            </div>
            <div className="quest-completion-req-nav-btn">
              <button
                className="basic"
                onClick={professionClickFn}
              >
                {itemProfessionType}
              </button>
            </div>
          </div>
        )}

        {/* MOB */}
        {mobId && typeof mobAmount === 'number' && (
          <div title={mobDescription} className="quest-completion-req">
            <div>{checkOrX}</div>
            <div className="quest-completion-req-amounts">
              {mobCharacterAmount} / {mobAmount}
            </div>
            <div className="quest-completion-req-name">
              {mobName} Lv. {mobLevel}
            </div>
            <div
              className="quest-completion-req-nav-btn"
            >
              <button
                className="basic"
                onClick={mobClickFn}
              >
                {mobLocationType}
              </button>
            </div>
          </div>
        )}

        {/* PROGRESS BAR (ONLY ACTIVE TIMER) */}
        {isActiveTimer && (
          <div className="character-stat-card-bar attribute-bar">
            <div
              className="character-stat-card-fill attribute-fill"
              style={{
                width: `${progressPercent}%`,
                transition: 'width 0.2s linear',
              }}
            />
          </div>
        )}

        {/* ITEM / MOB BAR (STATIC PROGRESS) */}
        {!isActiveTimer &&
          !completed &&
          (itemId || mobId) && (
            <div className="character-stat-card-bar attribute-bar">
              <div
                className="character-stat-card-fill attribute-fill"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          )}
      </div>
    </div>
  )
}
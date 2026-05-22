import { useMemo, useState } from 'react'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import './Achievements.css'

interface AchievementsListProps extends AppProperties {}

export default function AchievementsList(props: AchievementsListProps) {
  const {
    achievements = [],
    character
  } = props

  const [search, setSearch] = useState('')

  const filteredAchievements = useMemo(() => {
    const value = search.toLowerCase().trim()

    const characterAchievements = character?.achievements ?? []

    const mapped = achievements.map(achievement => {
      const unlocked = characterAchievements.find(
        ca => ca.achievementId === achievement.id
      )

      return {
        ...achievement,
        unlocked
      }
    })

    const filtered = mapped.filter(achievement => {
      if (!value) return true

      return (
        achievement.title.toLowerCase().includes(value) ||
        achievement.description.toLowerCase().includes(value)
      )
    })

    return filtered.sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1
      if (!a.unlocked && b.unlocked) return 1
      return a.title.localeCompare(b.title)
    })
  }, [achievements, character?.achievements, search])

  return (
    <div className='achievements'>
      <div className='achievements__header'>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='Search achievements...'
          className='achievements__search'
        />
      </div>

      <div className='achievements__list'>
        {filteredAchievements.length <= 0 ? (
          <div className='achievements__empty'>
            No achievements found.
          </div>
        ) : (
          filteredAchievements.map(achievement => {
            const unlocked = !!achievement.unlocked

            return (
              <div
                key={achievement.id}
                className={`achievement-card ${unlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}
              >
                <div className='achievement-card__icon'>
                  {unlocked ? '🏆' : '🔒'}
                </div>

                <div className='achievement-card__content'>
                  <div className='achievement-card__top'>
                    <h3 className='achievement-card__title'>
                      {achievement.title}
                    </h3>

                    <span className='achievement-card__badge'>
                      {unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>

                  <p className='achievement-card__description'>
                    {achievement.description}
                  </p>

                  {achievement.unlocked && (
                    <div className='achievement-card__date'>
                      Unlocked on{' '}
                      {new Date(
                        achievement.unlocked.achievementDate
                      ).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
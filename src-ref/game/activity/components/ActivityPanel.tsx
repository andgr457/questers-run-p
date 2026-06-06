import { useActivities } from '../../engine/activity/hooks/useActivities'
import { gameClockService } from '../../engine/clock/GameClockService'
import { activityRuntimeService } from '../../engine/activity/activityRuntimeService'

type Props = {
  characterId: string
}

export default function ActivityPanel({
  characterId,
}: Props) {
  const activities = useActivities(characterId)

  if (activities.length === 0) {
    return (
      <div className="activity-panel">
        <h3>Activities</h3>
        <p>No active activities.</p>
      </div>
    )
  }

  return (
    <div className="activity-panel">
      <h3>Activities</h3>

      {activities.map(activity => {
        const progress =
          activityRuntimeService.getProgress(
            characterId,
            activity.id,
            gameClockService.getNow()
          )

        return (
          <div
            key={activity.id}
            className="activity-card"
          >
            <div>
              <strong>{activity.type}</strong>
            </div>

            <div>Status: {activity.status}</div>

            <div
              style={{
                width: '100%',
                height: 10,
                background: '#222',
                borderRadius: 4,
                overflow: 'hidden',
                marginTop: 6,
              }}
            >
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  background: '#5fd37a',
                  transition: 'width 0.2s linear',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
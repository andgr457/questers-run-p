import type { ActivityEntry } from '../types'
import { useActivityProgress } from '../hooks/useActivityProgress'
import ProgressBar from '../../../ui/progress-bar/ProgressBar'

type Props = {
  activity: ActivityEntry
}

export default function ActivityCard({ activity }: Props) {
  const progress = useActivityProgress(
    activity.characterId,
    activity.id
  )

  return (
    <div style={{
      padding: 12,
      border: '1px solid #333',
      borderRadius: 6,
      marginBottom: 8
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{activity.type}</strong>

        <span>{activity.status}</span>
      </div>

      <ProgressBar value={progress.progress} />

      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
        {Math.ceil(progress.remainingMs / 1000)}s remaining
      </div>

      {progress.isComplete && (
        <div style={{ color: '#4ade80', marginTop: 4 }}>
          Completed
        </div>
      )}
    </div>
  )
}
import { DateTime } from 'luxon'

interface QuestMetaProps {
  startDate?: string
  endDate?: string
  repeatable?: boolean
  completed?: boolean
}

export default function QuestMeta({
  startDate,
  endDate,
  repeatable,
  completed,
}: QuestMetaProps) {
  return (
    <>
      {startDate && (
        <div className="quest-item-date">
          <div>
            Started on{' '}
            {DateTime.fromISO(startDate)
              .toLocal()
              .toLocaleString(
                DateTime.DATETIME_SHORT_WITH_SECONDS,
              )}
          </div>
        </div>
      )}

      {!repeatable && completed && endDate && (
        <div className="quest-item-date">
          <div>
            Completed on{' '}
            {DateTime.fromISO(endDate)
              .toLocal()
              .toLocaleString(
                DateTime.DATETIME_SHORT_WITH_SECONDS,
              )}
          </div>
        </div>
      )}
    </>
  )
}
interface QuestActionsProps {
  loading: boolean

  canTakeQuest: boolean
  canCompleteQuest: boolean

  inProgress: boolean

  statusContent?: string

  onTake: () => Promise<void>
  onAbandon: () => Promise<void>
  onComplete: () => Promise<void>
}

export default function QuestActions(
  props: QuestActionsProps,
) {
  const {
    loading,
    canTakeQuest,
    canCompleteQuest,
    inProgress,
    statusContent,
    onTake,
    onAbandon,
    onComplete,
  } = props

  return (
    <div className="quest-actions">
      {canTakeQuest && (
        <button
          className="success"
          disabled={loading}
          onClick={onTake}
        >
          Take
        </button>
      )}

      {inProgress && (
        <>
          {!canCompleteQuest && (
            <>
              <button
                className="danger"
                onClick={onAbandon}
              >
                Abandon
              </button>
            </>
          )}

          {canCompleteQuest && (
            <button
              className="success"
              onClick={onComplete}
            >
              Complete
            </button>
          )}
        </>
      )}

      {statusContent && (
        <div
          className={`quest-status ${statusContent}`}
        >
          {statusContent}
        </div>
      )}
    </div>
  )
}
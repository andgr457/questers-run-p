import type { CharacterEntity } from '../types/Character.types'

import { gameEventBus } from '../../../engine/GameEventBus'

type Props = {
  character: CharacterEntity
}

export default function CharacterEntityComp({
  character,
}: Props) {

  const activity =
    gameEventBus.getActivity(
      character.id,
      'quest'
    )
    ?? gameEventBus.getActivity(
      character.id,
      'hunt'
    )

  const activityType =
    activity?.activityType

  const isBusy =
    activity?.status === 'active'

  const progress =
    activity?.progress ?? 0

  const progressPercent =
    Math.floor(progress * 100)

  const handleStartQuest = () => {
    if (isBusy) return

    gameEventBus.emit({
      type: 'activity:start',
      characterId: character.id,
      activityId: crypto.randomUUID(),
      activityType: 'quest',
    })
  }

  const handleStartHunt = () => {
    if (isBusy) return

    gameEventBus.emit({
      type: 'activity:start',
      characterId: character.id,
      activityId: crypto.randomUUID(),
      activityType: 'hunt',
    })
  }

  return (
    <div>

      <div>
        <strong>
          {character.name}
        </strong>
      </div>

      <div>
        Level {character.level}
      </div>

      <div>
        Status:
        {' '}
        {isBusy
          ? activityType
          : 'idle'}
      </div>

      <div>
        HP:
        {' '}
        {character.hp}
        /
        {character.hpMax}
      </div>

      <div>
        Mana:
        {' '}
        {character.mana}
        /
        {character.manaMax}
      </div>

      <div>
        Stamina:
        {' '}
        {character.stamina}
        /
        {character.staminaMax}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginTop: '10px',
        }}
      >
        <button
          onClick={handleStartQuest}
          disabled={isBusy}
        >
          Quest
        </button>

        <button
          onClick={handleStartHunt}
          disabled={isBusy}
        >
          Hunt
        </button>
      </div>

      {isBusy && (
        <div
          style={{
            marginTop: '10px',
          }}
        >
          <progress
            value={progress}
            max={1}
            style={{
              width: '100%',
            }}
          />

          <div>
            {progressPercent}
            %
          </div>
        </div>
      )}

    </div>
  )
}
import type { RouteResult } from '../world/utils/worldRouting'
import type { WorldLocation } from '../world/worldState'
import styles from './worldTravelMap.module.css'

const LOCATIONS: WorldLocation[] = [
  'plains',
  'town',
  'guild',
  'woods',
  'cave',
  'dungeon',
]

const INDEX_MAP: Record<WorldLocation, number> = {
  plains: 0,
  town: 1,
  guild: 2,
  woods: 3,
  cave: 4,
  dungeon: 5,
}

type Props = {
  route?: RouteResult | null
  progress?: number // 0-1 travel progress (optional)
  currentLocation: WorldLocation
  isTraveling?: boolean
}

export default function WorldTravelMap({
  route,
  progress = 0,
  currentLocation,
  isTraveling = false,
}: Props) {
  const currentPos = INDEX_MAP[currentLocation]

  return (
    <div className={styles.map}>
      {/* base line */}
      <div className={styles.line} />

      {/* location nodes (always visible) */}
      {LOCATIONS.map((loc, i) => {
        const isCurrent = i === currentPos
        const isPast = i < currentPos

        return (
          <div
            key={loc}
            className={styles.node}
            data-current={isCurrent}
            data-past={isPast}
            style={{ left: `${(i / (LOCATIONS.length - 1)) * 100}%` }}
          >
            <div className={styles.label}>{loc.toUpperCase()}</div>
          </div>
        )
      })}

      {/* travel route overlay (only when traveling) */}
      {isTraveling && route && (
        <>
          <div className={styles.travelLine} />

          <div
            className={styles.dot}
            style={{
              left: `${progress * 100}%`,
            }}
          />
        </>
      )}

      {/* static player indicator (always shown) */}
      {!isTraveling && (
        <div
          className={styles.dotStatic}
          style={{
            left: `${(currentPos / (LOCATIONS.length - 1)) * 100}%`,
          }}
        />
      )}
    </div>
  )
}
import { useState } from 'react'
import CharacterCreationScreen from '../features/character/components/CharacterCreationScreen'
import GameScreen from '../features/game/components/GameScreen'
import DebugScreen from './DebugScreen/DebugScreen'
import GuildIntroModal from '../features/tutorial/components/GuildIntroModal'
import WorldWrapper from './components/WorldWrapper'
import { worldStateStore } from '../game/world/worldState'
import { activityRuntimeService } from '../features/activity/activityRuntimeService'
activityRuntimeService.setWorldStateStore(worldStateStore)

export default function App() {
  const [characterId, setCharacterId] = useState<string | null>(null)

  const mode = 'game'

  //@ts-ignore
  if (mode === 'debug') {
    return <WorldWrapper location="plains"><DebugScreen /></WorldWrapper>
  }

  // ======================
  // CHARACTER CREATION
  // ======================
  if (!characterId) {
    return (
      <WorldWrapper location="plains">
        <CharacterCreationScreen
          onCreated={(id) => {
            setCharacterId(id)
            worldStateStore.initCharacter(id)
          }}
        />
      </WorldWrapper>
    )
  }

  const world = worldStateStore.get(characterId)

  const location = world?.location ?? 'plains'
  const introSeen = world?.flags?.introSeen ?? false

  return (
    <WorldWrapper location={location}>
      <GameScreen characterId={characterId} />

      {!introSeen && (
        <GuildIntroModal
          onClose={() => {
            worldStateStore.setFlag(characterId, 'introSeen', true)
            worldStateStore.setLocation(characterId, 'guild')
          }}
        />
      )}
    </WorldWrapper>
  )
}
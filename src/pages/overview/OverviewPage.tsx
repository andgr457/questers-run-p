import { useCallback, useEffect, useMemo, useState } from 'react'
import { ITEM_CURRENCY_IDS } from '../../data/items/currency/Item.Currency.data'
import { TutorialOverlay, type TutorialStep } from '../../components/tutorial/TutorialOverlay'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import { useWindows } from '../../components/windows/WindowProvider'
import CharacterNewRename from '../../components/characters/CharacterNewRename'
import type { Character } from '../../interfaces/characters/Character.types'

interface OverviewPageProps extends AppProperties {

}

export default function OverviewPage(props: OverviewPageProps){
  const {
    character,
    characterInventories,
    allQuestsWithProgress,
    setLocation,
    handleSetCharacter,
    characterMobProgress,
    mobs,
    quests
  } = props
  const [showTutorial, setShowTutorial] = useState(character ? false : true)

  const navigate = useNavigate()

  useEffect(() => {
    setLocation?.('Overview')
  },[])

  const {
    windows,
    openWindow,
    closeWindow
  } = useWindows()
  
  const isWindowOpen = (
    id: string
  ) => {
    return windows.some(w => w.id === id)
  }

  function toggleWindow(id: string, title: string, content: React.ReactNode) {
    if (isWindowOpen(id)) {
      closeWindow(id)
      return
    }

    openWindow(
      id,
      title,
      <div>
        {content}
      </div>
    )
  }

  function toggleNewOrRename() {
    toggleWindow('character-new-rename', `Character Settings`, <CharacterNewRename 
      {...props}
      handleSetCharacter={handleSaveCharacter}
    />)
  }

  const handleSaveCharacter = useCallback(async (c: Character) => {
    handleSetCharacter?.(c)
    closeWindow?.('character-new-rename')
    navigate('/adventurers-guild')
  }, [])

  const mainCharacterExists = typeof character?.name === 'string'
  const currencyPouch = characterInventories?.find(i => i.title === 'Currency')
  let totalGold = 0
  currencyPouch?.transactions?.map(txn => {
    if(txn.itemId === ITEM_CURRENCY_IDS.GOLD){
      totalGold += txn.quantity
    }
  })

  const tutorialSteps = useMemo<TutorialStep[]>(() => {
    if(!character?.name){
      return [
        {
          selector: '#tutorial-new-character',
          content: 'Click here to begin your journey.',
          action: () => {
            toggleNewOrRename()
          }
        }
      ]
    }
    return []
  }, [character, characterInventories])

  const completedQuestProgress = useMemo(() => {
    return (allQuestsWithProgress ?? []).filter(qp => qp.questProgress?.status === 'complete' && qp.questProgress?.characterId === character.id)
  }, [allQuestsWithProgress, character])

  const questCompletionCounts = useMemo(() => {
    const map = new Map<string, { questId: string; title: string; count: number }>()

    for (const qp of completedQuestProgress) {
      const questId = qp.quest.id
      const existing = map.get(questId)

      if (existing) {
        existing.count += 1
      } else {
        map.set(questId, {
          questId,
          title: (quests ?? []).find(q => q.id === questId)?.title ?? 'Unknown Quest',
          count: 1
        })
      }
    }

    return Array.from(map.values())
  }, [completedQuestProgress, quests])

  const mobKillCounts = useMemo(() => {
    const map = new Map<string, { mobId: string; name: string; count: number }>()

    for (const mp of characterMobProgress ?? []) {
      const mobId = mp.mobId
      const existing = map.get(mobId)

      const increment = 1

      if (existing) {
        existing.count += increment
      } else {
        map.set(mobId, {
          mobId,
          name: mobs?.find(m => m.id === mobId)?.name ?? 'Unknown Mob',
          count: increment
        })
      }
    }

    return Array.from(map.values())
  }, [characterMobProgress, mobs])

  return <>
    {!character?.name && showTutorial === true  && <TutorialOverlay 
      steps={tutorialSteps} 
      onCancel={() => {setShowTutorial(false)}} 
      onComplete={() => {
        //todo
        setShowTutorial(false)
      }}
      posTop={30}

    />}

    <div id='overview-top'>
      <div className='page-main'>
        <div className='character-section-title'>
          <div className='page-header-banner'>
            <div className='page-header-title'>
              OVERVIEW
            </div>
          </div>
        </div>
        <PageHeader showActions={!character?.name ? true : false}>
          <button id='tutorial-new-character' className='basic'
            onClick={() => {
              toggleNewOrRename()
            }}
          >
            {mainCharacterExists ? `Rename ${character.name}`: 'Create Main Character'}
          </button>
        </PageHeader>

        {character?.name && <div className='item-list'>
          <div className='list-item'>
            <div className='list-item-title'>
              Dashboard
            </div>
            
            <div className='list-item-info'>
              Quests Completed: <span style={{color: 'gold'}}>{completedQuestProgress?.length ?? 0}</span>
            </div>
            <div className='list-item-info'>
              Mobs Hunted: <span style={{color: 'gold'}}>{mobKillCounts?.length ?? 0}</span>
            </div>
            <div className='list-item-info'>
              Achivements Earned: <span style={{color: 'gold'}}>{character?.achievements?.length ?? 0}</span>
            </div>
          </div>

          <div className='list-item'>
            <div className='list-item-title'>
              Quests Complete
            </div>

            <div className='list-item-info'>
              {questCompletionCounts.length === 0 && <div>No quests completed yet.</div>}
              {questCompletionCounts.length > 0 && questCompletionCounts.map(q => {
                return (
                  <div key={q.questId}>
                    <span style={{ color: 'gold' }}>x{q.count}</span> {q.title}
                  </div>
                )
              })}
            </div>
          </div>

          <div className='list-item'>
            <div className='list-item-title'>
              MOBS HUNTED
            </div>
            
            <div className='list-item-info'>
              {mobKillCounts?.length === 0 && <div>No mobs hunted yet.</div>}
              {mobKillCounts?.length > 0 && mobKillCounts.map(m => {
                return (
                  <div key={m.mobId}>
                    <span style={{ color: 'gold' }}>x{m.count}</span> {m.name}
                  </div>
                )
              })}
            </div>
          </div>
        </div>}

      </div>
    </div>
  </>
}
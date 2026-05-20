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
    allQuestProgress,
    setLocation,
    handleSetCharacter,
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

  const allCharacterQuestsProgress = allQuestsWithProgress?.filter(qp => qp.questProgress?.characterId === character?.id)
  const allCharacterQuestProgress = allQuestProgress?.filter(qp => qp.characterId === character?.id)
  const allCompleteCharacterQuestProgress = allCharacterQuestProgress?.filter(qp => qp.status === 'complete')
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
              Quests Completed: <span style={{color: 'gold'}}>{allCompleteCharacterQuestProgress?.length ?? 0}</span>
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
              {allCharacterQuestsProgress?.map(q => {
                const amount = allCompleteCharacterQuestProgress?.filter(cq => cq.questId === q.questProgress?.questId)?.length
                return <div>
                  <span style={{color: 'gold'}}>x{amount}</span> {q.quest.title}
                </div>
              })}
            </div>
          </div>
        </div>}

      </div>
    </div>
  </>
}
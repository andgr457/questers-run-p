import { useCallback, useEffect, useMemo, useState } from 'react'
import NewCharacterModal from '../../components/characters/NewCharacterModal'
import { ITEM_CURRENCY_IDS } from '../../data/items/currency/Item.Currency.data'
import { TutorialOverlay, type TutorialStep } from '../../components/tutorial/TutorialOverlay'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import type { AppProperties } from '../../interfaces/AppProperties.types'
import { useWindows } from '../../components/windows/WindowProvider'
import CharacterNewRename from '../../components/characters/CharacterNewRename'
import type { Character } from '../../interfaces/characters/Character.types'
import { sleep } from '../../services/CommonServices'

interface OverviewPageProps extends AppProperties {

}

export default function OverviewPage(props: OverviewPageProps){
  const {
    character,
    characterInventories,
    setLocation,
    handleSetCharacter,
    handleResetEverything,
  } = props
  const [showTutorial, setShowTutorial] = useState(character ? false : true)
  const [expandHistory, setExpandHistory] = useState(false)

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
    {character?.name && showTutorial === true && <TutorialOverlay 
      steps={tutorialSteps} 
      onCancel={() => {setShowTutorial(false)}} 
      onComplete={() => {
        //todo
        setShowTutorial(false)
      }}
    />}

    <div id='overview-top'>
      <div className='page-main'>
        <PageHeader showActions={!character?.name ? true : false}>
          {/* {character && <button className='basic'
            onClick={() => {
              setShowTutorial(true)
            }}
          >
            Overview Tutorial
          </button>} */}
          <button id='tutorial-new-character' className='basic'
            onClick={() => {
              toggleNewOrRename()
            }}
          >
            {mainCharacterExists ? `Rename ${character.name}`: 'Create Main Character'}
          </button>
          {/* <button className='danger'
            onClick={() => {handleResetEverything?.()}}
          >
            Reset Everything
          </button> */}
        </PageHeader>
        
      </div>
    </div>
  </>
}
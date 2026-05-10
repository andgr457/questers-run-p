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
  const [newCharacterModalOpen, setNewCharacterModalOpen] = useState(false)
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

    const wouldBeCurrencyId = `${character?.id}__${characterInventories?.find(inv => inv.title === 'Currency')?.id}`
    const wouldBeNapsackId = `${character?.id}__${characterInventories?.find(inv => inv.title === 'Napsack')?.id}`

    return [
      {
        selector: '#tutorial-character',
        content: 'This will display your stats and other information like counts of various things while you journey.',
        action: () => {navigate({ hash: '#tutorial-current-quest' })},
        waitMillis: 500
      },
      {
        selector: '#tutorial-current-quest',
        content: 'This will display current quest if you are on one. You will need to head to the adventurer\'s guild to manage your current quest through the guild clerk.',
        action: () => {navigate({ hash: '#tutorial-inventory' })},
        waitMillis: 500
      },
      {
        selector: '#tutorial-inventory',
        content: 'You can interact with inventory items here.',
        action: () => {navigate({ hash: `#${wouldBeCurrencyId}` })},
        waitMillis: 200
      },
      {
        selector: `#${wouldBeCurrencyId}`,
        content: 'You start with 20 gold. The currency pouch can contain any type of currency without limit.',
        action: () => {navigate({ hash: `#${wouldBeNapsackId}` })},
        waitMillis: 200
      },
      {
        selector: `#${wouldBeNapsackId}`,
        content: 'You start with an 8 slot napsack pouch that contains 5 health potions. Items stack unless they are not the same stats. So be sure to bank or trade items regularly to avoid full inventory issues.',
        action: () => {navigate({ hash: '#tutorial-history' })},
        waitMillis: 500
      },
      {
        selector: '#tutorial-history',
        content: 'You can view recent history here. Click "show" to expand.',
        action: () => {setExpandHistory(true); navigate({hash: '#hi__0__0'})},
        waitMillis: 200
      },
      {
        selector: '#hi__0__0',
        content: 'These history items show item gains, achievements earned, quest received and complete, and groups them into days.',
        action: () => {setExpandHistory(false); navigate({hash: '#overview-top'})},
        waitMillis: 200
      }
    ]
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
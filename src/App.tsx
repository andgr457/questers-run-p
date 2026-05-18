import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import OverviewPage from './pages/overview/OverviewPage'
import { useConfirm } from './providers/ConfirmProvider';
import AdventurersGuildPage from './pages/adventurers-guild/AdventurersGuildPage';
import TownPage from './pages/TownPage';
import { WindowProvider } from './components/windows/WindowProvider';
import { ScrollToHash } from './components/ScrollToHash';
import NavMenu from './components/nav/NavMenu';
import WindowLayer from './components/windows/WindowLayer';
import type { Character, CharacterClass, Stat } from './interfaces/characters/Character.types';
import { LOCAL_STORAGE_KEYS } from './common/constants/LocalStorageKeys';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Inventory } from './interfaces/inventories/Inventory.types';
import type { Quest, QuestGroup, QuestProgress } from './interfaces/quests/Quests.types';
import type { Item } from './interfaces/items/Item.types';
import { CharacterClassRepository } from './repository/characters/CharacterClassRepository';
import { ItemRepository } from './repository/items/ItemRepository';
import { QuestRepository } from './repository/quests/QuestRepository';
import { QuestGroupRepository } from './repository/quests/QuestGroupRepository';
import { DateTime } from 'luxon';
import { ITEM_CURRENCY_IDS } from './data/items/currency/Item.Currency.data';
import type { AppProperties } from './interfaces/AppProperties.types';
import type { QuestWithQuestProgress } from './components/quests/CharacterQuests';
import { QuestService } from './services/quests/QuestService';
import './form-controls.css'
import { AchievementRepository } from './repository/achievements/AchievementRepository';
import type { Achievement } from './interfaces/achievements/Achievement.types';
import ProfessionGatheringPage from './pages/professions/ProfessionsGatheringPage';
import type { ProfessionType } from './interfaces/professsions/Profession.types';
import ProfessionMiningPage from './pages/professions/ProfessionsMiningPage';
import ProfessionFishingPage from './pages/professions/ProfessionsFishingPage';
import TavernPage from './pages/tavern/TavernPage';
import './common/styles/ItemList.css'
import './common/styles/Sections.css'
import './common/styles/AppScreen.css'

import ShoppePage from './pages/shoppe/ShoppePage';
import CharacterInfo from './components/characters/CharacterInfo';
import PageLayout from './pages/PageLayout';
import type { ShoppeCartItem } from './components/shoppe/ShoppeCart';

function App() {
  const [location, setLocation] = useState('Overview')
  const [character, setCharacter] = useLocalStorage<Character | undefined>(LOCAL_STORAGE_KEYS.CHARACTERS_MAIN, undefined)
  const [characterClass, setCharacterClass] = useState<CharacterClass | undefined>(undefined)
  const [characterInventories, setCharacterInventories] = useState<Inventory[] | undefined>(undefined)
  const [inventories, setInventories] = useLocalStorage<Inventory[]>(LOCAL_STORAGE_KEYS.INVENTORIES, [])
  const [allQuestProgress, setAllQuestProgress] = useLocalStorage<QuestProgress[]>(LOCAL_STORAGE_KEYS.QUEST_PROGRESS, [])
  
  const [allQuestsWithQuestProgress, setAllQuestsWithQuestProgress] = useState<QuestWithQuestProgress[] | undefined>(undefined)
  const [characterQuestProgress, setCharacterQuestProgress] = useState<QuestWithQuestProgress[] | undefined>(undefined)
  const [quests, setQuests] = useState<Quest[]>([])
  const [questGroups, setQuestGroups] = useState<QuestGroup[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const [items, setItems] = useState<Item[]>([])
  const [requestedWindowId, setRequestedWindowId] = useState<string | undefined>(undefined)
  
  const {showConfirm} = useConfirm()
  
  const handleResetEverything = useCallback(async () => {
    if(!await showConfirm({
      title: 'Are you sure?',
      message: 'This will reset everything in this browser\'s storage for this site. Are you sure you wish to continue?',
      isYesNo: true
    })) return

    setCharacter(null as any)
    setInventories([])
    setAllQuestProgress([])
    window.location.href = '/'
  }, [])

  const handleResetProfession = useCallback(async (professionType: ProfessionType) => {
    //@ts-ignore
    let characterProfessionStat = {...character?.professions[professionType]}
    if(!characterProfessionStat) return

    if(!await showConfirm({
      title: 'Are you sure?',
      message: `This will reset the ${professionType.toUpperCase()} profession for your character. Are you sure you wish to continue?`,
      isYesNo: true
    })) return
    
    if(character){
      //@ts-ignore
      if(professionType === 'gathering'){
        characterProfessionStat = {
          name: 'Gathering',
          hint: '',
          value: 0,
          level: 0,
          nextLevelXP: 100,
          xp: 0,
        }
        const newCharacter = {...character as Character}
        //@ts-ignore
        newCharacter.professions[professionType] = {...characterProfessionStat}
        setCharacter({...newCharacter})
      }
    }

    window.location.href = '/'
  }, [character])

  const dataRef = useRef({
    character,
    questGroups,
    quests,
    allQuestProgress,
    inventories
  });

  useEffect(() => {
    dataRef.current = {
      character,
      questGroups,
      quests,
      allQuestProgress,
      inventories
    };
  }, [character, questGroups, quests, allQuestProgress, inventories]);

  
  useEffect(() => {
    const interval = setInterval(async () => {
      const {
        character,
        questGroups,
        quests,
        allQuestProgress,
        inventories
      } = dataRef.current;

      if (!character || !questGroups || !quests || !inventories) return;

      const questService = new QuestService();
      const progress = await questService.getQuestsWithQuestProgress(
        character,
        quests,
        questGroups,
        allQuestProgress,
        inventories
      )
      setAllQuestsWithQuestProgress(progress)
      setCharacterQuestProgress(progress.filter(p => p.questProgress?.characterId === character.id))
      setCharacterInventories(inventories.filter(i => i.characterId === character.id))
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = async () => { 
      const itemRepo = new ItemRepository()
      setItems(await itemRepo.list())
      const questRepo = new QuestRepository()
      setQuests(await questRepo.list())
      const questGroupRepo = new QuestGroupRepository()
      setQuestGroups(await questGroupRepo.list())
      const achievementRepo = new AchievementRepository()
      setAchievements(await achievementRepo.list())
    }
    load()
  }, [])
  
  useEffect(() => {
    const load = async function () {
      if(character?.name){
        const classRepo = new CharacterClassRepository()
        const allClasses = await classRepo.list()
        
        setCharacterClass(allClasses.find(ac => ac.id === character.classId))
      }
    }
    load()
  }, [character])

  const handleShoppeConfirmation = useCallback(async (cartItems: ShoppeCartItem[]) => {
    if(cartItems?.length === 0) return
    const backpack = characterInventories?.find(ci => ci.title === 'Backpack')
    const currency = characterInventories?.find(ci => ci.title === 'Currency')
    if(!backpack || !currency) return
    const txnMessages = []
    for(const si of cartItems){
      let quantity = 0
      let gold = 0
      if(si.transactionType === 'buy'){
        quantity = si.amount
        gold =  (si.amount * si.item.gold.buy) * -1
        txnMessages.push(`${quantity} ${si.item.name} purchased for ${gold} gold.`)
      } else {
        quantity = si.amount * -1
        gold = si.amount * si.item.gold.sell
        txnMessages.push(`${si.amount} ${si.item.name} sold for ${gold} gold.`)
      }
      backpack.transactions.push({
        id: `invtxn_shoppe_item_${si.item.id}__${character?.id}__${DateTime.utc().toMillis()}`,
        date: DateTime.utc().toISO(),
        itemId: si.item.id,
        note: `Shoppe Item Transaction`,
        quantity: quantity
      })
      currency.transactions.push({
        id: `invtxn_shoppe_gold__${si.item.id}__${character?.id}__${DateTime.utc().toMillis()}`,
        date: DateTime.utc().toISO(),
        itemId: ITEM_CURRENCY_IDS.GOLD,
        note: `Shoppe Item Transaction`,
        quantity: gold
      })
    }

    const newAllInventories = []
    for(const inv of inventories){
      if(inv.id === currency.id){
        newAllInventories.push(currency)
      } else if (inv.id === backpack.id) {
        newAllInventories.push(backpack)
      } else {
        newAllInventories.push(inv)
      }
    }
    setInventories(newAllInventories)
    await showConfirm({
      isYesNo: false,
      title: 'Shoppe Purchase Complete',
      message: `The following transactions were successfully completed!`,
      content: <div style={{textAlign: 'center'}}>
        {txnMessages.map(t => {
          return <div>
            {t}
          </div>
        })}
      </div>
    })
  }, [inventories, characterInventories])

  const handleAddInventory = useCallback((inventory: Inventory[]) => {
    const newInventories = []
    for(const i of inventory){
      newInventories.push(i)
    }
    for(const i of inventories){
      newInventories.push(i)
    }
    setInventories(newInventories)
  }, [inventories])

  const handleTavernItemStart = useCallback(async (goldCost: number) =>{
    const currency = characterInventories?.find(i => i.title === 'Currency')
    if(currency){
      currency.transactions.push({
        id: `invtxn__${ITEM_CURRENCY_IDS.GOLD}__${character?.id}__${DateTime.utc().toMillis()}`,
        date: DateTime.utc().toISO(),
        itemId: ITEM_CURRENCY_IDS.GOLD,
        note: `Tavern cost`,
        quantity: goldCost * -1
      })
    }
    const newInv = []
    for(const inv of inventories){
      if(inv.id === currency?.id){
        newInv.push({...currency})
      } else {
        newInv.push(inv)
      }
    }
    setInventories(newInv)
  }, [inventories, characterInventories])

  const handleTavernItemComplete = useCallback(async (percentChange: number) => {
    const newCharacter = {...character as Character}
    const divisor = percentChange / 100

    if(newCharacter.stats){
      if(newCharacter.stats.hp){
        if(newCharacter.stats?.hp?.max){
          const amountToAdd = newCharacter.stats.hp.max * divisor
          newCharacter.stats.hp.value += amountToAdd
          if(newCharacter.stats.hp.value > newCharacter.stats.hp.max){
            newCharacter.stats.hp.value = newCharacter.stats.hp.max
          }
        }
      }
      if(newCharacter.stats.mp){
        if(newCharacter.stats?.mp?.max){
          const amountToAdd = newCharacter.stats.mp.max * divisor
          newCharacter.stats.mp.value += amountToAdd
          if(newCharacter.stats.mp.value > newCharacter.stats.mp.max){
            newCharacter.stats.mp.value = newCharacter.stats.mp.max
          }
        }
      }
      if(newCharacter.stats.stamina){
        if(newCharacter.stats?.stamina?.max){
          const amountToAdd = newCharacter.stats.stamina.max * divisor
          newCharacter.stats.stamina.value += amountToAdd
          if(newCharacter.stats.stamina.value > newCharacter.stats.stamina.max){
            newCharacter.stats.stamina.value = newCharacter.stats.stamina.max
          }
        }
      }
    }
    setCharacter({...newCharacter as Character})
  }, [character])

  const handleProfessionStatLevel = (c: Character, item: Item, amount: number) => {
    //@ts-ignore
    const characterProfessionStat = {...c?.professions[item.profession.type as ProfessionType]}
    if(typeof characterProfessionStat?.xp === 'number' && typeof characterProfessionStat?.nextLevelXP === 'number' && item?.profession){
      const firstXpValue = (amount * item?.profession?.xp) + characterProfessionStat.xp
      const overNextLevelValue = characterProfessionStat.nextLevelXP - firstXpValue
      let canLevel = overNextLevelValue <= 0
      if(canLevel && typeof characterProfessionStat.level === 'number'){
        const leftOverXp = Math.abs(overNextLevelValue)
        characterProfessionStat.level += 1
        characterProfessionStat.xp = 0 + leftOverXp
        characterProfessionStat.nextLevelXP += 10
      } else {
        characterProfessionStat.xp += (amount * item?.profession?.xp)
      }
      const newCharacter = {...c as Character}
      //@ts-ignore
      newCharacter.professions[item.profession.type] = {...characterProfessionStat}
      if(newCharacter.stats.stamina && item && item.profession){
        const staminaDrain = item.profession.stamina * amount
        const newValue = newCharacter.stats.stamina.value - staminaDrain
        newCharacter.stats.stamina.value = newValue
      }
      setCharacter({...newCharacter})
    }
  }

  const handleDoProfessionItemComplete = useCallback(async (professionItemId: string, amount: number) => {
    let invRef = undefined
    for(const inv of characterInventories ?? []){
      const invTxns = inv.transactions.filter(t => t.itemId === professionItemId)
      
      if(invTxns.length > 0){
        invRef = inv
        break
      }
    }
    if(!invRef){
      invRef = characterInventories?.find(i => i.title === 'Backpack')
    }
    invRef?.transactions.push({
      id: `invtxn__${professionItemId}__${character?.id}__${DateTime.utc().toMillis()}`,
      date: DateTime.utc().toISO(),
      itemId: professionItemId,
      note: `Profession addition`,
      quantity: amount
    })

    const newAllInventories = []
    for(const inv of inventories){
      if(inv.id === invRef?.id){
        newAllInventories.push(invRef)
      } else {
        newAllInventories.push(inv)
      }
    }
    setInventories(newAllInventories)
    const item = items.find(i => i.id === professionItemId)
    if(typeof item?.profession?.xp === 'number'){
      handleProfessionStatLevel(character as Character, item, amount)
    }
  }, [items, characterInventories, inventories, character])

  const handleAbandonQuest = useCallback(async (questProgressId: string) => {
    const foundProgress = characterQuestProgress?.find(p => p.questProgress?.id === questProgressId)
    if(!foundProgress){
      //do nothing
      return
    }
    if(await showConfirm({
      isYesNo: true,
      title: 'Abandon Quest?',
      message: 'This will abandon the quest, allowing you to take another one. Are you sure you wish to continue?'
    })){
      const newProgress = []
      for(const p of allQuestProgress ?? []){
        if(p.id !== questProgressId){
          newProgress.push(p)
        }
      }
      setAllQuestProgress(newProgress as QuestProgress[])
    }
  }, [characterQuestProgress])

  const handleAddQuest = useCallback(async (quest: Quest, characterId: string) => {
    const newCharacter = {...character}
    for(const req of quest?.startRequirements ?? []){
      if(req.stats){
        for(const propertyName of Object.getOwnPropertyNames(req.stats)){
          //@ts-ignore
          const stat = req.stats[propertyName] as Stat
          //@ts-ignore
          const characterStat = newCharacter.stats[propertyName] as Stat
          const baseValue = characterStat.value - stat.value 
          const newValue = baseValue < 0 ? 0 : baseValue
          //@ts-ignore
          newCharacter.stats[propertyName].value = newValue
        }
        setCharacter({...newCharacter as Character})
      }
    }

    const questProgress: QuestProgress = {
      id: `qprogress_${characterId}_${quest.id}_${DateTime.utc().toMillis()}`,
      characterId: characterId as string,
      questId: quest.id,
      startDate: DateTime.utc().toISO(),
      status: 'in-progress'
    }
    const newProgress = []
    newProgress.push(questProgress)
    for(const p of allQuestProgress ?? []){
      newProgress.push(p)
    }
    setAllQuestProgress(newProgress as QuestProgress[])
  }, [quests, characterQuestProgress, character, allQuestProgress])

  const handleCompleteQuest = useCallback(async (questProgress: QuestWithQuestProgress) => {
    if(!questProgress || !characterInventories || questProgress.canCompleteQuest === false) return

    const progress = questProgress.questProgress
    const rewards = questProgress.quest.rewards
    const completionRequirements = questProgress.quest.completionRequirements

    const currency = characterInventories.find(ci => ci.title === 'Currency')
    const backpack = characterInventories.find(ci => ci.title === 'Backpack')

    if(backpack && !backpack?.transactions){
      backpack.transactions = []
    }
    if(currency && !currency?.transactions){
      currency.transactions = []
    }
    if(!backpack || !currency){
      console.error('Did not find character currency or backpack inventories.')
      return
    }
    const questRewardMessages: string[] = []
    let totalXp = 0
    for(const r of rewards){
      if(r.itemId){
        if(r.itemId === ITEM_CURRENCY_IDS.GOLD){
          currency.transactions.push({
            id: `invtxn__${r.itemId}__${questProgress?.questProgress?.characterId}__${DateTime.utc().toMillis()}`,
            date: DateTime.utc().toISO(),
            itemId: r.itemId,
            note: 'Gold Quest Reward',
            quantity: r.itemAmount as number
          })
          questRewardMessages.push(`Quest Reward: ${r.itemAmount?.toLocaleString()} gold received!`)
        } else {
          backpack.transactions.push({
            id: `invtxn__${r.itemId}__${questProgress?.questProgress?.characterId}__${DateTime.utc().toMillis()}`,
            date: DateTime.utc().toISO(),
            itemId: r.itemId as string,
            note: 'Item Quest Reward',
            quantity: r.itemAmount as number
          })
          const item = items.find(i => i.id === r.itemId)
          questRewardMessages.push(`Quest Reward: ${r.itemAmount?.toLocaleString()} ${item?.name} received!`)
        }
      } else if(typeof r.xp === 'number'){
        totalXp += r.xp
      }
    }
    //remove any quest completion required items
    for(const req of completionRequirements ?? []){
      if(typeof req.itemAmount === 'number'){
        const item = items.find(i => i.id === req.itemId)
        if(item){
          backpack.transactions.push({
            id: `invtxn__${req.itemId}__${questProgress?.questProgress?.characterId}__${DateTime.utc().toMillis()}`,
            date: DateTime.utc().toISO(),
            itemId: req.itemId as string,
            note: 'Quest Item Removal',
            quantity: (req.itemAmount * -1) as number
          })
        }
      }
    }

    //all inv
    const allInv = []
    for(const inv of inventories){
      if(inv.id === currency.id){
        allInv.push(currency)
      } else if(inv.id === backpack.id){
        allInv.push(backpack)
      } else {
        allInv.push(inv)
      }
    }
    setInventories(allInv)
    if(totalXp > 0){
      const newCharacter = {...character}
      if(typeof newCharacter.xp === 'number' && typeof newCharacter.levelNextXP === 'number'){
        const firstXpValue = totalXp + newCharacter.xp
        const overNextLevelValue = newCharacter.levelNextXP - firstXpValue
        let canLevel = overNextLevelValue <= 0
        if(canLevel && typeof newCharacter.level === 'number'){
          const leftOverXp = Math.abs(overNextLevelValue)
          newCharacter.level += 1
          newCharacter.xp = 0 + leftOverXp
          newCharacter.levelNextXP += 10
        } else {
          console.log('adding xp to character', newCharacter.xp, totalXp)
          newCharacter.xp += totalXp
        }
      }
      
      setCharacter({...newCharacter} as Character)
      questRewardMessages.push(`Quest Reward: ${totalXp?.toLocaleString()} XP received!`)
    }

    const newQuestProgress: QuestProgress = {
      ...progress as QuestProgress,
      status: 'complete',
      endDate: DateTime.utc().toISO()
    }

    const newProgress = []
    for(const p of allQuestProgress){
      if(p.id === progress?.id){
        newProgress.push(newQuestProgress)
      } else {
        newProgress.push(p)
      }
    }
    setAllQuestProgress(newProgress)
    questRewardMessages.push(`Quest Completed: ${questProgress.quest.title}!`)

    await showConfirm({
      title: `Quest Completed!`,
      message: `Congratulations on completing a quest! You've received the following rewards.`,
      isYesNo: false,
      content: <div style={{textAlign: 'center', width: '100%'}}>
        {questRewardMessages.map(m => {
          return <div>
            {m}
          </div>
        })}
      </div>
    })
    

  }, [characterQuestProgress, allQuestProgress, character, items, characterInventories, history, inventories])

  const currencyPouch = inventories?.find(i => i.title === 'Currency')
  let totalGold = 0
  currencyPouch?.transactions?.map(txn => {
    if(txn.itemId === ITEM_CURRENCY_IDS.GOLD){
      totalGold += txn.quantity
    }
  })
  const appProps: AppProperties = {
    achievements,
    location,
    character: character as Character,
    characterClass: characterClass as CharacterClass,
    characterInventories: inventories,
    characterQuestProgress: characterQuestProgress?.find(cqp => cqp.questProgress?.status === 'in-progress'),
    items,
    questGroups,
    quests,
    allQuestProgress,
    allQuestsWithProgress: allQuestsWithQuestProgress,
    
    handleResetEverything,
    handleResetProfession,
    handleAddInventory,
    handleDoProfessionItemComplete,
    handleTavernItemStart,
    handleTavernItemComplete,
    handleAddQuest,
    handleAbandonQuest,
    handleCompleteQuest,
    handleSetRequestedWindowId: setRequestedWindowId,
    handleSetCharacter: setCharacter,
    setLocation,
    handleShoppeConfirmation
  }
  return (
    <WindowProvider>
      <BrowserRouter>
        <ScrollToHash />
        <div>
          <div >
            <NavMenu 
              {...appProps}
              windowRequestId={requestedWindowId}
            />
          </div>
          <PageLayout 
            leftChildren={character?.name && <CharacterInfo {...appProps} showExpander={true} />}
            rightChildren={<Routes>
              <Route path="/" element={<OverviewPage {...appProps} />} />
              {character?.name}{
                <>
                  <Route path='/town' element={<TownPage />} />
                  <Route path='/tavern' element={<TavernPage {...appProps} />} />
                  <Route path='/shoppe' element={<ShoppePage {...appProps} />} />
                  <Route path='/adventurers-guild' element={<AdventurersGuildPage {...appProps} />} />
                  <Route path='/profession/gathering' element={<ProfessionGatheringPage {...appProps} />} />
                  <Route path='/profession/mining' element={<ProfessionMiningPage {...appProps} />} />
                  <Route path='/profession/fishing' element={<ProfessionFishingPage {...appProps} />} />

                </>
              }
              
              <Route path="*" element={<OverviewPage  {...appProps}  />} />
            </Routes>}
          />
          <WindowLayer />
        </div>
      </BrowserRouter>
    </WindowProvider>
  );
}

export default App

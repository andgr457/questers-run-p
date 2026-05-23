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
import { useCallback, useEffect, useState } from 'react';
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
import CharacterInventory from './components/inventory/CharacterInventory';
import CharacterQuestCurrent from './components/quests/CharacterQuestCurrent';
import { shoppeServiceConfirmCart } from './services/Shoppe.Service';
import { tavernServiceItemComplete, tavernServiceItemStart } from './services/Tavern.Services';
import { characterServiceGetItemAmount, characterServiceModifyStats } from './services/Character.Service';
import { professionServiceItemComplete } from './services/Profession.Services';
import { type Loot, type Mob, type MobProgress } from './interfaces/mobs/Mob.types';
import { MobRepository } from './repository/mobs/MobsRepository';
import HuntingForestPage from './pages/hunting/HuntingForestPage';
import { GAME_VERSION } from './services/AppService';
import { useFloatingNotifications } from './hooks/useFloatingNotify';
import NotificationList from './components/notifications/NotificationList';

function App() {
  const {showConfirm} = useConfirm()
  const { notifications, addNotification } = useFloatingNotifications()
  const [character, setCharacter] = useLocalStorage<Character | undefined>(
    LOCAL_STORAGE_KEYS.CHARACTERS_MAIN,
    undefined
  )

  useEffect(() => {
    if (!character) return

    if (character.gameVersion === GAME_VERSION) return

    const run = async () => {
      const confirmed = await showConfirm({
        isYesNo: true,
        title: 'New Alpha Version',
        message: `New version ${GAME_VERSION} has been released and requires a full reset.`
      })

      if (confirmed) {
        await handleResetEverything()
      }
    }

    run()
  }, [character])

  const [inventories, setInventories] = useLocalStorage<Inventory[]>(LOCAL_STORAGE_KEYS.INVENTORIES, [])
  const [allQuestProgress, setAllQuestProgress] = useLocalStorage<QuestProgress[]>(LOCAL_STORAGE_KEYS.QUEST_PROGRESS, [])
  const [allQuestsWithQuestProgress, setAllQuestsWithQuestProgress] = useState<QuestWithQuestProgress[]>([])
  const [characterQuestProgress, setCharacterQuestProgress] = useState<QuestWithQuestProgress[]>([])
  
  const [allMobProgress, setAllMobProgress] = useLocalStorage<MobProgress[]>(LOCAL_STORAGE_KEYS.MOB_PROGRESS, [])
  const [characterMobProgress, setCharacterMobProgress] = useState<MobProgress[]>([])

  const [characterClass, setCharacterClass] = useState<CharacterClass | undefined>(undefined)
  const [characterInventories, setCharacterInventories] = useState<Inventory[]>([])
  const [location, setLocation] = useState('Overview')
  
  const [quests, setQuests] = useState<Quest[]>([])
  const [questGroups, setQuestGroups] = useState<QuestGroup[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])

  const [items, setItems] = useState<Item[]>([])
  const [mobs, setMobs] = useState<Mob[]>([])
  const [requestedWindowId, setRequestedWindowId] = useState<string | undefined>(undefined)
  
  
  useEffect(() => {
    if (!character) return
    if (!quests.length || !questGroups.length) return
    if (!items.length || !mobs.length || !achievements.length || !mobs.length) return

    const run = async () => {
      const questService = new QuestService()

      const progress = await questService.getQuestsWithQuestProgress(
        character,
        quests,
        questGroups,
        allQuestProgress ?? [],
        inventories ?? [],
        achievements,
        items,
        mobs,
        allMobProgress ?? []
      )

      setAllQuestsWithQuestProgress(progress)
      setCharacterQuestProgress(
        progress.filter(p => p.questProgress?.characterId === character.id)
      )
      setCharacterInventories(
        inventories?.filter(i => i.characterId === character.id) ?? []
      )
      setCharacterMobProgress(
        allMobProgress?.filter(mp => mp.characterId === character.id) ?? []
      )
    }

    run()
  }, [
    character,
    quests,
    questGroups,
    allQuestProgress,
    inventories,
    achievements,
    items,
    mobs,
    allMobProgress
  ])

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
      const mobRepo = new MobRepository()
      setMobs(await mobRepo.list())
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

  const handleResetEverything = useCallback(async () => {
    if(!await showConfirm({
      title: 'Are you sure?',
      message: 'This will reset everything in this browser\'s storage for this site. Are you sure you wish to continue?',
      isYesNo: true
    })) return

    setCharacter(null as any)
    setInventories([])
    setAllQuestProgress([])
    setAllMobProgress([])
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

  //INVENTORY HANDLERS
  const handleAddInventory = useCallback((inventory: Inventory[]) => {
    const newInventories = []
    for(const i of inventory){
      newInventories.push(i)
    }
    for(const i of inventories ?? []){
      newInventories.push(i)
    }
    setInventories(newInventories)
  }, [inventories])

  //SHOPPE HANDLERS
  const handleShoppeConfirmation = useCallback(async (cartItems: ShoppeCartItem[]) => {
    const {
      backpack,
      currency,
      txnMessages
    } = shoppeServiceConfirmCart(
      cartItems,
      characterInventories ?? [],
      character as Character
    )

    if(!backpack || !currency){
      return
    }

    const newAllInventories = []
    for(const inv of inventories ?? []){
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
    addNotification(`Shoppe Transaction Complete`)
  }, [inventories, characterInventories, character])

  //TAVERN HANDLERS
  const handleTavernItemStart = useCallback(async (goldCost: number) =>{
    const {
      currency
    } = tavernServiceItemStart(
      goldCost,
      characterInventories ?? [],
      character as Character
    )

    if(!currency) return

    const newInv = []
    for(const inv of inventories ?? []){
      if(inv.id === currency?.id){
        newInv.push({...currency})
      } else {
        newInv.push(inv)
      }
    }
    setInventories(newInv)
  }, [inventories, characterInventories, character])

  const handleTavernItemComplete = useCallback(async (percentChange: number) => {
    const {
      newCharacter
    } = tavernServiceItemComplete(
      character as Character,
      percentChange
    )
    if(!newCharacter) return
    setCharacter({...newCharacter as Character})
  }, [character])

  const handleProfessionItemComplete = useCallback(async (professionItemId: string, amount: number) => {
    const professionItem = items.find(i => i.id === professionItemId)
    if(!professionItem) return

    const {
      inventoryRef,
      professionStat,
      staminaStat
    } = professionServiceItemComplete(
      characterInventories ?? [],
      character as Character,
      professionItem as Item,
      amount
    )
    if(!inventoryRef || !professionStat || !staminaStat){
      return
    }

    const newAllInventories = []
    for(const inv of inventories ?? []){
      if(inv.id === inventoryRef.id){
        newAllInventories.push(inventoryRef)
      } else {
        newAllInventories.push(inv)
      }
    }
    setInventories(newAllInventories)
    const newCharacter = {...character as Character}
    //@ts-ignore
    newCharacter.professions[professionItem.profession?.type] = professionStat
    newCharacter.stats.stamina = staminaStat
    setCharacter({...newCharacter})
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
            quantity: r.itemAmount as number
          })
          questRewardMessages.push(`Quest Reward: ${r.itemAmount?.toLocaleString()} gold received!`)
        } else {
          backpack.transactions.push({
            id: `invtxn__${r.itemId}__${questProgress?.questProgress?.characterId}__${DateTime.utc().toMillis()}`,
            date: DateTime.utc().toISO(),
            itemId: r.itemId as string,
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
            quantity: (req.itemAmount * -1) as number
          })
        }
      }
    }

    //all inv
    const allInv = []
    for(const inv of inventories ?? []){
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
      const newCharacter = characterServiceModifyStats({...character as Character}, totalXp, 0)
      
      setCharacter({...newCharacter} as Character)
      questRewardMessages.push(`Quest Reward: ${totalXp?.toLocaleString()} XP received!`)
    }

    const newQuestProgress: QuestProgress = {
      ...progress as QuestProgress,
      status: 'complete',
      endDate: DateTime.utc().toISO()
    }

    const newProgress = []
    for(const p of allQuestProgress ?? []){
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

  const handleHuntingMobTick = useCallback((mobDamage: number) => {
    setCharacter(prev => {
      if (!prev) return prev

      const hp = Math.max(
        0,
        (prev.stats.hp?.value ?? 0) - mobDamage
      )

      return {
        ...prev,
        stats: {
          ...prev.stats,
          hp: {
            ...prev.stats.hp,
            value: hp
          }
        }
      }
    })
  }, [setCharacter])

  const handleHuntingMobComplete = useCallback(async (mobId: string, xpGained: number, characterId: string, loot: Loot[]) => {
    if(!inventories) return
    const mobStaminaDrain = -5
    setCharacter(prev => {
      if (!prev) return prev
      return characterServiceModifyStats(prev, xpGained, mobStaminaDrain)
    })

    const mob = mobs.find(m => m.id === mobId)
    if (!mob) return

    const now = DateTime.utc()
    const timeId = now.toMillis()

    const updatedInventories = inventories.map(inv => {
      if(inv.characterId !== characterId){
        return inv
      }
      
      if (inv.title !== 'Backpack' && inv.title !== 'Currency') {
        return inv
      }

      const isCurrency = inv.title === 'Currency'
      const updatedTransactions = [...inv.transactions]

      for (const lootItem of loot) {
        if (isCurrency && lootItem.itemId === ITEM_CURRENCY_IDS.GOLD) {
          updatedTransactions.push({
            id: `invtxn__${lootItem.itemId}__${mobId}__${timeId}`,
            date: now.toISO(),
            itemId: lootItem.itemId,
            quantity: lootItem.itemAmount
          })
        }

        if (!isCurrency && lootItem.itemId !== ITEM_CURRENCY_IDS.GOLD) {
          updatedTransactions.push({
            id: `invtxn__${lootItem.itemId}__${mobId}__${timeId}`,
            date: now.toISO(),
            itemId: lootItem.itemId,
            quantity: lootItem.itemAmount
          })
        }
      }

      return {
        ...inv,
        transactions: updatedTransactions
      }
    })

    setInventories(updatedInventories)

    const characterQuestInProgress = allQuestsWithQuestProgress?.find(
      cqp => cqp.questProgress?.status === 'in-progress'
    )

    let mobQuestProgressId: string | undefined = undefined

    const quest = characterQuestInProgress?.quest
    const progress = characterQuestInProgress?.questProgress

    if (quest && progress) {
      for (const req of quest.completionRequirements ?? []) {
        if (req.mobId !== mobId || typeof req.mobAmount !== 'number') continue
        const thisQuestMobsProgressAmount = allMobProgress?.filter(mp => mp.characterId === characterId && mp.questProgressId === progress.id)?.length ?? 0

        if (thisQuestMobsProgressAmount < req.mobAmount) {
          mobQuestProgressId = progress.id
          break
        }
      }
    }

    const newMobProgress: MobProgress = {
      id: `mobprog__${mobId}__${characterId}__${DateTime.utc().toISO()}`,
      characterId,
      defeatedDate: DateTime.utc().toISO(),
      mobId,
      questProgressId: mobQuestProgressId
    }

    const newProgress = []
    newProgress.push(newMobProgress)
    for(const p of allMobProgress ?? []){
      newProgress.push(p)
    }
    setAllMobProgress(newProgress)
  }, [setCharacter, mobs, items, inventories, allMobProgress, allQuestsWithQuestProgress])

  const applyConsumableStats = (prev: Character, item: Item): Character => {
    const stats = item.stats
    const newStats = { ...prev.stats }

    if (stats.hp?.value) {
      newStats.hp = {
        ...newStats.hp,
        value: Math.min(
          newStats.hp?.max ?? Infinity,
          (newStats.hp?.value ?? 0) + stats.hp.value
        )
      }
    }

    if (stats.mp?.value) {
      newStats.mp = {
        ...newStats.mp,
        value: Math.min(
          newStats.mp?.max ?? Infinity,
          (newStats.mp?.value ?? 0) + stats.mp.value
        )
      }
    }

    if (stats.stamina?.value) {
      newStats.stamina = {
        ...newStats.stamina,
        value: Math.min(
          newStats.stamina?.max ?? Infinity,
          (newStats.stamina?.value ?? 0) + stats.stamina.value
        )
      }
    }

    return {
      ...prev,
      stats: newStats
    }
  }

  const useConsumable = async (item: Item, characterId: string) => {
    if (!character) return

    const stats = item.stats ?? {}

    const willHaveEffect = Object.entries(stats).some(([key, stat]) => {
      const charStat = (character.stats as any)[key]

      if (!stat?.value || !charStat) return false

      const max = charStat.max ?? 0
      const value = charStat.value ?? 0

      return value < max
    })

    // 🔥 SKIP IF NOTHING WOULD CHANGE
    if (!willHaveEffect) {
      await showConfirm({
        isYesNo: false,
        title: `Stats Full`,
        message: `${character.name} decided not to use ${item.name} as it will have no affect.`
      })
      return
    }

    setCharacter(prev => {
      if (!prev) return prev
      return applyConsumableStats(prev, item)
    })

    const updatedInventories = inventories?.map(inv => {
      if (inv.characterId !== characterId) return inv
      if (inv.title !== 'Backpack') return inv

      const existingIndex = inv.transactions.findIndex(
        t => t.itemId === item.id
      )

      if (existingIndex === -1) return inv

      const updatedTransactions = [...inv.transactions]

      const existing = updatedTransactions[existingIndex]

      const newQty = (existing.quantity ?? 0) - 1

      if (newQty <= 0) {
        updatedTransactions.splice(existingIndex, 1)
      } else {
        updatedTransactions[existingIndex] = {
          ...existing,
          quantity: newQty
        }
      }

      return {
        ...inv,
        transactions: updatedTransactions
      }
    })

    setInventories(updatedInventories)
  }

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
    characterGold: characterServiceGetItemAmount(characterInventories ?? [], ITEM_CURRENCY_IDS.GOLD),
    characterInventories: inventories,
    characterQuestProgress: characterQuestProgress?.find(cqp => cqp.questProgress?.status === 'in-progress'),
    items,
    questGroups,
    quests,
    allQuestProgress,
    allQuestsWithProgress: allQuestsWithQuestProgress,
    mobs,
    characterMobProgress,
    addNotification,
    useConsumable,
    handleResetEverything,
    handleResetProfession,
    handleAddInventory,
    handleProfessionItemComplete,
    handleTavernItemStart,
    handleTavernItemComplete,
    handleAddQuest,
    handleAbandonQuest,
    handleCompleteQuest,
    handleSetRequestedWindowId: setRequestedWindowId,
    handleSetCharacter: setCharacter,
    setLocation,
    handleShoppeConfirmation,
    handleHuntingMobTick,
    handleHuntingMobComplete
  }

  const appOnSideBar = requestedWindowId === 'character' ? <CharacterInfo {...appProps} showExpander={true} /> :
    requestedWindowId === 'inventory' ? <CharacterInventory {...appProps} /> : 
    requestedWindowId === 'quest' ? <CharacterQuestCurrent {...appProps} /> : <CharacterInfo {...appProps} showExpander={true} />
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
            {...appProps}
            leftChildren={character?.name && appOnSideBar}
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
                  <Route path='/hunting/forest' element={<HuntingForestPage {...appProps} />} />

                </>
              }
              
              <Route path="*" element={<OverviewPage  {...appProps}  />} />
            </Routes>}
          />
          <NotificationList notifications={notifications} />
          <WindowLayer />
        </div>
      </BrowserRouter>
    </WindowProvider>
  );
}

export default App

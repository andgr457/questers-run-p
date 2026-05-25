import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import OverviewPage from './pages/overview/OverviewPage'
import { useConfirm } from './providers/ConfirmProvider';
import AdventurersGuildPage from './pages/adventurers-guild/AdventurersGuildPage';
import { useWindows } from './components/windows/WindowProvider';
import { ScrollToHash } from './components/ScrollToHash';
import NavMenu from './components/nav/NavMenu';
import WindowLayer from './components/windows/WindowLayer';
import type { Character, CharacterAchievements, CharacterClass } from './interfaces/characters/Character.types';
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
import type { QuestWithQuestProgressItem } from './components/quests/CharacterQuests';
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
import { shoppeServiceConfirmCart } from './services/Shoppe.Service';
import { tavernServiceItemComplete, tavernServiceItemStart } from './services/Tavern.Services';
import { characterServiceGetItemAmount, characterServiceHandleXpGain, characterServiceModifyStats } from './services/Character.Service';
import { professionServiceItemComplete } from './services/Profession.Services';
import { type Loot, type Mob, type MobProgress } from './interfaces/mobs/Mob.types';
import { MobRepository } from './repository/mobs/MobsRepository';
import HuntingForestPage from './pages/hunting/HuntingForestPage';
import { GAME_VERSION } from './services/AppService';
import { useFloatingNotifications } from './hooks/useFloatingNotify';
import NotificationList from './components/notifications/NotificationList';
import SettingsPage from './pages/settings/SettingsPage';
import AchievementsList from './components/achievements/AchievementsList';
import { ACHIEVEMENT_GATHERING_IDS } from './data/achievements/Achievements.Gathering.data';
import { ITEM_GATHERING_ITEM_IDS } from './data/items/gathering/Item.Gathering.data';
import { QUEST_PROFESSION_IDS } from './data/quests/Quests.Gathering.data';
import { QUEST_HUNTING_IDS } from './data/quests/Quests.Hunting.data';
import { ACHIEVEMENT_HUNTING_IDS } from './data/achievements/Achievements.Hunting.data';
import { MOB_SLIME_IDS } from './data/mobs/Mobs.Slimes.data';
import { inventoryServiceGetQuestCompletionTransactions, inventoryServiceHandleQuestRewardTransactions } from './services/Inventory.Service';
import { sleep } from './services/CommonServices';

function App() {
  const {showConfirm} = useConfirm()
  const { notifications, addNotification } = useFloatingNotifications()
  const [character, setCharacter] = useLocalStorage<Character | undefined>(
    LOCAL_STORAGE_KEYS.CHARACTERS_MAIN,
    undefined
  )

  useEffect(() => {
    if (!character?.gameVersion) return

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
  }, [character?.gameVersion])

  const [inventories, setInventories] = useLocalStorage<Inventory[]>(LOCAL_STORAGE_KEYS.INVENTORIES, [])
  const [allQuestProgress, setAllQuestProgress] = useLocalStorage<QuestProgress[]>(LOCAL_STORAGE_KEYS.QUEST_PROGRESS, [])
  
  const [allMobProgress, setAllMobProgress] = useLocalStorage<MobProgress[]>(LOCAL_STORAGE_KEYS.MOB_PROGRESS, [])
  
  const [characterClass, setCharacterClass] = useState<CharacterClass | undefined>(undefined)
  const [location, setLocation] = useState('Overview')
  
  const [quests, setQuests] = useState<Quest[]>([])
  const [questGroups, setQuestGroups] = useState<QuestGroup[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  
  const [items, setItems] = useState<Item[]>([])
  const [mobs, setMobs] = useState<Mob[]>([])
  const [requestedWindowId, setRequestedWindowId] = useState<string | undefined>(undefined)

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
      inventories?.filter(i => i.characterId === character?.id) ?? [],
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
  }, [inventories, character])

  //TAVERN HANDLERS
  const handleTavernItemComplete = useCallback(async (percentChange: number, goldCost: number) => {
    const {
      currency
    } = tavernServiceItemStart(
      goldCost,
      inventories?.filter(i => i.characterId === character?.id) ?? [],
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
    
    const {
      newCharacter
    } = tavernServiceItemComplete(
      character as Character,
      percentChange
    )
    if(!newCharacter) return
    setCharacter({...newCharacter as Character})
  }, [character])

  const handleProfessionItemComplete = useCallback(async (professionItem: Item, amount: number) => {
    if(!professionItem) return

    const {
      inventoryRef,
      professionStat,
      staminaStat
    } = professionServiceItemComplete(
      inventories?.filter(i => i.characterId === character?.id) ?? [],
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
    if(professionItem.id === ITEM_GATHERING_ITEM_IDS.STICK && professionItem.profession?.type === 'gathering'){
      if(!newCharacter.achievements.some(a => a.achievementId === ACHIEVEMENT_GATHERING_IDS.STICK_1)){
        newCharacter.achievements.push({
          achievementId: ACHIEVEMENT_GATHERING_IDS.STICK_1,
          achievementDate: DateTime.utc().toISO()
        })
      }
    }
    //@ts-ignore
    newCharacter.professions[professionItem.profession?.type] = professionStat
    newCharacter.stats.stamina = staminaStat
    setCharacter({...newCharacter})
  }, [items, inventories, character])

  const handleAbandonQuest = useCallback(async (questProgressId: string) => {
    const foundProgress = allQuestProgress?.find(p => p?.id === questProgressId)
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
  }, [allQuestProgress])

  const handleAddQuest = useCallback(async (quest: Quest, characterId: string) => {
    if (!quest) return

    setAllQuestProgress(prev => {
      if(!prev) return prev
      const questProgress: QuestProgress = {
        id: `qprogress_${characterId}_${quest.id}_${DateTime.utc().toMillis()}`,
        characterId,
        questId: quest.id,
        startDate: DateTime.utc().toISO(),
        status: 'in-progress'
      }
      return [...prev, questProgress]
    })

    setCharacter(prev => {
      if(!prev) return prev
      let questStamina = 0
      quest.startRequirements.forEach(req => {
        if(req.stats?.stamina){
          questStamina += req.stats.stamina?.value ?? 0
        }
      })
      const newAchievements: CharacterAchievements[] = []
      if(quest.id === QUEST_PROFESSION_IDS.STICKS_N_STONES){
        if(!prev.achievements.find(a => a.achievementId === ACHIEVEMENT_GATHERING_IDS.QUEST_TAKE_STICK)){
          newAchievements.push({
            achievementId: ACHIEVEMENT_GATHERING_IDS.QUEST_TAKE_STICK,
            achievementDate: DateTime.utc().toISO()
          })
        }
      }
      if(quest.id === QUEST_HUNTING_IDS.SLIMES_GREEN){
        if(!prev.achievements.find(a => a.achievementId === ACHIEVEMENT_HUNTING_IDS.TAKE_QUEST_SLIME_GREEN_SMALL)){
          newAchievements.push({
            achievementId: ACHIEVEMENT_HUNTING_IDS.TAKE_QUEST_SLIME_GREEN_SMALL,
            achievementDate: DateTime.utc().toISO()
          })
        }
      }
      return {
        ...prev,
        stats: {
          ...prev.stats,
          stamina: {
            ...prev.stats.stamina,
            value: prev.stats.stamina.value - questStamina
          }
        },
        //quest taking achievements
        achievements: [
          ...prev.achievements,
          ...newAchievements
        ]
      }
    })
  }, [
    setAllQuestProgress, 
    setCharacter
  ])

  const handleCompleteQuest = useCallback(async (progressItem: QuestWithQuestProgressItem) => {
    if(!progressItem || progressItem.canCompleteQuest === false) return
    
    //add quest reward gold and items
    setInventories(prev => {
      if(!prev) return prev

      return prev.map(inv => {
        const charId = progressItem.questProgress?.characterId
        if(!charId) return inv

        if(inv.characterId !== charId){
          return inv
        }        

        if(inv.title === 'Currency'){
          return {
            ...inv,
            transactions: [
              ...inventoryServiceHandleQuestRewardTransactions(
                charId,
                progressItem.questRewardItems,
                'Currency'
              ),
              ...inv.transactions
            ]
          }
        }
        if(inv.title === 'Backpack'){
          return {
            ...inv,
            transactions: [
              ...inventoryServiceGetQuestCompletionTransactions(
                charId,
                progressItem.completionRequirements
              ),
              ...inventoryServiceHandleQuestRewardTransactions(
                charId,
                progressItem.questRewardItems,
                'Backpack'
              ),
              ...inv.transactions
            ]
          }
        }

        return inv
      })
    })

    //update quest progress to complete
    setAllQuestProgress(prev => {
      if(!prev) return prev

      return prev.map(aqp => {
        if(aqp.id === progressItem.questProgress?.id){
          return {
            ...aqp,
            endDate: DateTime.utc().toISO(),
            status: 'complete'
          }
        }
        return aqp
      })
    })

    //Add any quest complete achievements and XP to character
    setCharacter(prev => {
      if(!prev) return prev

      if(!progressItem || 
        !progressItem.questRewardItems || 
        progressItem.questRewardItems.length === 0
      ) return prev

      let xp = 0
      const newAchievements: CharacterAchievements[] = []
      progressItem.questRewardItems.forEach(reward => {
        if(reward.achivementId){
          newAchievements.push({
            achievementId: reward.achivementId,
            achievementDate: DateTime.utc().toISO()
          })
        }
        if(typeof reward.xp === 'number'){
          xp += reward.xp
        }
      })

      const updatedCharacter = characterServiceHandleXpGain({
        character: prev,
        xp,
      })
      return {
        ...updatedCharacter,
        
        achievements: [
          ...updatedCharacter.achievements,
          ...newAchievements
        ]
      }
    })

    await showConfirm({
      title: `Quest Completed!`,
      message: `Congratulations! Quest ${progressItem.quest.title} complete.`,
      isYesNo: false,
    })
  
    for(const req of progressItem.completionRequirements){
      if(req.itemId){
        addNotification(`-${req.itemAmount} ${req.itemName}`)
        await sleep(500)
      }
    }
    for(const reward of progressItem.questRewardItems){
      if(reward.itemId){
        addNotification(`+${reward.itemAmount} ${reward.itemName}`)
        await sleep(500)
      }
      if(reward.achivementId){
        addNotification(`Achivement Earned: ${reward.achievementTitle}`)
        await sleep(500)
      }
      if(reward.xp){
        addNotification(`+${reward.xp} XP`)
        await sleep(500)
      }
    }

  }, [
    setInventories,
    setAllQuestProgress,
    setCharacter,
  ])

  //Working
  const handleHuntingMobComplete = useCallback(async (
    mob: Mob,
    characterId: string,
    loot: Loot[],
    currentCharHp: number,
    characterPassedOut: boolean
  ) => {
    if(characterPassedOut){
      setCharacter(prev => {
        if(!prev) return

        return {
          ...prev,
          stats: {
            ...prev.stats,
            hp: {
              ...prev.stats.hp,
              value: 0
            },
            stamina: {
              ...prev.stats.stamina,
              value: 0
            }
          }
        }
      })
      addNotification(`${character?.name} was defeated by a Lv. ${mob?.level} ${mob?.name}!`)
      return
    }

    for(const lootItem of loot){
      addNotification(`+${lootItem.itemAmount} ${lootItem.item?.name}`)
      await sleep(500)
    }
    const mobStaminaDrain = mob.level * -1
    addNotification(`${mobStaminaDrain} Stamina`)
    await sleep(500)
    addNotification(`+${mob.xp} XP`)

    setCharacter(prev => {
      if (!prev) return prev

      const mobStaminaDrain = mob.level * -1

      let updatedCharacter = characterServiceModifyStats(
        prev,
        mob.xp,
        mobStaminaDrain,
        currentCharHp
      )


      if (
        mob.id === MOB_SLIME_IDS.GREEN_SMALL &&
        !updatedCharacter.achievements?.some(
          a => a.achievementId === ACHIEVEMENT_HUNTING_IDS.SLIME_GREEN_SMALL_1
        )
      ) {
        updatedCharacter = {
          ...updatedCharacter,
          achievements: [
            ...(updatedCharacter.achievements ?? []),
            {
              achievementId: ACHIEVEMENT_HUNTING_IDS.SLIME_GREEN_SMALL_1,
              achievementDate: DateTime.utc().toISO()
            }
          ]
        }
      }

      return updatedCharacter
    })

    setInventories(prev => {
      if (!prev) return prev

      return prev.map(inv => {
        if (inv.characterId !== characterId) {
          return inv
        }

        if (inv.title !== 'Backpack' && inv.title !== 'Currency') {
          return inv
        }

        const now = DateTime.utc()
        const timeId = now.toMillis()

        const isCurrency = inv.title === 'Currency'

        const newTransactions = loot
          .filter(lootItem =>
            isCurrency
              ? lootItem.itemId === ITEM_CURRENCY_IDS.GOLD
              : lootItem.itemId !== ITEM_CURRENCY_IDS.GOLD
          )
          .map(lootItem => ({
            id: `invtxn__${lootItem.itemId}__${mob.id}__${timeId}`,
            date: now.toISO(),
            itemId: lootItem.itemId,
            quantity: lootItem.itemAmount
          }))

        return {
          ...inv,
          transactions: [
            ...inv.transactions,
            ...newTransactions
          ]
        }
      })
    })

    setAllMobProgress(prev => {
      if (!prev) return prev

      const characterQuestInProgress = allQuestProgress?.find(
        cqp =>
          cqp.status === 'in-progress' &&
          cqp.characterId === characterId
      )

      let mobQuestProgressId: string | undefined = undefined

      if (characterQuestInProgress) {
        const relatedQuest = quests.find(
          q => q.id === characterQuestInProgress.questId
        )

        for (const req of relatedQuest?.completionRequirements ?? []) {
          if (req.mobId !== mob.id || typeof req.mobAmount !== 'number') {
            continue
          }

          const thisQuestMobsProgressAmount =
            prev.filter(
              mp =>
                mp.characterId === characterId &&
                mp.questProgressId === characterQuestInProgress.id
            ).length

          if (thisQuestMobsProgressAmount < req.mobAmount) {
            mobQuestProgressId = characterQuestInProgress.id
            break
          }
        }
      }

      const newMobProgress: MobProgress = {
        id: `mobprog__${mob.id}__${characterId}__${DateTime.utc().toISO()}`,
        characterId,
        defeatedDate: DateTime.utc().toISO(),
        mobId: mob.id,
        questProgressId: mobQuestProgressId
      }

      return [...prev, newMobProgress]
    })


  }, [
    setAllMobProgress,
    setInventories,
    setCharacter,
    allQuestProgress,
    quests,
  ])

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
      addNotification(`+${stats.hp.value} HP`)
    }

    if (stats.mp?.value) {
      newStats.mp = {
        ...newStats.mp,
        value: Math.min(
          newStats.mp?.max ?? Infinity,
          (newStats.mp?.value ?? 0) + stats.mp.value
        )
      }
      addNotification(`+${stats.mp.value} MP`)

    }

    if (stats.stamina?.value) {
      newStats.stamina = {
        ...newStats.stamina,
        value: Math.min(
          newStats.stamina?.max ?? Infinity,
          (newStats.stamina?.value ?? 0) + stats.stamina.value
        )
      }
      addNotification(`+${stats.stamina.value} STAM`)

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

  const {
    windows,
    openWindow,
    closeWindow
  } = useWindows()

  const isWindowOpen = (id: string) => {
    return windows.some(w => w.id === id)
  }

  function toggleWindow(
    id: string,
    title: string,
    Component: React.ComponentType<any>,
    props?: any
  ) {
    if (isWindowOpen(id)) {
      closeWindow(id)
      return
    }
    openWindow(id, title, Component, {...props})
  }
  const characterInventories = inventories?.filter(i => i.characterId === character?.id) ?? []
  const characterMobProgress = allMobProgress?.filter(amp => amp.characterId === character?.id)
  const appProps: AppProperties = {
    achievements,
    location,
    character: character as Character,
    characterClass: characterClass as CharacterClass,
    characterGold: characterServiceGetItemAmount(characterInventories, ITEM_CURRENCY_IDS.GOLD),
    characterInventories: inventories,
    items,
    questGroups,
    quests,
    allQuestProgress,
    mobs,
    characterMobProgress,
    allInventories: inventories,
    allMobProgress,
    closeWindow,
    toggleWindow,
    showConfirm,
    addNotification,
    useConsumable,
    handleResetEverything,
    handleResetProfession,
    handleAddInventory,
    handleProfessionItemComplete,
    handleTavernItemComplete,
    handleAddQuest,
    handleAbandonQuest,
    handleCompleteQuest,
    handleSetRequestedWindowId: setRequestedWindowId,
    handleSetCharacter: setCharacter,
    setLocation,
    handleShoppeConfirmation,
    handleHuntingMobComplete
  }

  const appOnSideBar = requestedWindowId === 'character' ? <CharacterInfo {...appProps} showExpander={true} /> :
    requestedWindowId === 'inventory' ? <CharacterInventory {...appProps} /> : 
    requestedWindowId === 'achievements' ? <AchievementsList {...appProps} /> : 
    requestedWindowId === 'settings' ? <SettingsPage {...appProps}/> : <CharacterInfo {...appProps} showExpander={true} />


  return (<BrowserRouter>

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
              <Route path='/town/tavern' element={<TavernPage {...appProps} />} />
              <Route path='/town/shoppe' element={<ShoppePage {...appProps} />} />
              <Route path='/town/adventurers-guild' element={<AdventurersGuildPage {...appProps} />} />
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
      <WindowLayer {...appProps}  />
    </div>
  </BrowserRouter>
  );
}

export default App

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import GuildPage from './pages/guild/GuildPage';
import OverviewPage from './pages/overview/OverviewPage'
import { useConfirm } from './providers/ConfirmProvider';
import QuestsPage from './pages/quests/QuestsPage';
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
import type { CharacterHistory } from './interfaces/history/History.types';
import type { Quest, QuestGroup, QuestProgress } from './interfaces/quests/Quests.types';
import type { Item } from './interfaces/items/Item.types';
import { CharacterClassRepository } from './repository/characters/CharacterClassRepository';
import { ItemRepository } from './repository/items/ItemRepository';
import { QuestRepository } from './repository/quests/QuestRepository';
import { QuestGroupRepository } from './repository/quests/QuestGroupRepository';
import { DateTime } from 'luxon';
import { ITEM_CURRENCY_IDS } from './data/items/currency/Item.Currency.data';
import type { AppProperties } from './interfaces/AppProperties.types';
import CharacterInfoMiniBar from './components/characters/CharacterInfoMiniBar';
import type { QuestWithQuestProgress } from './components/quests/CharacterQuests';
import { QuestService } from './services/quests/QuestService';
import './form-controls.css'
import { AchievementRepository } from './repository/achievements/AchievementRepository';
import type { Achievement } from './interfaces/achievements/Achievement.types';
import ProfessionGatheringPage from './pages/professions/ProfessionsGatheringPage';

function App() {
  const [location, setLocation] = useState('Overview')
  const [character, setCharacter] = useLocalStorage<Character | undefined>(LOCAL_STORAGE_KEYS.CHARACTERS_MAIN, undefined)
  const [characterClass, setCharacterClass] = useState<CharacterClass | undefined>(undefined)
  const [characterInventories, setCharacterInventories] = useState<Inventory[] | undefined>(undefined)
  const [inventories, setInventories] = useLocalStorage<Inventory[]>(LOCAL_STORAGE_KEYS.INVENTORIES, [])
  const [history, setHistory] = useLocalStorage<CharacterHistory[]>(LOCAL_STORAGE_KEYS.HISTORY, [])
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
    setHistory([])
    setAllQuestProgress([])
    window.location.href = '/'
  }, [])

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

  const handleAddHistory = useCallback(async (newHistory: CharacterHistory[]) => {
    const histories = []
    for(const h of newHistory){
      histories.push(h)
    }
    for(const h of history){
      histories.push(h)
    }
    setHistory(histories)
  }, [history])

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
  }, [items, characterInventories, inventories])

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
    const characterProgress = characterQuestProgress?.find(qp => qp.quest.id === quest.id && qp.questProgress?.characterId === characterId)

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
    const newHistory: CharacterHistory[] = []
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
          newHistory.push({
            id: `h_${character?.id}_${questProgress.quest.id}_${r.itemId}_${DateTime.utc().toMillis()}`,
            characterId: character?.id as string,
            date: DateTime.utc().toISO(),
            description: `Quest Reward: ${r.itemAmount?.toLocaleString()} gold received!`,
          })
        } else {
          backpack.transactions.push({
            id: `invtxn__${r.itemId}__${questProgress?.questProgress?.characterId}__${DateTime.utc().toMillis()}`,
            date: DateTime.utc().toISO(),
            itemId: r.itemId as string,
            note: 'Item Quest Reward',
            quantity: r.itemAmount as number
          })
          const item = items.find(i => i.id === r.itemId)
          newHistory.push({
            id: `h_${character?.id}_${questProgress.quest.id}_${r.itemId}_${DateTime.utc().toMillis()}`,
            characterId: character?.id as string,
            date: DateTime.utc().toISO(),
            description: `Quest Reward: ${r.itemAmount?.toLocaleString()} ${item?.name} received!`,
          })
        }
      } else if(r.xp){
        totalXp += r.xp
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
      let prevXp = newCharacter.xp
      if(!prevXp){
        prevXp = 0
      }

      newCharacter.xp = prevXp + totalXp
      setCharacter({...newCharacter} as Character)
      newHistory.push({
        id: `h_${character?.id}_${questProgress.quest.id}_xp_${DateTime.utc().toMillis()}`,
        characterId: character?.id as string,
        date: DateTime.utc().toISO(),
        description: `Quest Reward: ${newCharacter.xp?.toLocaleString()} XP received!`,
      })
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
    newHistory.push({
      id: `h_${character?.id}_${questProgress.quest.id}_questcomplete_${DateTime.utc().toMillis()}`,
      characterId: character?.id as string,
      date: DateTime.utc().toISO(),
      description: `Quest Completed: ${questProgress.quest.title}!`,
    })
    
    const message = []
    for(const h of newHistory){
      message.push(<div>
        {h.description}
      </div>)
    }

    for(const h of history){
      newHistory.push(h)
    }
    setHistory(newHistory)

    await showConfirm({
      title: `Quest Completed!`,
      message: `Contratulations on completing a quest! You've received the following rewards.`,
      isYesNo: false,
      content: <div style={{textAlign: 'center', width: '100%'}}>
        {message}
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
    history,
    allQuestsWithProgress: allQuestsWithQuestProgress,
    
    handleAddHistory,
    handleAddInventory,
    handleDoProfessionItemComplete,
    handleAddQuest,
    handleAbandonQuest,
    handleCompleteQuest,
    handleResetEverything,
    handleSetRequestedWindowId: setRequestedWindowId,
    handleSetCharacter: setCharacter,
    setLocation
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
          {character?.name && 
          <div>
            <CharacterInfoMiniBar 
              {...appProps}
            />
          </div>}
          <div className='app-main'>
              <Routes>
                <Route path="/" element={<OverviewPage {...appProps} />} />
                {character?.name}{
                  <>
                    <Route path='/town' element={<TownPage />} />
                    <Route path='/guild' element={<GuildPage />} />
                    <Route path='/quests' element={<QuestsPage />} />
                    <Route path='/adventurers-guild' element={<AdventurersGuildPage {...appProps} />} />
                    <Route path='/profession/gathering' element={<ProfessionGatheringPage {...appProps} />} />

                  </>
                }
                
                <Route path="*" element={<OverviewPage  {...appProps}  />} />
              </Routes>
          </div>
          <WindowLayer />
        </div>
      </BrowserRouter>
    </WindowProvider>
  );
}

export default App

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './NavMenu.css'
import { useWindows } from '../windows/WindowProvider';
import CharacterInfo from '../characters/CharacterInfo';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import CharacterQuestCurrent from '../quests/CharacterQuestCurrent';
import CharacterInventory from '../inventory/CharacterInventory';
import Settings from '../settings/Settings';

interface NavMenuProps extends AppProperties {
  windowRequestId?: string
}

export default function NavMenu(props: NavMenuProps) {
  const [subNavSelected, setSubNavSelected] = useState('town')
  const {
    windowRequestId,
    character
  } = props

  const characterNotExists = !character?.name

  const {
    windows,
    openWindow,
    closeWindow
  } = useWindows()
  const navigate = useNavigate()

  useEffect(() => {
    if(!windowRequestId) return
    if(windowRequestId === 'character'){
      toggleCharacter()
    } else if(windowRequestId === 'inventory'){
      toggleInventory()
    } else if(windowRequestId === 'quest'){
      toggleQuest()
    } else if(windowRequestId === 'settings'){
      toggleSettings()
    }

  }, [windowRequestId])

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


  function toggleCharacter() {
    toggleWindow('character', 'Character', <CharacterInfo 
      {...props}
    />)
  }

  function toggleQuest() {
    toggleWindow('quest', 'Current Quest', <CharacterQuestCurrent 
      {...props}
      
    />)
  }

  function toggleInventory() {
    toggleWindow('inventory', 'Inventory', <CharacterInventory 
      {...props}
    />)
  }

  function toggleSettings() {
    toggleWindow('settings', 'Settings', <Settings 
      {...props}
    />)
  }  
  
  const handleNavigate = async (url: string) => {
    // setSubNavSelected('')
    // if(['/adventurers-guild'].includes(url)){
    //   await new Promise(resolve => setTimeout(resolve, 500))
    // }
    navigate(url)
  }

  const townItems = [
    { title: 'Overview', navTo: '/' },
    { title: `Adventurer's Guild`, navTo: '/adventurers-guild' },
    { title: `Tavern`, navTo: '/tavern' },
  ]

  const professionItems = [
    { title: 'Gathering', navTo: '/profession/gathering' },
    { title: 'Fishing', navTo: '/profession/fishing' },
    { title: 'Cooking', navTo: '/profession/cooking' },
    { title: 'Mining', navTo: '/profession/mining' },
  ]

  const divider = <div className='nav-divider'>|</div>
  return (
    <div >
      <div className='nav flex-wrap gap-1' >
        <div 
          className='nav-item' 
          onClick={() => {handleNavigate('/')}}
        >
          Quester's Run
        </div>
        
        {characterNotExists === false && <>
                  {divider}
          <div className='flex-wrap gap-2'>
            <div className={`nav-item ${
              subNavSelected === 'town'
                  ? 'active'
                  : ''
              }`}
              onMouseEnter={() => {setSubNavSelected('town')}}
              onClick={() => {setSubNavSelected('town')}}
            >
              Town
            </div>
          </div>
          {divider}
          <div className='flex-wrap gap-2'>
            <div className={`nav-item ${
              subNavSelected === 'profession'
                  ? 'active'
                  : ''
              }`}
              onMouseEnter={() => {setSubNavSelected('profession')}}
              onClick={() => {setSubNavSelected('profession')}}
            >
              Professions
            </div>
          </div>
          {divider}
          <div className='flex-wrap gap-2'>
            <div className={`nav-item window-button ${
              isWindowOpen('character')
                ? 'active'
                : ''
            }`}
            onClick={toggleCharacter}
            >
              Character
            </div>
          </div>
          {divider}
          <div className='flex-wrap gap-2'>
            <div className={`nav-item window-button ${
              isWindowOpen('inventory')
                ? 'active'
                : ''
            }`}
            onClick={toggleInventory}
            >
              Inventory
            </div>
          </div>
          {divider}
          <div className='flex-wrap gap-2'>
            <div className={`nav-item window-button ${
              isWindowOpen('quest')
                ? 'active'
                : ''
            }`}
            onClick={toggleQuest}
            >
              Quest
            </div>
          </div>
          {divider}
          <div className='flex-wrap gap-2'>
            <div className={`nav-item window-button ${
              isWindowOpen('settings')
                ? 'active'
                : ''
            }`}
            onClick={toggleSettings}
            >
              Settings
            </div>
          </div>
        </>
        }
      </div>
      
      {/* travel sub items */}
      <div className={`nav-sub-items ${subNavSelected === 'town' ? 'open' : ''}`}>
        {townItems.map(i => {
          const path = window.location.href.replace(window.location.origin, '')
          return <div
          onClick={() => {handleNavigate(i.navTo)}}
            className={`nav-item ${
              path === i.navTo
                  ? 'active'
                  : ''
              }`}
          >
            {i.title}
          </div>
        })}
        
      </div>

      {/* profession sub items */}
      <div className={`nav-sub-items ${subNavSelected === 'profession' ? 'open' : ''}`}>
         {professionItems.map(i => {
          const path = window.location.href.replace(window.location.origin, '')
          return <div
          onClick={() => {handleNavigate(i.navTo)}}
            className={`nav-item ${
              path === i.navTo
                  ? 'active'
                  : ''
              }`}
          >
            {i.title}
          </div>
        })}
      </div>
    </div>
  );
}
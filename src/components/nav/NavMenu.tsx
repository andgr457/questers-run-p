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
  const [subNavSelected, setSubNavSelected] = useState('')
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
    setSubNavSelected('')
    // if(['/adventurers-guild'].includes(url)){
    //   await new Promise(resolve => setTimeout(resolve, 500))
    // }
    navigate(url)
  }

  const divider = <div className='nav-divider'>|</div>
  return (
    <div onMouseLeave={() => {setSubNavSelected('')}}>
      <div className='nav flex-wrap gap-1' >
        <div 
          className='nav-item' 
          onMouseEnter={() => {setSubNavSelected('')}}
          onClick={() => {handleNavigate('/')}}
        >
          Quester's Run
        </div>
        
        {characterNotExists === false && <>
                  {divider}
          <div className='flex-wrap gap-2'>
            <div className='nav-item' 
              onMouseEnter={() => {setSubNavSelected('town')}}
              onClick={() => {setSubNavSelected(subNavSelected === 'town' ? '' : 'town')}}
            >
              Town
            </div>
          </div>
          {divider}
          <div className='flex-wrap gap-2'>
            <div className='nav-item' 
              onMouseEnter={() => {setSubNavSelected('profession')}}
              onClick={() => {setSubNavSelected(subNavSelected === 'profession' ? '' : 'profession')}}
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
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/')}}
        >
          Overview
        </div>
        {divider}
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/guild')}}
        >
          Guild
        </div>
        {divider}
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/adventurers-guild')}}
        >
          Adventurer's Guild
        </div>
        {divider}
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/tavern')}}
        >
          Tavern
        </div>
        {divider}
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/blacksmith')}}
        >
          Blacksmith
        </div>
        {divider}
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('alchemist')}}
        >
          Alchemist
        </div>
      </div>

      {/* profession sub items */}
      <div className={`nav-sub-items ${subNavSelected === 'profession' ? 'open' : ''}`}>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/profession/fishing')}}
        >
          Fishing
        </div>
        {divider}
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/profession/cooking')}}
        >
          Cooking
        </div>
        {divider}
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/profession/mining')}}
        >
          Mining
        </div>
        {divider}
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/profession/gathering')}}
        >
          Gathering
        </div>
      </div>
    </div>
  );
}
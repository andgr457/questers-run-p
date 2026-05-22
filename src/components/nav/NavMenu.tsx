import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './NavMenu.css'
import { useWindows } from '../windows/WindowProvider';
import CharacterInfo from '../characters/CharacterInfo';
import type { AppProperties } from '../../interfaces/AppProperties.types';
import CharacterQuestCurrent from '../quests/CharacterQuestCurrent';
import CharacterInventory from '../inventory/CharacterInventory';
import Settings from '../settings/Settings';
import { useIsMobile } from '../../hooks/useIsMobile';
import AchievementsList from '../achievements/AchievementsList';

interface NavMenuProps extends AppProperties {
  windowRequestId?: string
}

export default function NavMenu(props: NavMenuProps) {
  
  const {
    character,
    windowRequestId,
    handleSetRequestedWindowId
  } = props
  const [subNavSelected, setSubNavSelected] = useState('town')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isMobile = useIsMobile()
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
    if(isMobile){
      toggleWindow('character', 'Character', <CharacterInfo 
        {...props}
        showExpander={false}
      />)
      return
    }
    handleSetRequestedWindowId?.('character')
  }

  function toggleQuest() {
    if(isMobile){
      toggleWindow('quest', 'Current Quest', <CharacterQuestCurrent 
        {...props}
        
      />)
      return
    }
    handleSetRequestedWindowId?.('quest')
  }

  function toggleInventory() {
    if(isMobile){
      toggleWindow('inventory', 'Inventory', <CharacterInventory 
        {...props}
      />)
      return
    }
    handleSetRequestedWindowId?.('inventory')
  }

  function toggleSettings() {
    toggleWindow('settings', 'Settings', <Settings 
      {...props}
    />)
  }  

  function toggleAchievements() {
    toggleWindow('achievements', 'Achievements', <AchievementsList 
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

  let townItems = [
    { title: 'Overview', navTo: '/' },
    { title: `Adventurer's Guild`, navTo: '/adventurers-guild' },
    { title: `Tavern`, navTo: '/tavern' },
    { title: `Shoppe`, navTo: '/shoppe' },
  ]

  let professionItems = [
    { title: 'Gathering', navTo: '/profession/gathering' },
    { title: 'Fishing', navTo: '/profession/fishing' },
    { title: 'Mining', navTo: '/profession/mining' },
  ]

  let huntingItems = [
    { title: 'Forest', navTo: '/hunting/forest' },
  ]

  if(characterNotExists){
    townItems = [{ title: 'Overview', navTo: '/' }]
    professionItems = []
    huntingItems = []
  }

  const divider = <div className='nav-divider'>|</div>
  return (
    <div >
      <div className='nav flex-wrap gap-1'>
        <div
          className='nav-item'
          style={{background: 'transparent'}}
          onClick={() => {
            handleNavigate('/')
            setMobileMenuOpen(false)
          }}
        >
          Quester's Run
        </div>

        {/* mobile hamburger */}
        {characterNotExists === false && (
          <div
            className='hamburger'
            onClick={() => {
              setMobileMenuOpen(prev => !prev)
            }}
          >
            ☰
          </div>
        )}

        {/* desktop nav */}
        {characterNotExists === false && (
          <div className='desktop-nav'>
            {divider}

            <div className='flex-wrap gap-2'>
              <div
                className={`nav-item ${
                  subNavSelected === 'town' ? 'active' : ''
                }`}
                onMouseEnter={() => {
                  setSubNavSelected('town')
                }}
                onClick={() => {
                  setSubNavSelected('town')
                }}
              >
                Town
              </div>
            </div>

            {divider}

            <div className='flex-wrap gap-2'>
              <div
                className={`nav-item ${
                  subNavSelected === 'profession'
                    ? 'active'
                    : ''
                }`}
                onMouseEnter={() => {
                  setSubNavSelected('profession')
                }}
                onClick={() => {
                  setSubNavSelected('profession')
                }}
              >
                Professions
              </div>
            </div>

            {divider}

            <div className='flex-wrap gap-2'>
              <div
                className={`nav-item ${
                  subNavSelected === 'hunting'
                    ? 'active'
                    : ''
                }`}
                onMouseEnter={() => {
                  setSubNavSelected('hunting')
                }}
                onClick={() => {
                  setSubNavSelected('hunting')
                }}
              >
                Hunting
              </div>
            </div>

            {divider}

            <div className='flex-wrap gap-2'>
              <div
                className={`nav-item window-button ${
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
              <div
                className={`nav-item window-button ${
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
              <div
                className={`nav-item window-button ${
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
              <div
                className={`nav-item window-button ${
                  isWindowOpen('achievements')
                    ? 'active'
                    : ''
                }`}
                onClick={toggleAchievements}
              >
                Achievements
              </div>
            </div>

            {divider}

            <div className='flex-wrap gap-2'>
              <div
                className={`nav-item window-button ${
                  isWindowOpen('settings')
                    ? 'active'
                    : ''
                }`}
                onClick={toggleSettings}
              >
                Settings
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div
          className='mobile-menu-close'
          onClick={() => setMobileMenuOpen(false)}
        >
          ✕
        </div>

        <div className='mobile-menu-section'>
          <div className='mobile-menu-title'>Town</div>

          {townItems.map(i => (
            <div
              key={i.navTo}
              className='nav-item'
              onClick={() => {
                handleNavigate(i.navTo)
                setMobileMenuOpen(false)
              }}
            >
              {i.title}
            </div>
          ))}
        </div>

        <div className='mobile-menu-section'>
          <div className='mobile-menu-title'>
            Professions
          </div>

          {professionItems.map(i => (
            <div
              key={i.navTo}
              className='nav-item'
              onClick={() => {
                handleNavigate(i.navTo)
                setMobileMenuOpen(false)
              }}
            >
              {i.title}
            </div>
          ))}
        </div>

        <div className='mobile-menu-section'>
          <div className='mobile-menu-title'>
            Hunting
          </div>

          {huntingItems.map(i => (
            <div
              key={i.navTo}
              className='nav-item'
              onClick={() => {
                handleNavigate(i.navTo)
                setMobileMenuOpen(false)
              }}
            >
              {i.title}
            </div>
          ))}
        </div>

        <div className='mobile-menu-section'>
          <div className='mobile-menu-title'>
            Windows
          </div>
          <div className='nav-item' onClick={() => {toggleCharacter(); setMobileMenuOpen(false);}}>
            Character
          </div>

          <div className='nav-item' onClick={() => {toggleInventory(); setMobileMenuOpen(false)}}>
            Inventory
          </div>

          <div className='nav-item' onClick={() => {toggleQuest(); setMobileMenuOpen(false)}}>
            Quest
          </div>

          <div className='nav-item' onClick={() => {toggleAchievements(); setMobileMenuOpen(false)}}>
            Achievements
          </div>

          <div className='nav-item' onClick={() => {toggleSettings(); setMobileMenuOpen(false)}}>
            Settings
          </div>
        </div>
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

      {/* hunting sub items */}
      <div className={`nav-sub-items ${subNavSelected === 'hunting' ? 'open' : ''}`}>
         {huntingItems.map(i => {
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
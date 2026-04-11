import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './NavMenu.css'

export default function NavMenu() {
  const [subNavSelected, setSubNavSelected] = useState('')
  const navigate = useNavigate()
  
  const handleNavigate = (url: string) => {
    setSubNavSelected('')
    navigate(url)
  }

  return (
    <div onMouseLeave={() => {setSubNavSelected('')}}>
      <div className='nav flex-wrap gap-1' >
        <div 
          className='nav-item' 
          style={{fontSize: 'smaller', flex: 'unset'}}
          onMouseEnter={() => {setSubNavSelected('')}}
          onClick={() => {handleNavigate('/home')}}
        >
          Quester's Run
        </div>
        <div className='flex-wrap gap-2'>
          <div className='nav-item' 
            onMouseEnter={() => {setSubNavSelected('travel')}}
            onClick={() => {setSubNavSelected(subNavSelected === 'travel' ? '' : 'travel')}}
          >
            Travel
          </div>
        </div>
        <div className='flex-wrap gap-2'>
          <div className='nav-item' 
            onMouseEnter={() => {setSubNavSelected('profession')}}
            onClick={() => {setSubNavSelected(subNavSelected === 'profession' ? '' : 'profession')}}
          >
            Profession
          </div>
        </div>
        <div 
          className='nav-item'
          onMouseEnter={() => {setSubNavSelected('')}}
          onClick={() => {handleNavigate('/map')}}
        >
          Map
        </div>
        <div 
          className='nav-item'
          onMouseEnter={() => {setSubNavSelected('')}}
          onClick={() => {handleNavigate('/quests')}}
        >
          Quests
        </div>
      </div>
      
      {/* travel sub items */}
      {subNavSelected === 'travel' && <div className='nav-sub-items'>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/home')}}
        >
          Home
        </div>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/guild')}}
        >
          Guild
        </div>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/adventurers-guild')}}
        >
          Adventurers Guild
        </div>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/tavern')}}
        >
          Tavern
        </div>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/blacksmith')}}
        >
          Blacksmith
        </div>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('alchemist')}}
        >
          Alchemist
        </div>
      </div>}

      {subNavSelected === 'profession' && <div className='nav-sub-items'>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/profession/fishing')}}
        >
          Fishing
        </div>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/profession/cooking')}}
        >
          Cooking
        </div>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/profession/mining')}}
        >
          Mining
        </div>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/profession/gathering')}}
        >
          Gathering
        </div>
      </div>}
    </div>
  );
}
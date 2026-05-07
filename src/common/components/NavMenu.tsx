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

  const divider = <div className='nav-divider'>|</div>

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
      </div>
      
      {/* travel sub items */}
      {subNavSelected === 'town' && <div className='nav-sub-items'>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/home')}}
        >
          Home
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
      </div>}
      {/* profession sub items */}
      {subNavSelected === 'profession' && <div className='nav-sub-items'>
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
      </div>}

      {subNavSelected === 'map' && <div className='nav-sub-items'>
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
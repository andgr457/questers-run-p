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
    <div>
      <div className='nav flex-wrap gap-1'>
        <div 
          className='nav-item' 
          style={{fontSize: 'smaller', flex: 'unset'}}
          onClick={() => {handleNavigate('/home')}}
        >
          Quester's Run
        </div>
        <div className='flex-wrap gap-2'>
          <div className='nav-item' onClick={() => {setSubNavSelected(subNavSelected === 'travel' ? '' : 'travel')}}>
            Travel
          </div>
        </div>
        <div className='flex-wrap gap-2'>
          <div className='nav-item' onClick={() => {setSubNavSelected(subNavSelected === 'profession' ? '' : 'profession')}}>
            Profession
          </div>
        </div>
        <div 
          className='nav-item'
          onClick={() => {handleNavigate('/map')}}
        >
          Map
        </div>
      </div>
      
      {/* sub items */}
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
          onClick={() => {handleNavigate('/map')}}
        >
          Professions
        </div>
      </div>}
    </div>
  );
}
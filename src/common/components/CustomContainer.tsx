import { useState } from 'react'
import { AnimatedText } from './AnimatedText'
import './CustomContainer.css'

interface CustomContainerProps {
  title: React.ReactNode
  headerLeft?: React.ReactNode
  description?: string
  expandable: boolean
  isChildCustomContainer: boolean
  children: React.ReactNode
}

export default function CustomContainer(props: CustomContainerProps){
  const [showGroup, setShowGroup] = useState(props.isChildCustomContainer === true ? false : true)
  return <div className='container'>
    <div className={props.isChildCustomContainer === false ? 'container-header' : 'container-header second'} >
      <AnimatedText>
        <span className='container-header-left'>{props.headerLeft}</span>
        {props.expandable === true && <span 
          onClick={() => {setShowGroup(!showGroup)}} 
          className='container-expander'>{showGroup === true ? 'HIDE' : 'SHOW'}</span>} 
        {props.title}
    </AnimatedText>
    </div>
    {showGroup === true && <div className={'container-group'}>
      {props.description && <div className='container-group-description'>
        {props.description}  
      </div>}
      <div className='container-group-items'>
        {props.children}
      </div>
    </div>}
  </div>
}
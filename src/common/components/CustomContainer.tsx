import { useState } from 'react'
import { AnimatedText } from './AnimatedText'
import './CustomContainer.css'

interface CustomContainerProps {
  title: string
  description?: string
  expandable: boolean
  children: React.ReactNode
}

export default function CustomContainer(props: CustomContainerProps){
  const [showGroup, setShowGroup] = useState(true)
  return <div className='container'>
    <div className='container-header' onClick={() => {setShowGroup(!showGroup)}}>
      <AnimatedText><span className='container-expander'>{showGroup === true ? 'HIDE' : 'SHOW'}</span> {props.title}</AnimatedText>
    </div>
    {showGroup === true && <div className={showGroup === true ? 'container-group open' : 'container-group'}>
      {props.description && <div className='container-group-description'>
        {props.description}  
      </div>}
      <div className='container-group-items'>
        {props.children}
      </div>
    </div>}
  </div>
}
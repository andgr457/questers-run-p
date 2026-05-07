import { useEffect, useState } from 'react'
import { AnimatedText } from './AnimatedText'
import './CustomContainer.css'

interface CustomContainerProps {
  title: React.ReactNode
  headerLeft?: React.ReactNode
  description?: string
  expandable: boolean
  expanded?: boolean
  isChildCustomContainer: boolean
  children: React.ReactNode
}

export default function CustomContainer(props: CustomContainerProps){
  const {
    expandable,
    isChildCustomContainer,
    title,
    description,
    headerLeft,
    expanded
  } = props

  if(!['Current Quest', 'Quests'].includes(title as string)){
    console.log(title, 'expandable', expandable, 'expanded', expanded)
  }

  const [showGroup, setShowGroup] = useState(
    expandable === false || (expandable === true && expanded === true)
  )

  useEffect(() => {
    if (expandable) {
      setShowGroup(expanded === true)
    }
  }, [expanded, expandable])



  return (
    <div className='container'>
      <div className='container-header'>
        {headerLeft && (
          <div className='container-header-left'>
            {headerLeft}
          </div>
        )}

        <div className='container-header-title'>
          {title}
        </div>

        {expandable && (
          <div
            className='container-header-expander'
            onClick={() => setShowGroup(prev => !prev)}
          >
            <span>{showGroup ? 'Hide' : 'Show'}</span>
          </div>
        )}
      </div>

      <div className={`container-group ${showGroup ? 'open' : ''}`}>
        {description && (
          <div className='container-group-description'>
            <AnimatedText speed={30}>
              {description}
            </AnimatedText>
          </div>
        )}

        <div className='container-group-items'>
          {props.children}
        </div>
      </div>
    </div>
  )
}
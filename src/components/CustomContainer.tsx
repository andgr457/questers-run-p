import { useEffect, useState } from 'react'
import { AnimatedText } from './AnimatedText'
import './CustomContainer.css'

interface CustomContainerProps {
  id?: string
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
    id,
    expandable,
    isChildCustomContainer,
    title,
    description,
    headerLeft,
    expanded
  } = props

  const [showGroup, setShowGroup] = useState(
    expandable === false || (expandable === true && expanded === true)
  )

  useEffect(() => {
    if (expandable) {
      setShowGroup(expanded === true)
    }
  }, [expanded, expandable])



  return (
    <div className='container' id={id}>
      <div className={`container-header ${isChildCustomContainer ? 'second' : ''}`}>
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
import { useState } from 'react'
import './PageHeader.css'

interface PageHeaderProps {
  title: string
  showActions: boolean
  children: React.ReactNode
}

export default function PageHeader(props: PageHeaderProps){
  const [showActions, setShowActions] = useState(props.showActions ?? false)

  const {
    title,
    children: pageActions
  } = props

  return (
    <div className='page-header'>
      <div
        className='page-header-main'
        
      >
        <div className='page-header-banner'>
          <div className='page-header-title'>
            {title}
          </div>

          <div
            className='page-header-expander'
            onClick={() => setShowActions(prev => !prev)}
          >
            <span>{showActions ? 'Hide' : 'Show'} Actions</span>
          </div>
        </div>

        <div className={`page-actions-wrapper ${showActions ? 'open' : ''}`}>
          <div className='page-header-actions'>
            {pageActions}
          </div>
        </div>
      </div>
    </div>
  )
}
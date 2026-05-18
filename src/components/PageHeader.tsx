import { useState } from 'react'
import './PageHeader.css'

interface PageHeaderProps {
  showActions: boolean
  title?: string
  children: React.ReactNode
}

export default function PageHeader(props: PageHeaderProps){
  const [showActions, setShowActions] = useState(props.showActions ?? false)

  const {
    children: pageActions,
    title
  } = props

  return (
    <div className='page-header'>
      <div className='page-header-main'>
        
        <div className='page-header-banner'>
          <div className='page-header-title'>
            {title ?? 'Actions'}
          </div>

          <div className='page-header-expander'>
            <button className='expander'  onClick={() => setShowActions(prev => !prev)}>
              {showActions ? 'Hide' : 'Show'}
            </button>
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
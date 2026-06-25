import { useEffect, useState } from 'react'

interface Props {
  title: string
  currentScreenName: string
  children: React.ReactNode
}

export default function GamePanel(props: Props) {

  const {
    children,
    title,
    currentScreenName,
  } = props
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 50)
  }, [])
  return <div className='game-panel-wrapper'>
    {show === true && (
      title && <div className='game-panel-title'>
        <div className='game-panel-title-main'>
          {title}
        </div>
        {currentScreenName && <div className='game-panel-title-current-screen'>
          {currentScreenName}
        </div>}
      </div>
    )}

    {show === true && (
      <div className={`game-panel-children ${show === true ? 'show' : ''}`}>
        {children}
      </div>
    )}

  </div>
}

import './styles/adventurersGuildClerk.css'

interface Props {
  mood?: 'neutral' | 'happy' | 'tired'
}

export function AdventurersGuildClerk({
  mood = 'neutral',
}: Props) {
  return (
    <div className={`guild-clerk ${mood}`}>
      <div className='guild-clerk-head'>
        <div className='guild-clerk-eyes'>
          <div className='guild-clerk-eye' />
          <div className='guild-clerk-eye' />
        </div>
      </div>

      <div className='guild-clerk-body' />

      <div className='guild-clerk-arms'>
        <div className='guild-clerk-arm' />
        <div className='guild-clerk-arm' />
      </div>
    </div>
  )
}
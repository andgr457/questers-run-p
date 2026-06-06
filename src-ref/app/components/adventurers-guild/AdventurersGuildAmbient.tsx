import './styles/adventurersGuildAmbient.css'

interface Props {
  timeOfDay:
    | 'morning'
    | 'afternoon'
    | 'evening'
    | 'night'
}

export function AdventurersGuildAmbient({
  timeOfDay,
}: Props) {
  return (
    <div className='guild-ambient'>
      <div className='guild-candle candle-left' />
      <div className='guild-candle candle-right' />

      {(timeOfDay === 'evening'
        || timeOfDay === 'night') && (
        <>
          <div className='guild-smoke smoke-1' />
          <div className='guild-smoke smoke-2' />
        </>
      )}
    </div>
  )
}
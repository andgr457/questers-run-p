import './styles/adventurersGuildDialogue.css'

interface Props {
  text: string
}

export function AdventurersGuildDialogue({
  text,
}: Props) {
  return (
    <div className='guild-dialogue'>
      <div className='guild-dialogue-label'>
        Guild Clerk
      </div>

      <div className='guild-dialogue-text'>
        {text}
      </div>
    </div>
  )
}
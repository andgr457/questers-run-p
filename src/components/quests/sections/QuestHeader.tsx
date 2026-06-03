interface QuestHeaderProps {
  title: string
  repeatable: boolean
}

export default function QuestHeader({
  title,
  repeatable,
}: QuestHeaderProps) {
  return (
    <>
      <div className="quest-item-header">
        {title}
      </div>

      <div className="quest-item-date">
        {repeatable ? 'repeatable' : 'one-time quest'}
      </div>
    </>
  )
}
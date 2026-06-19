import GameListItem from './GameListItem'

interface Props<T> {
  entities: T[]
  actions: Array<{name: string, fn: (entity: T) => void}>
  getEntityContent: (entity: T) => React.ReactNode
  onCardClick?: (entity: T) => void
}

export default function GameList<T>(props: Props<T>) {
  const {
    entities,
    actions,
    getEntityContent,
    onCardClick
  } = props

  return (
    <div className='game-list'>
      {entities.map(entity => (
        <GameListItem 
          actions={actions}
          entity={entity}
          getEntityContent={getEntityContent}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  )
}
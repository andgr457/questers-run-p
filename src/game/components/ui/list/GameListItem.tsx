
interface Props<T> {
  entity: T
  actions: Array<{name: string, fn: (entity: T) => void}>
  getEntityContent: (entity: T) => React.ReactNode
  onCardClick?: (entity: T) => void
}

export default function GameListItem<T>(props: Props<T>) {
  const {
    entity,
    onCardClick,
    actions,
    getEntityContent,
  } = props
  const content = getEntityContent(entity)
  return (
    <div
      className='game-list-item'
    >
      <div className='game-list-item-content' onClick={onCardClick ? () => {onCardClick(entity)} : () => {}}>
        {content}

      </div>
      {actions && actions.length > 0 && <div className='game-list-item-actions'>
        {actions.map(action => {
          if(!action.fn) return null
          return <div className='game-list-item-action'>
            <button
              className="button-basic dark"
              onClick={() => {
                if(action.fn){
                  action.fn(entity)
                }
              }}
            >
              {action.name}
            </button>
          </div>
        })}
      </div>}

    </div>
  )
}
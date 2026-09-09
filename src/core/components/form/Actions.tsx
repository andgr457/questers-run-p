import { GAME_CREDITS_SFX_LOCAL_URLS } from '../../../data/credits/CreditsSFX.data'
import type { WorldModeMain } from '../../../engine/events/types/WorldModeEvents.types'
import useAudioPlayer from '../../hooks/useAudioPlayer'

export interface ActionDetail {
  id: string
  mode?: WorldModeMain
  text: string
  value?: string
  icon?: string
  inactive: boolean
  inactiveText?: string
  onClick: (value?: string) => void
  isSubmit?: boolean
  colorScheme?: 'success' | 'danger'
  selected?: boolean
}

interface Props {
  actions: ActionDetail[]
}

export default function Actions(props: Props){
  const {
    actions,
  } = props

  let cols = 'col1'
  if(actions.length > 1){
    cols = 'col2'
  }
  if(actions.length > 2){
    cols = 'col3'
  }

  const { 
    play
  } = useAudioPlayer({
    audioUrl: GAME_CREDITS_SFX_LOCAL_URLS.sfx_mixit_click
  })

  if(!actions || actions.length === 0){
    return null
  }

  return (
    <div className={`button-action-list ${cols} `}>
      {actions.map(a => {
        return <button
          key={crypto.randomUUID()}
          className={`button-action ${a.colorScheme ?? ''} ${a.selected === true ? 'selected' : ''}`}
          disabled={a.inactive}
          onClick={() => {
            play()
            const timer = setTimeout(() => {
              if(a.inactive) return
              a.onClick()
            }, 50)
            return () => {
              if(timer) clearTimeout(timer)
            }
          }}
        >
          {a.text}
        </button>
      })}
    </div>
  )
}
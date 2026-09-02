import { GAME_CREDITS_SFX_LOCAL_URLS } from '../../../data/credits/CreditsSFX.data'
import useAudioPlayer from '../../hooks/useAudioPlayer'
import type { ValidationRule } from './ValidationRules'

export interface SelectionDetail {
  text: string
  value: string
  icon: string
  inactive: boolean
  inactiveText: string
  selected: boolean
}

interface Props {
  labelText: string
  selectionDetails: SelectionDetail[]
  validationRules: ValidationRule[]
  selectionOnChange: (value: string, selected: boolean) => void
  setRules: (rules: ValidationRule[]) => void
}

export default function Selections(props: Props) {
  const {
    labelText,
    selectionDetails,
    validationRules: rules,
    selectionOnChange,
  } = props
  const { 
    play
  } = useAudioPlayer({
    audioUrl: GAME_CREDITS_SFX_LOCAL_URLS.sfx_mixit_click
  })

  const validRules = rules.filter(r => r.isValid === true)
  
  return (
    <div className={`section ${rules.length > 0 ? 'col1' : ''}`}>
      <div>
        <div className='section-label-header'>
          <div className='section-label'>
            {labelText}
          </div>
        </div>
        <div>
          <div className='button-selection-list'>
            {selectionDetails.map(selection => {

              return <button
                key={crypto.randomUUID()}
                className={`button-selection ${selection.inactive ? 'inactive' : ''} ${selection.selected ? 'selected' : ''}`}
                disabled={selection.inactive}
                onClick={() => {
                  const setTo = !selection.selected  

                  play()
                  const timer = setTimeout(() => {
                    selectionOnChange(selection.value, setTo)
                  }, 50)
                  return () => {
                    if(timer) clearTimeout(timer)
                  }
                }}
              >
                {selection.text}
              </button>
            })}
          </div>
        </div>

      </div>
      <div>
        <div className='validation-label-header'>
          <div className='validation-label'>
            Validation
          </div>
          <div className='validation-length-text'>
            {validRules.length}/{rules.length}
          </div>
        </div>
        <div className='validation-section-rule-list'>
            {rules.map(rule => {
              return (
                <div
                  key={crypto.randomUUID()}
                  className={`validation-section-rule ${rule.isValid ? 'valid' : 'invalid'}`}
                >
                  {rule.validationText}
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
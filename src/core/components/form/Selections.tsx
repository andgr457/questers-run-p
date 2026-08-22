import { useState } from 'react'
import type { ValidationRule } from './ValidationRules'

export interface SelectionDetail {
  text: string
  value: string
  icon: string
  inactive: boolean
  inactiveText: string
  selected: boolean
}

type SelectionMode = 'one' | 'many'

interface Props {
  labelText: string
  selectionMode: SelectionMode
  selectionDetails: SelectionDetail[]
  validationRules: ValidationRule[]
  selectionOnChange: (value: string, selected: boolean) => void
}

export default function Selections(props: Props) {
  const {
    labelText,
    selectionDetails,
    validationRules,
    selectionMode,
    selectionOnChange,
  } = props
  const [rules, setRules] = useState<ValidationRule[]>(
    validationRules
  )
  const [selections, setSelections] = useState<SelectionDetail[]>(
    selectionDetails
  )
  const validRules = rules.filter(r => r.isValid === true)
  
  return (
    <div className={`section ${validationRules.length > 0 ? 'col2' : ''}`}>
      <div>
        <div className='section-label-header'>
          <div className='section-label'>
            {labelText}
          </div>
        </div>
        <div>
          <div className='selections'>
            {selections.map(selection => {

              return <button
                className={`button-selection ${selection.inactive ? 'inactive' : ''} ${selection.selected ? 'selected' : ''}`}
                onClick={() => {
                  if(selection.inactive) return

                  const setTo = !selection.selected

                  setSelections(prev => {
                    if(!prev) return prev
                    for(const prevSelection of prev){
                      if(prevSelection.value === selection.value){
                        //flip the value
                        prevSelection.selected = setTo
                      } else {
                        //not clicked selection
                        if(selectionMode === 'one'){
                          //set others to false
                          prevSelection.selected = false
                        } 
                      }
                    }
                    return [
                      ...prev
                    ]
                  })
                  selectionOnChange(selection.value, setTo)
                  
                  setRules(prev => {
                    if(!prev) return prev
                    for(const rule of prev){
                      rule.isValid = rule.isValidFn(selection.value)
                      console.log(rule, selection.value)
                    }
                    return [
                      ...prev
                    ]
                  })
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
          <div className='input-length-text'>
            {validRules.length}/{rules.length}
          </div>
        </div>
        <div className='validation-section-rule-list'>
            {rules.map(rule => {
              
              return (
                <div
                  id={crypto.randomUUID()}
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
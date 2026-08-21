import { useState } from 'react'
import type { ValidationRule } from './ValidationRules'

interface Props {
  labelText: string
  inputValue: string
  inputPlaceholderText: string
  inputMaxLength: number
  validationRules: ValidationRule[]
  inputOnChange: (value: string) => void
}

export default function TextBox(props: Props){
  const {
    inputMaxLength,
    inputOnChange,
    inputPlaceholderText = '...',
    inputValue,
    labelText,
    validationRules,

  } = props
  const [rules, setRules] = useState<ValidationRule[]>(
    validationRules
  )
  const invalidRules = rules.filter(r => !r.isValid)
  const validRules = rules.filter(r => r.isValid === true)
  const someRulesFailed = invalidRules.length > 0
  
  return (
    <div className={`section ${validationRules.length > 0 ? 'col2' : ''}`}>
      <div>
        <div className='section-label-header'>
          <div className='section-label'>
            {labelText}
          </div>
          <div className='input-length-text'>
            {inputValue.length}/{inputMaxLength}
          </div>
        </div>
        <div>
          <input 
            type='text'
            className={someRulesFailed ? 'invalid' : ''}
            maxLength={inputMaxLength}
            placeholder={inputPlaceholderText}
            value={inputValue}
            onChange={(e) => {
              const value = e.target?.value?.trim()
              setRules(prev => {
                if(!prev) return prev
                for(const rule of prev){
                  rule.isValid = rule.isValidFn(value)
                }
                return [
                  ...prev
                ]
              })
              for(const rule of rules){
                rule.isValid = rule.isValidFn(value)
              }
              
              inputOnChange(value)
            }}
          />
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
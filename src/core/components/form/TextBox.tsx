import type { ValidationRule } from './ValidationRules'

interface Props {
  labelText: string
  inputValue: string
  inputPlaceholderText: string
  inputMaxLength: number
  validationRules: ValidationRule[]
  inputOnChange: (value: string) => void
  isTextArea?: boolean
}

export default function TextBox(props: Props){
  const {
    inputMaxLength,
    inputOnChange,
    inputPlaceholderText = '...',
    inputValue,
    labelText,
    validationRules: rules,
    isTextArea = false
  } = props

  const validRules = rules.filter(r => r.isValid === true)
  
  return (
    <div className={`section ${rules.length > 0 ? 'col1' : ''}`}>
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
          {isTextArea && (
            <textarea 
              value={inputValue}
              placeholder={inputPlaceholderText}
              maxLength={inputMaxLength}
              onChange={(e) => {
                const value = e.target?.value?.trim()             
                inputOnChange(value)
              }}
            />
          )}
          {!isTextArea && (
            <input 
              type='text'
              maxLength={inputMaxLength}
              placeholder={inputPlaceholderText}
              value={inputValue}
              onChange={(e) => {
                const value = e.target?.value?.trim()             
                inputOnChange(value)
              }}
            />
          )}
          
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
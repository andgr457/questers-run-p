export interface ValidationRule {
  validationText: string
  isValidFn: (value: string) => boolean
  isValid: boolean
}

interface Props {
  rules: ValidationRule[]
}

export default function ValidationRules(props: Props) {
  const {
    rules
  } = props
  const validRules = rules.filter(r => r.isValid === true)
  return (
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
                  key={crypto.randomUUID()}
                  className={`validation-section-rule ${rule.isValid ? 'valid' : 'invalid'}`}
                >
                  {rule.validationText}
                </div>
              )
            })}
        </div>
      </div>
  )
}
import { useState, useCallback, useRef, useEffect } from 'react'

interface Props {
  onComplete: () => void
}

export default function NewPlayerForm(props: Props){
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const NAME_MAX_LENGTH = 16
  const NAME_MIN_LENGTH = 3

  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  const validateName = useCallback(() => {
    setNameError('')
    if (!name || !name.trim()) {
      setNameError('Player name is empty.')
      return false
    }

    const trimmed = name.trim()
    if (trimmed.length < NAME_MIN_LENGTH) {
      setNameError('Player name is too short.')
      return false
    }

    return true
  }, [name])


  return <div>
    NEW PLAYER FORM
    <div>
      Player Name
    </div>
    <div>
      <input
        ref={inputRef}
        className={`input ${!nameError ? '' : 'invalid' }`}
        maxLength={NAME_MAX_LENGTH}
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
        onKeyDown={(e) => {
          if(buttonRef){
            if(e.key === 'Enter'){
              buttonRef.current?.click()
            }
          }
        }}
      />
    </div>
    <div>
      <button 
        ref={buttonRef} 
        className='button success'
        onClick={() => {
          
        }}
      >
        Accept
      </button>  
    </div>
  </div>
}
import { useCallback, useEffect, useState } from 'react'
import type { Guild } from '../../../interfaces/Guild.types'
import FeatureBody from '../../../core/components/feature/components/body/FeatureBody'
import TextBox from '../../../core/components/form/TextBox'
import type { ValidationRule } from '../../../core/components/form/ValidationRules'

interface Props {
  guildName: string
  setNewGuild: React.Dispatch<React.SetStateAction<Guild>>
}

export default function GuildCreateNameInput(props: Props){
const {
    guildName,
    setNewGuild
  } = props
  const [newGuildName, setNewGuildName] = useState(guildName)

  const getNameRulesBase = (): ValidationRule[]  => {
    return [
      {
        validationText: '3-32 Characters Long',
        isValid: false,
        isValidFn: (value: string) => {
          if(!value || !value.length) return false
          return value.length >=3 && value.length <= 32
        }
      }
    ]
  }
  const [nameRules, setNameRules] = useState<ValidationRule[]>(
    [
      ...getNameRulesBase()
    ]
  )
  
  useEffect(() => {
    setNewGuildName(guildName)
    if(!guildName){
      setNameRules([
        ...getNameRulesBase()
      ])
    }
  }, [guildName])

  const handleNameChanged = useCallback((name: string) => {
    const newName = name
    setNewGuildName(newName)
    setNewGuild(prev => {
      if(!prev) return prev

      return {
        ...prev,
        title: newName
      }
    })
    setNameRules(prev => {
      if(!prev) return prev

      return [
        ...prev.map(p => {
          p.isValid = p.isValidFn(newName)
          return p
        })
      ]
    })
  }, [setNewGuild])

  return (
    <FeatureBody>
      <TextBox 
        validationRules={nameRules}
        inputMaxLength={32}
        inputOnChange={handleNameChanged}
        inputPlaceholderText='Enter guild name...'
        inputValue={newGuildName ?? ''}
        labelText='Guild Name'
      />
    </FeatureBody>
  )
}
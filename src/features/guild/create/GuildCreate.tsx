import { useState } from 'react';
import GuildCreateNameInput from './GuildCreateNameInput';
import type { Guild } from '../../../interfaces/Guild.types';
import { getGuildForCreate } from '../../../entities/guild/utils/Guild.utils';
import type { Character } from '../../../interfaces/Character.types';
import FeatureBody from '../../../core/components/feature/components/body/FeatureBody';
import Actions from '../../../core/components/form/Actions';
import { eventBus } from '../../../engine/events/EventBus';
import { clockRuntimeService } from '../../../engine/clock/ClockRuntimeService';

interface Props {
  characters: Character[]
}

export default function GuildCreate(props: Props) {
  const {
    characters
  } = props

  const [newGuild, setNewGuild] = useState<Guild>(
    getGuildForCreate()
  )

  const candidateSelected = newGuild.guildMasterId.length > 0

  return (
    <div>
      <div>
        Guild Register
      </div>
      <div>
        Register a new guild.
      </div>
      <div>
        <GuildCreateNameInput 
          guildName={newGuild.title}
          setNewGuild={setNewGuild}
        />
        <FeatureBody>
          <div className='section'>
            <div className='section-label-header'>
              <div className='section-label'>
                Guild Master Candidates
              </div>
              <div className='input-length-text'>
                {newGuild.guildMasterId.length > 0 ? '1' : 0}/1
              </div>
            </div>
            <div>
              <select
                onChange={(e) => {
                  const value = e.target.value
                  setNewGuild(prev => {
                    return {
                      ...prev,
                      guildMasterId: value
                    }
                  })
                }}
              >
                <option key='gm-option-none' value={''}>
                  Select GM
                </option>
                {characters.map(c => {
                  const isAlreadyGM = c.guildRole === 'guild_master'
                  return (
                    <option key={`gm-option-${c.id}`} value={c.id} disabled={isAlreadyGM}>
                      {c.title}{isAlreadyGM ? ' - Ineligible' : ''}
                    </option>
                  )
                })}
              </select>
            </div>
            <div>
              <div className='validation-label-header'>
                <div className='validation-label'>
                  Validation
                </div>
                <div className='validation-length-text'>
                  {newGuild.guildMasterId.length > 0 ? '1' : 0}/1
                </div>
              </div>
              <div className='validation-section-rule-list'>
                <div
                  key={crypto.randomUUID()}
                  className={`validation-section-rule ${candidateSelected ? 'valid' : 'invalid'}`}
                >
                  Candidate Selected
                </div>
              </div>
            </div>
          </div>
          <Actions 
            actions={[
              {
                inactive: false,
                onClick: () => {
                  const nameValid = newGuild.title.trim().length >= 3
                  const classSelected = newGuild.guildMasterId.length > 0
                  if(nameValid && classSelected){
                    eventBus.emit({
                      id: crypto.randomUUID(),
                      type: 'guild:create',
                      created: clockRuntimeService.getNow(),
                      meta: {
                        guild: {
                          ...newGuild,
                          title: newGuild.title.trim()
                        }
                      }
                    })
                    eventBus.emit({
                      id: crypto.randomUUID(),
                      type: 'character:guild:add',
                      created: clockRuntimeService.getNow(),
                      meta: {
                        characterId: newGuild.guildMasterId,
                        guildId: newGuild.id,
                        guildRole: 'guild_master'
                      }
                    })
                    eventBus.emit({
                      id: crypto.randomUUID(),
                      type: 'world:mode:main:change',
                      created: clockRuntimeService.getNow(),
                      meta: {
                        mode: 'none'
                      }
                    })
                  }
                },
                text: 'Save',
                colorScheme: 'success'
              },
              {
                inactive: false,
                onClick: () => {
                  setNewGuild(prev => {
  
                    return {
                      ...prev,
                      title: '',
                      guildMasterId: ''
                    }
                  })
                },
                text: 'Clear',
                colorScheme: 'danger'
              }
            ]}
          />
        </FeatureBody>
      </div>
    </div>
  )
}
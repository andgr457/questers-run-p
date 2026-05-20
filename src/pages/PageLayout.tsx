import { useMemo } from 'react';
import type { AppProperties } from '../interfaces/AppProperties.types';

interface PageLayoutProps extends AppProperties {
  leftChildren: React.ReactNode
  rightChildren: React.ReactNode
}

export default function PageLayout(props: PageLayoutProps) {
  const {
    character,
    characterGold
  } = props

  const levelProgress = useMemo(() => {
    if (!character?.levelNextXP) return 0

    return Math.min(
      100,
      Math.max(
        0,
        (character.xp / character.levelNextXP) * 100
      )
    )
  }, [character])

  const hpProgress = useMemo(() => {
    if (!character?.stats.hp?.value || !character.stats.hp?.max) return 0

    return Math.min(
      100,
      Math.max(
        0,
        (character?.stats.hp?.value / character.stats.hp?.max) * 100
      )
    )
  }, [character])

  const mpProgress = useMemo(() => {
    if (!character?.stats.mp?.value || !character.stats.mp?.max) return 0

    return Math.min(
      100,
      Math.max(
        0,
        (character?.stats.mp?.value / character.stats.mp?.max) * 100
      )
    )
  }, [character])

  const staminaProgress = useMemo(() => {
    if (!character?.stats.stamina?.value || !character.stats.stamina?.max) return 0

    return Math.min(
      100,
      Math.max(
        0,
        (character?.stats.stamina?.value / character.stats.stamina?.max) * 100
      )
    )
  }, [character])

  return (
    <div>
      
      <div className="app-screen-layout">
        <div className="app-screen left">
          {props.leftChildren}
        </div>

        <div className="app-screen right">
          {character?.name && !window.location.href.includes('/shoppe') && <div className='shoppe-cart-sticky'>
            <div className='character-mini-items' style={{alignItems: 'center'}}>
              <div className='character-mini-item'>
                <div>
                  {character?.name}
                </div>
                <div>
                  <span style={{color: 'gold'}}>{characterGold?.toLocaleString()}g</span>
                </div>
              </div>
              <div className='character-mini-item'>
                <div>
                  Lv.
                </div>
                <div>
                  <span style={{color: 'gold'}}>{character.level?.toLocaleString()}</span>
                </div>
              </div>

              <div className='character-mini-item' title={`${levelProgress}%`}>
                <div style={{width: '50px'}}>
                  <div className='character-progress-bar'>
                    <div
                      className='character-progress-fill level-fill purple'
                      style={{ width: `${levelProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className='character-mini-item' title={`${hpProgress}%`}>
                <div style={{width: '50px'}}>
                  <div className='character-progress-bar'>
                    <div
                      className='character-progress-fill level-fill red'
                      style={{ width: `${hpProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className='character-mini-item' title={`${mpProgress}%`}>
                <div style={{width: '50px'}}>
                  <div className='character-progress-bar'>
                    <div
                      className='character-progress-fill level-fill blue'
                      style={{ width: `${mpProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className='character-mini-item' title={`${staminaProgress}%`}>
                <div style={{width: '50px'}}>
                  <div className='character-progress-bar'>
                    <div
                      className='character-progress-fill level-fill green'
                      style={{ width: `${staminaProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

          </div>}
          {props.rightChildren}
        </div>
      </div>
    </div>
  );
}
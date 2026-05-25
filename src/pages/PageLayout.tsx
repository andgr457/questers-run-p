import { useMemo } from 'react';
import type { AppProperties } from '../interfaces/AppProperties.types';
import NotificationList from '../components/notifications/NotificationList';

interface PageLayoutProps extends AppProperties {
  leftChildren: React.ReactNode
  rightChildren: React.ReactNode
}

export default function PageLayout(props: PageLayoutProps) {
  const {
    character,
    characterGold,
    notifications,
    location
  } = props

  const levelProgress = useMemo(() => {
    const xp = character?.xp
    const next = character?.levelNextXP

    if (typeof xp !== 'number') return 0
    if (typeof next !== 'number' || next <= 0) return 0

    return Math.min(100, Math.max(0, (xp / next) * 100))
  }, [character?.xp, character?.levelNextXP])

  const hpProgress = useMemo(() => {
    const hp = character?.stats?.hp

    if (typeof hp?.value !== 'number') return 0
    if (typeof hp?.max !== 'number' || hp.max <= 0) return 0

    return Math.min(100, Math.max(0, (hp.value / hp.max) * 100))
  }, [character?.stats?.hp?.value, character?.stats?.hp?.max])

  const mpProgress = useMemo(() => {
    const mp = character?.stats?.mp

    if (typeof mp?.value !== 'number') return 0
    if (typeof mp?.max !== 'number' || mp.max <= 0) return 0

    return Math.min(100, Math.max(0, (mp.value / mp.max) * 100))
  }, [character?.stats?.mp?.value, character?.stats?.mp?.max])

  const staminaProgress = useMemo(() => {
    const stamina = character?.stats?.stamina

    if (typeof stamina?.value !== 'number') return 0
    if (typeof stamina?.max !== 'number' || stamina.max <= 0) return 0

    return Math.min(100, Math.max(0, (stamina.value / stamina.max) * 100))
  }, [character?.stats?.stamina?.value, character?.stats?.stamina?.max])

  return (
    <div>
      
      <div className="app-screen-layout">
        <div className="app-screen left">
          {props.leftChildren}
        </div>

        <div className="app-screen right">
          <div className='character-section-title'>
            <div className='page-header-banner'>
              <div className='page-header-title'>
                {location}
              </div>
            </div>
          </div>
          {character?.name && !window.location.href.includes('/shoppe') && <div className='shoppe-cart-sticky'>
            <div className='character-mini-items' style={{alignItems: 'center'}}>
              <div className='character-mini-item'>
                <div>
                  {character?.name}
                </div>
                <div>
                  <span style={{color: 'gold'}}>{characterGold?.toLocaleString()} g</span>
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

          <NotificationList notifications={notifications ?? []} />
          {props.rightChildren}
        </div>
      </div>
    </div>
  );
}
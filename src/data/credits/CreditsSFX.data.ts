import type { Credit } from '../../interfaces/credits/Credits.types';
import type { CreditsSFXIds } from '../../interfaces/credits/CreditsSFX.types';

export const GAME_CREDITS_SFX_IDS: Record<CreditsSFXIds, CreditsSFXIds> = {
  sfx_mixit_transition: 'sfx_mixit_transition'
}

export const GAME_CREDITS_SFX_LOCAL_URLS: Record<CreditsSFXIds, string> = {
  sfx_mixit_transition: '/sfx/transition-20260821.wav'
}

export const GAME_CREDITS_SFX: Credit[] = [
  {
    id: GAME_CREDITS_SFX_IDS.sfx_mixit_transition,
    title: 'Transition Slide In-Out',
    description: 'Heavy door slide when transitions start and end.',
    assetName: 'mixkit-heavy-sliding-door-1523.wav',
    authorName: 'Unkown',
    platformName: 'Mixit',
    sourceUrl: `https://assets.mixkit.co/active_storage/sfx/1523/1523-preview.mp3`,
    fileType: 'sfx',
    licenseType: 'free',
    localUrl: GAME_CREDITS_SFX_LOCAL_URLS.sfx_mixit_transition
  }
]
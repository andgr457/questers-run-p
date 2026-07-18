import { useEffect, useRef, useState } from 'react';
import { useManagedCharacter } from '../../../../engine/character/hooks/useManagedCharacters';
import type { CharacterEntity } from '../../../../entity/character/types/CharacterEntity.types';
import GamePanelSection from '../../../../ui/panel/GamePanelSection';
import type { Tutorial, TutorialProgressMeta } from '../../types/Tutorial.types';
import TutorialDetail from '../detail/TutorialDetail';
import styles from './TutorialRewardsCollect.module.css';
import FloatingText from '../../../../ui/text/floating-text/FloatingText';
import CharacterListItemSmall from '../../../../entity/character/components/list/CharacterListItemSmall';
import PlayerDetailSmall from '../../../../entity/player/components/detail/PlayerDetailSmall';
import { getTutorialCharacterRewardGold, getTutorialCharacterRewardXP, getTutorialPlayerRewardCharacterTokens, getTutorialPlayerRewardGold, getTutorialPlayerRewardXP } from '../../utils/Tutorial.utils';
import { eventBus } from '../../../../engine/event/EventBus';
import { formatPrimitiveValueToString } from '../../../utils/Game.utils';

interface Props {
  tutorial: Tutorial
  tutorialProgress?: TutorialProgressMeta | undefined
}
const XP_COLOR = '#d534f2'
const GOLD_COLOR = 'var(--gold)'
const TOKEN_COLOR = '#7CC8FF'
const LEVEL_COLOR = 'var(--success)'

export default function TutorialRewardsCollect(props: Props) {
  const { managedCharacter } = useManagedCharacter();

  const {
    tutorial,
    tutorialProgress,
  } = props;

  const playerGoldRef = useRef<HTMLDivElement>(null);
  const playerXpRef = useRef<HTMLDivElement>(null);
  const playerCharacterTokensRef = useRef<HTMLDivElement>(null);
  const playerLevelRef = useRef<HTMLDivElement>(null);

  const managedCharacterGoldRef = useRef<HTMLDivElement>(null);
  const managedCharacterXpRef = useRef<HTMLDivElement>(null);
  const managedCharacterLevelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = eventBus.subscribe(event => {
      if(event.type === 'character:gold:added'){
        showRewardSequence([{
          ref: managedCharacterGoldRef,
          text: `+${event.meta?.gold}g`,
          color: GOLD_COLOR,
        }])
      }
      if(event.type === 'character:xp:added'){
        showRewardSequence([{
          ref: managedCharacterXpRef,
          text: `+${event.meta?.xp} XP`,
          color: XP_COLOR,
        }])
      }
      if(event.type === 'character:level'){
        showRewardSequence([{
          ref: managedCharacterLevelRef,
          text: `Level Up: ${event.meta?.level}!`,
          color: LEVEL_COLOR,
        }])
      }

      if(event.type === 'player:gold:added'){
        showRewardSequence([{
          ref: playerGoldRef,
          text: `+${formatPrimitiveValueToString(event.meta?.gold ?? 0)}g`,
          color: GOLD_COLOR,
        }])
      }
      if(event.type === 'player:xp:added'){
        showRewardSequence([{
          ref: playerXpRef,
          text: `+${formatPrimitiveValueToString(event.meta?.xp ?? 0)} XP`,
          color: XP_COLOR,
        }])
      }
      if(event.type === 'player:token:added'){
        showRewardSequence([{
          ref: playerCharacterTokensRef,
          text: `+${formatPrimitiveValueToString(event.meta?.characterTokens ?? 0)} Token(s)`,
          color: TOKEN_COLOR,
        }])
      }
      if(event.type === 'player:level'){
        showRewardSequence([{
          ref: playerLevelRef,
          text: `Level Up: ${event.meta?.level}!`,
          color: LEVEL_COLOR,
        }])
      }
    })
    return unsub
  }, [])

  const [floatingTexts, setFloatingTexts] = useState<
    {
      id: string
      text: string
      left: number
      top: number
      color?: string
    }[]
  >([]);

  const wait = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

  const showFloatingText = (
    ref: React.RefObject<HTMLElement | null>,
    text: string,
    color = 'white'
  ) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    setFloatingTexts(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        color,
        left: rect.left - 15,
        top: rect.top,
      },
    ]);
  };

  const showRewardSequence = (
    rewards: {
      ref: React.RefObject<HTMLElement | null>
      text: string
      color?: string
    }[],
  ) => {
    const run = async () => {
      for (const reward of rewards) {
        showFloatingText(reward.ref, reward.text, reward.color);
        await wait(1000);
      }
    }
    run()
  };

  const playerXpReward = getTutorialPlayerRewardXP(tutorial.rewards)
  const playerGoldReward = getTutorialPlayerRewardGold(tutorial.rewards)
  const playerCharacterTokensReward = getTutorialPlayerRewardCharacterTokens(tutorial.rewards)

  const managedCharacterXpReward = getTutorialCharacterRewardXP(tutorial.rewards)
  const managedCharacterGoldReward = getTutorialCharacterRewardGold(tutorial.rewards)

  return (
    <div className={styles.wrapper}>
      
      <div className={styles.section}>
        <GamePanelSection
          actions={[]}
          title='Player Rewards'
        >
          <PlayerDetailSmall
            characterTokensRef={playerCharacterTokensRef}
            goldRef={playerGoldRef}
            xpRef={playerXpRef}
            rewardGold={playerGoldReward}
            rewardXp={playerXpReward}
            rewardCharacterTokens={playerCharacterTokensReward}
            levelRef={playerLevelRef}
          />
        </GamePanelSection>
      </div>

      <div className={styles.section}>
        <GamePanelSection
          actions={[]}
          title='Managed Character Rewards'
        >
          <CharacterListItemSmall 
            entity={managedCharacter as CharacterEntity} 
            goldRef={managedCharacterGoldRef}
            xpRef={managedCharacterXpRef}
            rewardGold={managedCharacterGoldReward}
            rewardXp={managedCharacterXpReward}
            levelRef={managedCharacterLevelRef}
          />
        </GamePanelSection>
      </div>

      <div className={styles.section}>
        <GamePanelSection
          actions={[]}
          expandable={false}
        >
          <TutorialDetail 
            tutorial={tutorial}
            isTutorialComplete={true} 
            isTutorialCurrentTutorial={false}
            tutorialProgress={tutorialProgress}
          />
        </GamePanelSection>
      </div>

      {floatingTexts.map(item => (
        <FloatingText
          key={item.id}
          {...item}
          onComplete={() =>
            setFloatingTexts(prev =>
              prev.filter(x => x.id !== item.id)
            )
          }
        />
      ))}
    </div>
  );
}
import { useRef, useState } from 'react';
import { useManagedCharacter } from '../../../../engine/character/hooks/useManagedCharacters';
import { formatDateFromMillis } from '../../../../engine/clock/utils/formatTimeRemaining';
import type { CharacterEntity } from '../../../../entity/character/types/CharacterEntity.types';
import GamePanelSection from '../../../../ui/panel/GamePanelSection';
import type { Tutorial, TutorialProgressMeta } from '../../types/Tutorial.types';
import TutorialDetail from '../detail/TutorialDetail';
import TutorialRewardList from '../tutorial-rewards/TutorialRewardList';
import styles from './TutorialRewardsCollect.module.css';
import FloatingText from '../../../../ui/text/floating-text/FloatingText';
import CharacterListItemSmall from '../../../../entity/character/components/list/CharacterListItemSmall';
import PlayerDetailSmall from '../../../../entity/player/components/detail/PlayerDetailSmall';

interface Props {
  tutorial: Tutorial
  tutorialProgress?: TutorialProgressMeta | undefined
}

export default function TutorialRewardsCollect(props: Props) {
  const { managedCharacter } = useManagedCharacter();

  const {
    tutorial,
    tutorialProgress,
  } = props;

  const playerGoldRef = useRef<HTMLDivElement>(null);
  const playerXpRef = useRef<HTMLDivElement>(null);
  const playerCharacterTokensRef = useRef<HTMLDivElement>(null);

  const managedCharacterGoldRef = useRef<HTMLDivElement>(null);
  const managedCharacterXpRef = useRef<HTMLDivElement>(null);

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

  const showRewardSequence = async (
    rewards: {
      ref: React.RefObject<HTMLElement | null>
      text: string
      color?: string
    }[],
  ) => {
    for (const reward of rewards) {
      showFloatingText(reward.ref, reward.text, reward.color);
      await wait(1000);
    }
  };

  const showExampleRewardFloatingText = () => {
    const run = async () => {
      showRewardSequence([
        { ref: playerGoldRef, text: '+50 Gold', color: '#FFD700' },
        { ref: playerXpRef, text: '+100 XP', color: '#7CC8FF' },
        { ref: playerCharacterTokensRef, text: '+1 Token', color: '#7CC8FF' },
      ]);
      showRewardSequence([
        { ref: managedCharacterGoldRef, text: '+50 Gold', color: '#FFD700' },
        { ref: managedCharacterXpRef, text: '+500 XP', color: '#7CC8FF' },
      ])      
    };
    run();
  }

  const playerRewards = tutorial.rewards.filter(r => r.type === 'player');
  const managedCharacterRewards = tutorial.rewards.filter(r => r.type === 'character');

  return (
    <div className={styles.wrapper}>
      <button
        className='button'
        onClick={() => {showExampleRewardFloatingText()}}
      >
        Test
      </button>
      <div className={styles.section}>
        <GamePanelSection
          actions={[]}
          title='Player Rewards'
        >
          <TutorialRewardList
            rewards={playerRewards}
            showTotals={false}
          />
          <PlayerDetailSmall
            characterTokensRef={playerCharacterTokensRef}
            goldRef={playerGoldRef}
            xpRef={playerXpRef}
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
          />
          <TutorialRewardList
            rewards={managedCharacterRewards}
            showTotals={false}
          />
        </GamePanelSection>
      </div>

      <div className={styles.section}>
        <GamePanelSection
          actions={[]}
          expandable={false}
        >
          <div className={styles.completedDate}>
            Completed {formatDateFromMillis(tutorialProgress?.dateCompleted as number)}
          </div>

          <TutorialDetail tutorial={tutorial} />
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
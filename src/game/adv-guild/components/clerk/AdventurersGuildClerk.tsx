import { useState } from 'react'
import type { Location } from '../../../../entity/location/types/Location.types'
import GamePanel from '../../../../ui/panel/GamePanel'
import GamePanelSection from '../../../../ui/panel/GamePanelSection'
import AnimatedText from '../../../../ui/text/animated-text/AnimatedText'
import type { AdventurersGuildMode } from '../AdventurersGuild'
import styles from './AdventurersGuildClerk.module.css'
import { ADVENTURERS_GUILD_CLERKS } from '../../data/clerk/AdventurersGuildClerk.data'
import DialogOptions from '../../../../ui/dialog/DialogOptions'
import type { QuestEntity } from '../../../../entity/quest/types/QuestEntity.types'

interface Props {
  currentLocation: Location
  setMode: (mode: AdventurersGuildMode) => void
  activeQuest?: QuestEntity
}

export default function AdventurersGuildClerk(props: Props){

  const {
    currentLocation,
    setMode,
    activeQuest
  } = props

  const clerk = ADVENTURERS_GUILD_CLERKS[currentLocation.id]

  const [dialog, setDialog] = useState(
    `"Welcome to the ${currentLocation.name}. I am ${clerk.name}. How may I assist you?"`
  )

  const [displayDialog, setDisplayDialog] = useState(dialog)
  const [loreIndex, setLoreIndex] = useState(-1)
  const [dialogIndex, setDialogIndex] = useState(-1)

  const changeDialog = (text: string) => {
    setDisplayDialog('...')

    setTimeout(() => {
      setDisplayDialog(text)
    }, 1500)
  }

  const handleTurnInQuest = () => {

    if (!activeQuest) {
      setDialog(
        '"You do not currently have an active contract registered with the Guild."'
      )
      return
    }
    const isQuestAtThisLocation = currentLocation.questIds.includes(currentLocation.id)
    if (!isQuestAtThisLocation) {
      setDialog(
        '"This contract was issued by another Guild branch. You will need to report to the issuing Adventurers Guild to complete it."'
      )
      return
    }

    setDialog(
      '"Contract located. Please submit your findings and evidence for verification."'
    )
  }


  const options = [
    ...(activeQuest
      ? [
          {
            label: 'Complete Quest',
            action: handleTurnInQuest
          }
        ]
      : []
    ),
    {
      label: 'Ask about adventuring',
      action: () => {
        const nextDialog = clerk.dialog[dialogIndex+1]
        if(!nextDialog){
          setDialogIndex(0)
          changeDialog(
            clerk.dialog[0]
          )
          return
        }
        changeDialog(
          nextDialog
        )
        setDialogIndex(dialogIndex+1)
      }
    },
    {
      label: 'Ask about the clerk',
      action: () => {
        const nextLore = clerk.lore[loreIndex+1]
        if(!nextLore){
          changeDialog(
            '"That\'s about it for me. What about you? Have you checked the quest board yet?"'
          )
          return
        }
        changeDialog(
          nextLore
        )
        setLoreIndex(loreIndex+1)
      }
    },

    {
      label: 'Visit the Quest Board',
      action: () => {
        setMode('quest_board')
      }
    }
  ]


  return (
    <GamePanel
      title={`${currentLocation.name}`}
      currentScreenName=''
      showBackground={false}
    >

      <GamePanelSection actions={[]}>
        
        <div className={styles.wrapper}>

          <div className={styles.namePlate}>
            <div className={styles.name}>
              {clerk.name}
            </div>

            <div className={styles.title}>
              {clerk.title}
            </div>
          </div>


          <div className={styles.dialogBox}>
              <AnimatedText
                key={displayDialog}
                text={displayDialog}
              />

          </div>


          <DialogOptions
            options={options}
          />

        </div>

      </GamePanelSection>

    </GamePanel>
  )
}
import styles from './DialogOptions.module.css'
import type { DialogOption } from './types/Dialog.types'

interface Props {
  options: DialogOption[]
}

export default function DialogOptions(props: Props) {
  const {
    options
  } = props

  return (
    <div className={styles.wrapper}>
      {
        options.map((option, index) => (
          <button
            key={index}
            className={styles.option}
            onClick={option.action}
            disabled={option.disabled}
          >
            {option.label}
          </button>
        ))
      }
    </div>
  )
}
import styles from './FeatureHeader.module.css'

interface Props {
  text: string
}

export default function FeatureHeader(props: Props){
  const {
    text
  } = props

  return (
    <div className={styles.text}>
      {text}
    </div>
  )
}
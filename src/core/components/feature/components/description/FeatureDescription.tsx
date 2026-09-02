import styles from './FeatureDescription.module.css'

interface Props {
  isAlert?: boolean
  children: React.ReactNode
}

export default function FeatureDescription(props: Props){
  const {
    isAlert = false,
    children
  } = props

  return (
    <div className={`${styles.wrapper} ${isAlert ? styles.alert : ''}`}>
      {children}
    </div>
  )
}
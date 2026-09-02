import styles from './FeatureBody.module.css'

interface Props {
  children: React.ReactNode
}

export default function FeatureBody(props: Props){
  const {
    children
  } = props

  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  )
}
import styles from './FeatureWrapper.module.css'

interface Props {
  children?: React.ReactNode
}

export default function FeatureWrapper(props: Props){
  return <div className={styles.wrapper}>
    {props.children}
  </div>
}
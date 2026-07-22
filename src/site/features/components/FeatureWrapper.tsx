import styles from './FeatureWrapper.module.css'

interface FeatureWrapperProps {
  children: React.ReactNode
}

export default function FeatureWrapper({
  children
}: FeatureWrapperProps) {
  return (
    <div className={styles.featureWrapper}>
      {children}
    </div>
  )
}
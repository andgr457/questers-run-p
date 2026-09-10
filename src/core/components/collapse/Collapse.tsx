import styles from './Collapse.module.css'

interface Props {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  title: string
  children: React.ReactNode
}

export default function Collapse(props: Props) {
  
  const {
    title,
    collapsed,
    setCollapsed,
    children
  } = props

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.header}
        onClick={() => setCollapsed(!collapsed)}
      >
        {title}
      </div>

      <div
        className={`${styles.body} ${collapsed ? styles.close : styles.open}`}
      >
        {children}
      </div>
    </div>
  )
}
import NodeExplorer from '../../components/NodeExplorer/NodeExplorer'
import styles from './Site.module.css'

export default function Site() {
    return (
        <div className={styles.page}>
            <NodeExplorer />
        </div>
    )
}
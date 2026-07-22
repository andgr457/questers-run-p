import BubbleNode from './BubbleNode'
import styles from './NodeExplorer.module.css'

export default function NodeExplorer() {
    return (
        <div className={styles.wrapper}>
            <BubbleNode
                title="Quester's Run"
                onClick={() => console.log('Clicked!')}
            />
        </div>
    )
}
import styles from './BubbleNode.module.css'

interface BubbleNodeProps {
    title: string
    onClick?: () => void
}

export default function BubbleNode({
    title,
    onClick,
}: BubbleNodeProps) {
    return (
        <button
            className={styles.node}
            onClick={onClick}
        >
            {title}
        </button>
    )
}
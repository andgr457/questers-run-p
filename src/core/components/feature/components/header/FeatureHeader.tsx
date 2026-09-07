import HeaderFancy from '../../../header/fancy/HeaderFancy'
import styles from './FeatureHeader.module.css'

interface Props {
  text: string
  type?: 'main' | 'sub'
}

export default function FeatureHeader(props: Props){
  const {
    text,
    type = 'sub',
  } = props

  return (
    <HeaderFancy 
      text={text}
      type={type}
    />
  )
}
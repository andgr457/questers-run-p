import HeaderFancy from '../../../header/fancy/HeaderFancy'

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
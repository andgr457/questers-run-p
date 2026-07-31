
interface Props {
  gold: number
}

export default function GoldDetail(props: Props){
  const {
    gold,
  } = props
  return <>
    <span style={{color: 'gold'}}>◉</span> {gold}g
  </>
}
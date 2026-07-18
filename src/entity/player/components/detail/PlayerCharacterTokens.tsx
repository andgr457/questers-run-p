
interface Props {
  tokens: number
}

export default function PlayerCharacterTokens(props: Props){
  const {
    tokens,
  } = props
  return <div title='Character Create Tokens'>
    <span style={{color: 'var(--blue-sd-lighter-2)'}}>⌬</span> {tokens}
  </div>
}
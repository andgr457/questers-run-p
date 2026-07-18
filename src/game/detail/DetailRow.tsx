interface Props {
  field: string
  value: string
  onFieldClick?: () => void
  onValueClick?: () => void
  onRowClick?: () => void
}

export default function DetailRow(props: Props){
  const {
    field,
    value,
    onFieldClick,
    onRowClick,
    onValueClick
  } = props
  let rowStyle = onRowClick ? {cursor: 'pointer'} : undefined
  let fieldStyle = onFieldClick ? {cursor: 'pointer'} : undefined
  let valueStyle = onValueClick ? {cursor: 'pointer'} : undefined

  return <div 
      className='detail-row' 
      style={rowStyle}
      onClick={onRowClick ? () => onRowClick?.() : undefined}
    >
    <div 
      className='detail-field-name' 
      style={fieldStyle}
      onClick={onFieldClick ? () => onFieldClick?.() : undefined}
    >
      {field}
    </div>
    <div 
      className='detail-field-value' 
      style={valueStyle}
      onClick={onValueClick ? () => onValueClick?.() : undefined}
    >
      {value ? `${value}` : 'N/A'}
    </div>
  </div>
}
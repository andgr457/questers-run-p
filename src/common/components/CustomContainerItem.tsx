interface CustomContainerItemProps{
  children: React.ReactNode
}

export default function CustomContainerItem(props: CustomContainerItemProps){

  return <div className='container-group-item'>
    {props.children}
  </div>
}
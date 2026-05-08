interface PageLayoutProps {
  leftChildren: React.ReactNode
  rightChildren: React.ReactNode
}


export default function PageLayout(props: PageLayoutProps){

  return <div className='app-layout'>
  {/* LEFT SIDE */}
  <div className='app-screen left'>
    {props.leftChildren}
  </div>

  {/* RIGHT SIDE */}
  <div className='app-screen right'>
    {props.rightChildren}
  </div>

</div>
}
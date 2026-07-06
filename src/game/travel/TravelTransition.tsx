import TransitionDetail from '../../ui/transition/TransitionDetail';
import { useTransition } from '../../engine/transition/hooks/useTransition';

export default function TravelTransition(){
  const {transition} = useTransition()
  if(
    !transition
  ) return null

  return <TransitionDetail 
    transition={transition}
  />
}
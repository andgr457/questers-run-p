import { useEffect, useRef } from 'react'

interface Props {
  audioUrl: string
}

export default function useAudioPlayer(props: Props){
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if(!props.audioUrl) return

    audioRef.current = new Audio(props.audioUrl)

    return () => {
      if(audioRef.current){
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [props.audioUrl])

  const play = () => {
    if(!audioRef.current) return
    audioRef.current.volume = 1
    audioRef.current.currentTime = 0
    audioRef.current.play().catch((err) => {
      console.warn('Audio playback blocked by browser.', err)
    })
  }

  const stop = () => {
    if(!audioRef.current) return

    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  return {
    play,
    stop
  }

}
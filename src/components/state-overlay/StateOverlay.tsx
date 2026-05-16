import './StateOverlay.css'

interface StateOverlayProps {
  active?: boolean
  children: React.ReactNode

  text?: string
  subText?: React.ReactNode

  icon?: React.ReactNode

  blur?: boolean
  darken?: boolean

  variant?: 'loading' | 'locked' | 'danger'
}

export default function StateOverlay(
  props: StateOverlayProps
) {
  const {
    active,
    children,

    text,
    subText,

    icon,

    blur = true,
    darken = true,

    variant = 'locked',
  } = props

  return (
    <div className='state-overlay-container'>
      <div
        className={`
          state-overlay-content
          ${active ? 'active' : ''}
          ${blur ? 'blur' : ''}
        `}
      >
        {children}
      </div>

      {active && (
        <div
          className={`
            state-overlay
            ${variant}
            ${darken ? 'darken' : ''}
          `}
        >
          {icon && (
            <div className='state-overlay-icon'>
              {icon}
            </div>
          )}

          {text && (
            <div className='state-overlay-text'>
              {text}
            </div>
          )}

          {subText && (
            <div className='state-overlay-subtext'>
              {subText}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
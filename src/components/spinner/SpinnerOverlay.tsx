import './SpinnerOverlay.css'

interface SpinnerOverlayProps {
  loading?: boolean
  children: React.ReactNode
  text?: string
  blur?: boolean
}

export default function SpinnerOverlay(
  props: SpinnerOverlayProps
) {
  const {
    loading,
    children,
    text = '',
    blur = true,
  } = props

  return (
    <div className='spinner-overlay-container'>
      <div
        className={`
          spinner-overlay-content
          ${loading ? 'loading' : ''}
          ${blur ? 'blur' : ''}
        `}
      >
        {children}
      </div>

      {loading && (
        <div className='spinner-overlay'>
          <div className='spinner' />

          {text && (
            <div className='spinner-text'>
              {text}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
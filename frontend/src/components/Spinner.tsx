interface SpinnerProps {
  label?: string
}

export function Spinner({ label = 'Fetching repositories from GitHub...' }: SpinnerProps) {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center p-8 text-center" role="status">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ambient ring */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />
        {/* Spinning border indicator */}
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/20 border-t-primary shadow-lg shadow-primary/20" />
      </div>
      {label && (
        <p className="mt-4 text-sm font-medium text-text-secondary animate-pulse">
          {label}
        </p>
      )}
      <span className="sr-only">Loading content...</span>
    </div>
  )
}

export default Spinner

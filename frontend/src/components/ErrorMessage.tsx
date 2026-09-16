import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi'
import { Button } from '@/components/ui/button'

interface ErrorMessageProps {
  message: string
  onRetry: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div 
      className="mx-auto my-8 flex max-w-xl flex-col items-center rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center backdrop-blur-md shadow-xl"
      role="alert"
    >
      <div className="mb-3 rounded-full bg-red-500/20 p-3 text-red-400">
        <FiAlertCircle className="h-8 w-8" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-text-primary">
        Failed to Load Repositories
      </h3>
      <p className="mb-6 text-sm text-text-secondary">
        {message}
      </p>
      <Button
        onClick={onRetry}
        variant="default"
        className="inline-flex items-center gap-2"
      >
        <FiRefreshCw className="h-4 w-4" />
        Retry Request
      </Button>
    </div>
  )
}

export default ErrorMessage

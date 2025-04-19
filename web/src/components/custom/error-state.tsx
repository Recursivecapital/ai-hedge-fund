import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorStateProps {
  message?: string
  retryFunction?: () => void
}

export function ErrorState({ 
  message = "An error occurred. Please try again.", 
  retryFunction 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-40 w-full">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <p className="mt-4 text-sm text-muted-foreground text-center">{message}</p>
      {retryFunction && (
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={retryFunction}
        >
          Retry
        </Button>
      )}
    </div>
  )
} 
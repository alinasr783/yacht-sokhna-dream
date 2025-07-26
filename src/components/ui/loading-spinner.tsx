import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md", ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4" {...props}>
      <div className={cn("relative", sizeClasses[size], className)}>
        {/* Yacht animation */}
        <div className="absolute inset-0 animate-spin">
          <svg viewBox="0 0 50 50" className="h-full w-full">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="31.416"
              strokeDashoffset="31.416"
              className="animate-[draw_2s_ease-in-out_infinite]"
            />
          </svg>
        </div>
        
        {/* Anchor in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="h-3 w-3 text-primary animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L8 4H6C4.89 4 4 4.89 4 6V8L2 10L4 12V14C4 15.11 4.89 16 6 16H8L10 18L12 16H14C15.11 16 16 15.11 16 14V12L18 10L16 8V6C16 4.89 15.11 4 14 4H12L10 2Z"/>
          </svg>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground animate-pulse">
        جاري التحميل...
      </p>
    </div>
  );
}

export { LoadingSpinner as YachtLoader };
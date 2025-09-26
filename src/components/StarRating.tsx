import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showRating?: boolean;
  className?: string;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  showRating = false,
  className,
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isHalfFilled = starValue - 0.5 <= rating && starValue > rating;

          return (
            <div key={index} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFilled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
              {isHalfFilled && (
                <Star
                  className={cn(
                    sizeClasses[size],
                    "absolute top-0 left-0 fill-yellow-400 text-yellow-400",
                    "clip-path-[polygon(0%_0%,50%_0%,50%_100%,0%_100%)]"
                  )}
                  style={{
                    clipPath: "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      {showRating && (
        <span
          className={cn(
            "font-medium text-muted-foreground",
            textSizeClasses[size]
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Calendar } from "lucide-react";
import StarRating from "./StarRating";
import { Review } from "@/data/reviews";

// interface ReviewCardProps {
//   review: Review;
// }

interface ReviewCardProps {
  review: any;
  tourTitle: string;
}

const ReviewCard = ({ review, tourTitle }: ReviewCardProps) => {
  const avatarDisplay = review.user_avatar ? (
    <img src={review.user_avatar} alt={review.user_name} />
  ) : (
    <div className="avatar-initials">
      {review.user_name
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>
  );
  console.log("tourTitle:", tourTitle);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-glow transition-smooth">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-desert text-white font-semibold">
                {avatarDisplay}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="font-semibold text-foreground">
                {review.user_name}
              </h4>
              <div className="flex items-center space-x-2">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.created_at)}
                </span>
              </div>
            </div>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>

        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {tourTitle}
          </Badge>
          <h3 className="font-semibold text-foreground leading-tight">
            {review.title}
          </h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          {review.comment}
        </p>

        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {review.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
              />
            ))}
          </div>
        )}

        {/* <div className="flex items-center justify-between pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Helpful ({review.helpful})
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;

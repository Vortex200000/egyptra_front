import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/config/api";

interface ReviewFormProps {
  tourId: string; // Changed to string since your API uses UUID/string IDs
  tourName: string;
  onSubmit: (review: any) => void;
  onCancel: () => void;
}

const reviewSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  comment: z
    .string()
    .trim()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be less than 1000 characters"),
  rating: z
    .number()
    .min(1, "Please select a rating")
    .max(5, "Rating cannot exceed 5 stars"),
});

const ReviewForm = ({
  tourId,
  tourName,
  onSubmit,
  onCancel,
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // API call function
  const sendReviewToAPI = async (reviewData: {
    rating: number;
    title: string;
    comment: string;
  }) => {
    try {
      const accessToken = localStorage.getItem("access");

      if (!accessToken) {
        throw new Error("Please log in to submit a review");
      }

      const response = await fetch(
        `${API_URL}/api/tours/${tourId}/reviews/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return { success: true, data };
      } else {
        return {
          success: false,
          error: data.error || "Failed to submit review",
          message:
            data.message || "An error occurred while submitting your review.",
        };
      }
    } catch (error) {
      console.error("Network error:", error);
      return {
        success: false,
        error: "Network error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to the server. Please check your internet connection and try again.",
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = reviewSchema.parse({
        title,
        comment,
        rating,
      });

      // Send review to API
      const result = await sendReviewToAPI({
        rating: validatedData.rating,
        title: validatedData.title,
        comment: validatedData.comment,
      });

      if (result.success) {
        // Create review object for UI (if needed)
        const newReview = {
          id: result.data.review?.id || Date.now(),
          userName: user?.first_name || "Anonymous",
          avatar: (user?.first_name || "A")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          rating: validatedData.rating,
          tourId,
          tourName,
          date: new Date().toISOString().split("T")[0],
          title: validatedData.title,
          content: validatedData.comment,
          helpful: 0,
          ...result.data.review, // Include any additional data from API
        };

        onSubmit(newReview);

        toast({
          title: "Review Submitted!",
          description:
            result.data.message || "Thank you for sharing your experience.",
        });

        // Reset form
        setRating(0);
        setTitle("");
        setComment("");
      } else {
        toast({
          title: "Failed to Submit Review",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          title: "Validation Error",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-playfair">Write a Review</CardTitle>
        <p className="text-muted-foreground">
          Share your experience with {tourName}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Overall Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-colors"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      hoveredRating >= star || rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    )}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} out of 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Name (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-base font-medium">
              Your Name
            </Label>
            <Input
              id="userName"
              value={user?.first_name || ""}
              readOnly
              placeholder="Please log in to submit a review"
              className="bg-muted"
            />
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Review Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={200}
            />
          </div>

          {/* Review Content */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base font-medium">
              Your Review
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this tour..."
              rows={6}
              maxLength={1000}
              className="resize-none"
            />
            <div className="text-right text-sm text-muted-foreground">
              {comment.length}/1000 characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !user}
              className="w-full text-lg px-8 py-4 bg-black text-primary hover:bg-primary hover:text-black transition"
              variant="hero"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full text-lg px-8 py-4 bg-black text-primary hover:bg-primary hover:text-black transition"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>

          {!user && (
            <p className="text-sm text-muted-foreground text-center">
              Please log in to submit a review
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;

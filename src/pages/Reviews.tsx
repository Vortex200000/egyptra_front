import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ReviewCard from "@/components/ReviewCard";
import StarRating from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_URL } from "@/config/api";
import { Star, Users, Award, TrendingUp, Loader2 } from "lucide-react";

interface Review {
  id: number;
  user_name: string;
  user_avatar: string | null;
  rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  tour: string;
  tour_name?: string;
  tour_image?: string;
}

interface Tour {
  id: string;
  title: string;
  cover_photo: string;
  rating: string;
  review_count: number;
}

const Reviews = () => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reviews from API
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch all tours first to get tour info
        const toursResponse = await fetch(`${API_URL}/api/tours/`);
        const toursData = await toursResponse.json();
        setTours(toursData.results || toursData);

        // Collect all reviews from all tours
        const allReviews: Review[] = [];

        // Create a map of tour IDs to tour info for quick lookup
        const tourMap = new Map();
        (toursData.results || toursData).forEach((tour: Tour) => {
          tourMap.set(tour.id, {
            name: tour.title,
            image: tour.cover_photo,
          });
        });

        for (const tour of toursData.results || toursData) {
          try {
            const tourResponse = await fetch(
              `${API_URL}/api/tours/${tour.id}/`
            );
            if (tourResponse.ok) {
              const tourData = await tourResponse.json();
              if (tourData.reviews && tourData.reviews.length > 0) {
                const reviewsWithTourInfo = tourData.reviews.map(
                  (review: Review) => ({
                    ...review,
                    tour_name: tourData.title,
                    tour_image: tourData.cover_photo,
                    date: new Date(review.created_at)
                      .toISOString()
                      .split("T")[0], // Format date for compatibility
                    userName: review.user_name,
                    content: review.comment,
                    helpful: 0, // Default value since not in API
                    avatar:
                      review.user_avatar ||
                      review.user_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase(),
                  })
                );
                allReviews.push(...reviewsWithTourInfo);
              }
            }
          } catch (error) {
            console.error(`Error fetching reviews for tour ${tour.id}:`, error);
          }
        }

        setReviews(allReviews);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate statistics
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const totalReviews = reviews.length;

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      if (filterBy === "all") return true;
      if (filterBy === "5-star") return review.rating === 5;
      if (filterBy === "4-star") return review.rating === 4;
      if (filterBy === "3-star") return review.rating === 3;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "highest-rated":
          return b.rating - a.rating;
        // case "most-helpful":
        //   return (b.helpful || 0) - (a.helpful || 0);
        default:
          return 0;
      }
    });

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage:
      totalReviews > 0
        ? (reviews.filter((r) => r.rating === rating).length / totalReviews) *
          100
        : 0,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            Guest Reviews
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what our travelers are saying about their Egyptian
            adventures
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {averageRating.toFixed(1)}
              </div>
              <StarRating
                rating={averageRating}
                size="sm"
                className="justify-center mt-2"
              />
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalReviews}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Total reviews
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Excellence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalReviews > 0
                  ? Math.round(
                      (reviews.filter((r) => r.rating >= 4).length /
                        totalReviews) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                4+ star ratings
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                Tours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {tours.length}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Available tours
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-reviews" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex">
            <TabsTrigger value="all-reviews">All Reviews</TabsTrigger>
            <TabsTrigger value="rating-breakdown">Rating Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="all-reviews" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest-rated">Highest Rated</SelectItem>
                    {/* <SelectItem value="most-helpful">Most Helpful</SelectItem> */}
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5-star">5 Stars</SelectItem>
                    <SelectItem value="4-star">4 Stars</SelectItem>
                    <SelectItem value="3-star">3 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedReviews.length} of {totalReviews}{" "}
                reviews
              </p>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAndSortedReviews.length > 0 ? (
                filteredAndSortedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    tourTitle={review.title}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    No reviews found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rating-breakdown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-desert h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-16 text-right">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tour-specific ratings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tours.map((tour) => {
                const tourReviews = reviews.filter((r) => r.tour === tour.id);
                const avgRating = parseFloat(tour.rating) || 0;

                return (
                  <Card key={tour.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{tour.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <StarRating rating={avgRating} size="sm" showRating />
                        <span className="text-sm text-muted-foreground">
                          {tour.review_count} reviews
                        </span>
                      </div>
                      <img
                        src={tour.cover_photo}
                        alt={tour.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Reviews;

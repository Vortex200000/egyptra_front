import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const toursResponse = await fetch(`${API_URL}/api/tours/`);
        const toursData = await toursResponse.json();
        setTours(toursData.results || toursData);

        const allReviews: Review[] = [];
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
                      .split("T")[0],
                    userName: review.user_name,
                    content: review.comment,
                    helpful: 0,
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

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const totalReviews = reviews.length;

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
        default:
          return 0;
      }
    });

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
            <p className="text-lg text-muted-foreground">
              {t("loadingReviews")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-4">
            {t("guestReviews")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("guestReviewsSubtitle")}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                {t("rating")}
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
                {t("reviews")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {totalReviews}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t("totalReviews")}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                {t("excellence")}
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
                {t("fourPlusStars")}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                {t("navigation.tours")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {tours.length}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t("availableTours")}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-reviews" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:flex">
            <TabsTrigger value="all-reviews">{t("allReviews")}</TabsTrigger>
            <TabsTrigger value="rating-breakdown">
              {t("ratingBreakdown")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-reviews" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t("newestFirst")}</SelectItem>
                    <SelectItem value="oldest">{t("oldestFirst")}</SelectItem>
                    <SelectItem value="highest-rated">
                      {t("highestRated")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t("filterByRating")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allRatings")}</SelectItem>
                    <SelectItem value="5-star">{t("fiveStars")}</SelectItem>
                    <SelectItem value="4-star">{t("fourStars")}</SelectItem>
                    <SelectItem value="3-star">{t("threeStars")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-muted-foreground">
                {t("showingReviews", {
                  count: filteredAndSortedReviews.length,
                  total: totalReviews,
                })}
              </p>
            </div>

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
                    {t("noReviewsFound")}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rating-breakdown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("ratingDistribution")}</CardTitle>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tours.map((tour) => {
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
                          {tour.review_count} {t("reviews")}
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

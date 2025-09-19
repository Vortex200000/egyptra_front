import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast, useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Download,
  MessageCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { API_URL } from "@/config/api";

interface Booking {
  id: string;
  booking_reference: string;
  full_name: string;
  tour_title: string;
  tour_cover_photo: string;
  tour_location: string;
  preferred_date: string;
  number_of_travelers: number;
  total_amount: string;
  booking_status: string;
  booking_status_display: string;
  payment_status: string;
  payment_status_display: string;
  can_be_cancelled: string;
  created_at: string;
}

const getVoucher = async (bookingRef: string) => {
  try {
    const res = await fetch(`${API_URL}/api/bookings/${bookingRef}/voucher/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch voucher");

    // Convert response into Blob (binary data)
    const blob = await res.blob();

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voucher-${bookingRef}.pdf`; // filename
    document.body.appendChild(a);
    a.click();

    // Cleanup
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
};

const Bookings = () => {
  const [openCancel, setOpenCancel] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();
  const REASONS = [
    { value: "customer_request", label: "Customer Request" },
    { value: "tour_cancelled", label: "Tour Cancelled" },
    { value: "weather", label: "Weather Conditions" },
    { value: "insufficient_participants", label: "Insufficient Participants" },
    { value: "force_majeure", label: "Force Majeure" },
    { value: "other", label: "Other" },
  ];
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to book this tour.",
        variant: "destructive",
      });
      navigate("/auth");
    }
  }, [user, navigate]);
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);

    try {
      const res = await fetch(
        `${API_URL}/api/bookings/my-bookings/${selectedBooking.booking_reference}/cancel/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify({
            email: localStorage.getItem("user_email"), // or pass email from props/state
            reason,
            detail,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to cancel booking");

      await fetchBookings(); // refresh list
      setOpenCancel(false);
      setReason("");
      setDetail("");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-sky py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {t("bookings.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("bookings.subtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">{t("common.loading")}</div>
        ) : bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                className="shadow-card hover:shadow-glow transition-smooth"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/4">
                      <img
                        src={booking.tour_cover_photo}
                        alt={booking.tour_title}
                        className="w-full h-48 md:h-full object-cover rounded-l-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {booking.tour_title}
                          </h3>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{booking.tour_location}</span>
                          </div>
                        </div>
                        <Badge
                          className={getStatusColor(booking.booking_status)}
                        >
                          {booking.booking_status_display}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <div>
                            <div className="font-medium">
                              {t("bookings.tour_date")}
                            </div>
                            <div className="text-muted-foreground">
                              {new Date(
                                booking.preferred_date
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-primary" />
                          <div>
                            <div className="font-medium">
                              {t("bookings.travelers")}
                            </div>
                            <div className="text-muted-foreground">
                              {booking.number_of_travelers}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <CreditCard className="h-4 w-4 mr-2 text-primary" />
                          <div>
                            <div className="font-medium">
                              {t("bookings.total_price")}
                            </div>
                            <div className="text-muted-foreground">
                              $
                              {parseFloat(
                                booking.total_amount
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm">
                          <div className="font-medium">{t("bookings.ref")}</div>
                          <div className="text-muted-foreground">
                            {booking.booking_reference}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        {booking.booking_status === "confirmed" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                getVoucher(booking.booking_reference)
                              }
                            >
                              <Download className="h-4 w-4 mr-2" />
                              {t("bookings.download_voucher")}
                            </Button>
                            <Button variant="outline" size="sm">
                              {t("bookings.view_itinerary")}
                            </Button>
                            <Button variant="book" size="sm">
                              {t("bookings.manage")}
                            </Button>
                          </>
                        )}

                        {booking.booking_status === "pending" &&
                          booking.can_be_cancelled && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setOpenCancel(true);
                                handleCancelBooking();
                              }}
                            >
                              {t("bookings.cancel")}
                            </Button>
                          )}

                        {booking.booking_status === "cancelled" && (
                          <Button variant="outline" size="sm" disabled>
                            {t("bookings.cancelled")}
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate("/contact")}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          {t("bookings.support")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-12 shadow-card">
            <h3 className="text-2xl font-semibold text-foreground mb-2">
              {t("bookings.none")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("bookings.none_desc")}
            </p>
            <Button variant="hero" size="lg">
              {t("bookings.browse")}
            </Button>
          </Card>
        )}
      </div>
      <Dialog open={openCancel} onOpenChange={setOpenCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Reason</Label>
              <Select onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Details</Label>
              <Textarea
                placeholder="Tell us more..."
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenCancel(false)}
              disabled={submitting}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={submitting || !reason}
            >
              {submitting ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings;

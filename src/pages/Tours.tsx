import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import TourList from "@/components/ToursList";
import { Search, Filter } from "lucide-react";

const Tours = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const { t } = useTranslation();

  const categories = [
    { value: "all", label: t("tours.categories.all") },
    { value: "easy", label: t("tours.categories.easy") },
    { value: "moderate", label: t("tours.categories.moderate") },
    { value: "difficult", label: t("tours.categories.difficult") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="bg-gradient-sky py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {t("tours.header.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("tours.header.subtitle")}
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("tours.filters.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t("tours.filters.category")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("tours.filters.sort_by")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">{t("tours.sort.name")}</SelectItem>
                <SelectItem value="price-low">
                  {t("tours.sort.price_low")}
                </SelectItem>
                <SelectItem value="price-high">
                  {t("tours.sort.price_high")}
                </SelectItem>
                <SelectItem value="rating">{t("tours.sort.rating")}</SelectItem>
                <SelectItem value="duration">
                  {t("tours.sort.duration")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {t("tours.results", {
              category: selectedCategory !== "all" ? selectedCategory : "",
              search: searchTerm,
            })}
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <TourList
            searchTerm={searchTerm}
            category={selectedCategory}
            sortBy={sortBy}
          />
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Tours;

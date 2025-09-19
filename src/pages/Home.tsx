import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import TourList from "@/components/ToursList";
import { ArrowRight, Compass, Shield, Award, Users2 } from "lucide-react";
import heroImage from "@/assets/hero-egyptian.jpg";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-hero opacity-60" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t("home.hero.title")}
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-white/90 max-w-2xl mx-auto">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tours">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                {t("home.hero.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white hover:text-foreground"
              >
                {t("home.hero.learn_more")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-sky">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t("home.features.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-ocean w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.features.expert_guides")}</h3>
              <p className="text-muted-foreground">{t("home.features.expert_guides_desc")}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-sunset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.features.safe_secure")}</h3>
              <p className="text-muted-foreground">{t("home.features.safe_secure_desc")}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-ocean w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.features.award_winning")}</h3>
              <p className="text-muted-foreground">{t("home.features.award_winning_desc")}</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-sunset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users2 className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.features.small_groups")}</h3>
              <p className="text-muted-foreground">{t("home.features.small_groups_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t("home.featured.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.featured.subtitle")}
            </p>
          </div>

          <TourList limit={3} />

          <div className="text-center mt-12">
            <Link to="/tours">
              <Button
                variant="explore"
                size="lg"
                className="text-lg px-8 py-4 bg-black text-primary hover:bg-primary hover:text-black transition"
              >
                {t("home.featured.cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Home;

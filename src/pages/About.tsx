import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users2, Globe, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-sky py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            {t("about.hero.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-8">
              {t("about.story.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t("about.story.p1")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("about.story.p2")}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-sky">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t("about.values.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("about.values.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center shadow-card hover:shadow-glow transition-smooth">
              <CardContent className="p-8">
                <div className="bg-gradient-ocean w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("about.values.items.authentic.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.values.items.authentic.desc")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-glow transition-smooth">
              <CardContent className="p-8">
                <div className="bg-gradient-sunset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("about.values.items.sustainable.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.values.items.sustainable.desc")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-glow transition-smooth">
              <CardContent className="p-8">
                <div className="bg-gradient-ocean w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users2 className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("about.values.items.service.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.values.items.service.desc")}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center shadow-card hover:shadow-glow transition-smooth">
              <CardContent className="p-8">
                <div className="bg-gradient-sunset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t("about.values.items.excellence.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("about.values.items.excellence.desc")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default About;

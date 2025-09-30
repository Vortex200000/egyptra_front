import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Mail, Lock, UserPlus, LogIn, User, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import EyeOfRaAnkh2 from "../assets/icons/nata.png";

const Auth = () => {
  // Sign in fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign up fields
  const [signUpEmail, setSignUpEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpPassword !== confirmPassword) return;

    setIsLoading(true);
    const result = await signUp(
      signUpEmail,
      username,
      signUpPassword,
      firstName,
      lastName,
      confirmPassword
    );
    setIsLoading(false);

    // Check if signup was successful
    if (result && !result.error) {
      // Clear signup form
      setSignUpEmail("");
      setUsername("");
      setFirstName("");
      setLastName("");
      setSignUpPassword("");
      setConfirmPassword("");

      // Switch to sign in tab and show success message
      setActiveTab("signin");
      setShowSuccessMessage(true);

      // Pre-fill email in sign-in form
      setEmail(signUpEmail);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (!error) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-gradient-sky py-12">
        <div className="container mx-auto px-4 text-center">
          <img 
            src={EyeOfRaAnkh2} 
            alt="Eye of Ra" 
            className="h-20 w-20 text-primary mx-auto mb-4 justify-center object-cover" 
          />
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t("auth.welcomeTitle")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("auth.welcomeSubtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t("auth.signInTab")}</TabsTrigger>
            <TabsTrigger value="signup">{t("auth.signUpTab")}</TabsTrigger>
          </TabsList>

          {/* SIGN IN */}
          <TabsContent value="signin">
            {showSuccessMessage && (
              <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-green-800 dark:text-green-200 font-semibold">
                  Account Created Successfully!
                </AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Welcome aboard! You can now sign in with your credentials.
                </AlertDescription>
              </Alert>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  {t("auth.signIn")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">
                      {t("auth.password")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder={t("auth.passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full justify-center bg-yellow-500 text-black hover:bg-primary hover:text-black"
                    disabled={isLoading}
                    variant="hero"
                  >
                    {isLoading ? t("auth.signingIn") : t("auth.signIn")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIGN UP */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  {t("auth.createAccount")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-username">
                      {t("auth.username")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder={t("auth.usernamePlaceholder")}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* First & Last Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">{t("auth.firstName")}</Label>
                      <Input
                        id="first-name"
                        type="text"
                        placeholder={t("auth.firstNamePlaceholder")}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">{t("auth.lastName")}</Label>
                      <Input
                        id="last-name"
                        type="text"
                        placeholder={t("auth.lastNamePlaceholder")}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">
                      {t("auth.password")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder={t("auth.passwordCreate")}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        className="pl-10"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      {t("auth.confirmPassword")}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder={t("auth.confirmPasswordPlaceholder")}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {signUpPassword &&
                    confirmPassword &&
                    signUpPassword !== confirmPassword && (
                      <p className="text-sm text-destructive">
                        {t("auth.passwordsMismatch")}
                      </p>
                    )}

                  <Button
                    type="submit"
                    className="w-full justify-center bg-yellow-500 text-black hover:bg-primary hover:text-black"
                    disabled={isLoading || signUpPassword !== confirmPassword}
                    variant="hero"
                  >
                    {isLoading
                      ? t("auth.creatingAccount")
                      : t("auth.createAccount")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
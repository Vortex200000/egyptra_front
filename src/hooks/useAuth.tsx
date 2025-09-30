// import { createContext, useContext, useEffect, useState } from 'react';
// import { User, Session } from '@supabase/supabase-js';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';

// interface AuthContextType {
//   user: User | null;
//   session: Session | null;
//   loading: boolean;
//   signUp: (email: string, password: string) => Promise<{ error: any }>;
//   signIn: (email: string, password: string) => Promise<{ error: any }>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     // Set up auth state listener FIRST
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setSession(session);
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     // THEN check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signUp = async (email: string, password: string) => {
//     const redirectUrl = `${window.location.origin}/`;

//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: redirectUrl
//       }
//     });

//     if (error) {
//       toast({
//         title: "Sign Up Failed",
//         description: error.message,
//         variant: "destructive"
//       });
//     } else {
//       toast({
//         title: "Check Your Email",
//         description: "We've sent you a confirmation link to complete your signup.",
//       });
//     }

//     return { error };
//   };

//   const signIn = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     });

//     if (error) {
//       toast({
//         title: "Sign In Failed",
//         description: error.message,
//         variant: "destructive"
//       });
//     }

//     return { error };
//   };

//   const signOut = async () => {
//     await supabase.auth.signOut();
//     toast({
//       title: "Signed Out",
//       description: "You have been successfully signed out.",
//     });
//   };

//   const value = {
//     user,
//     session,
//     loading,
//     signUp,
//     signIn,
//     signOut,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config/api";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  signUp: (
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    confirmPassword: string
  ) => Promise<any>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access") || null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refresh") || null
  );
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile if access token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/profile/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [accessToken]);

  const signUp = async (
    email: string,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    confirmPassword: string
  ) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          first_name: firstName,
          last_name: lastName,
          password,
          password_confirm: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        // Extract error messages
        let errorMsg = data.message || "Registration failed";

        if (data.errors) {
          const fieldErrors = Object.entries(data.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${(messages as string[]).join(", ")}`
            )
            .join(" | ");

          errorMsg += ` - ${fieldErrors}`;
        }

        throw new Error(errorMsg);
      }

      toast({
        title: "Account created",
        description: "You can now sign in.",
      });
      return { success: true, error: null };
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  //   const signIn = async (email: string, password: string) => {
  //     try {
  //       const res = await fetch(`${API_URL}/login/`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email, password }),
  //       });

  //       if (!res.ok) throw new Error("Invalid credentials");

  //       const data = await res.json();
  //       setAccessToken(data.access);
  //       setRefreshToken(data.refresh);

  //       localStorage.setItem("access", data.access);
  //       localStorage.setItem("refresh", data.refresh);

  //       // Fetch user profile
  //       const profileRes = await fetch(`${API_URL}/profile/`, {
  //         headers: { Authorization: `Bearer ${data.access}` },
  //       });
  //       if (profileRes.ok) {
  //         const profileData = await profileRes.json();
  //         setUser(profileData);
  //       }

  //       toast({ title: "Signed In", description: "Welcome back!" });
  //     } catch (error: any) {
  //       toast({
  //         title: "Sign In Failed",
  //         description: error.message,
  //         variant: "destructive",
  //       });
  //     }
  //   };
  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg =
          data?.message ||
          (data?.errors ? JSON.stringify(data.errors) : "Invalid credentials");

        toast({
          title: "Sign In Failed",
          description: msg,
          variant: "destructive",
        });

        return { error: msg };
      }

      const access = data.tokens.access;
      const refresh = data.tokens.refresh;

      setAccessToken(access);
      setRefreshToken(refresh);
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("role", data.user.role);

      const profileRes = await fetch(`${API_URL}/api/auth/profile/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      if (profileRes.ok) {
        setUser(await profileRes.json());
      }

      toast({ title: "Signed In", description: "Welcome back!" });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error: error.message };
    }
  };

  const signOut = async () => {
    const refresh = localStorage.getItem("refresh");

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    try {
      const res = await fetch(`${API_URL}/api/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Logout failed:", data);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    toast({ title: "Signed Out", description: "You have been signed out." });
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return;
    try {
      const res = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.access);
        localStorage.setItem("access", data.access);
      } else {
        signOut();
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      signOut();
    }
  };

  const value: AuthContextType = {
    user,
    accessToken,
    refreshToken,
    loading,
    signUp,
    signIn,
    signOut,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

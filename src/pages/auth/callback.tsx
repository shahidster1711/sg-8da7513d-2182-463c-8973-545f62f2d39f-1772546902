import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    handleCallback();
  }, []);

  async function handleCallback() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error during auth callback:", error);
      router.push("/auth/login");
      return;
    }

    if (data.session?.user) {
      // Check if profile exists, create if not
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.session.user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.from("profiles").insert({
          id: data.session.user.id,
          email: data.session.user.email,
          full_name: data.session.user.user_metadata.full_name || data.session.user.user_metadata.name,
          avatar_url: data.session.user.user_metadata.avatar_url,
        });
      }

      router.push("/");
    } else {
      router.push("/auth/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}
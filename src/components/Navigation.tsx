import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { getUnreadCount } from "@/services/messageService";
import { 
  Home, 
  Search, 
  PlusCircle, 
  MessageCircle, 
  User,
  Settings,
  LogOut,
  Heart,
  Package,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import type { Profile } from "@/types";

export function Navigation() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(session?.user || null);
  }

  async function fetchProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(data);
  }

  async function fetchUnreadCount() {
    const { count } = await getUnreadCount(user.id);
    setUnreadCount(count);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    window.location.reload();
  }

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AndamanBazaar
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="flex items-center gap-6">
              <Link href="/search">
                <Button variant="ghost" className="gap-2">
                  <Search className="h-5 w-5" />
                  Browse
                </Button>
              </Link>

              {user ? (
                <>
                  <Link href="/post">
                    <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      <PlusCircle className="h-5 w-5" />
                      Post Ad
                    </Button>
                  </Link>

                  <Link href="/messages">
                    <Button variant="ghost" className="gap-2 relative">
                      <MessageCircle className="h-5 w-5" />
                      Messages
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url || ""} />
                          <AvatarFallback>
                            {profile?.full_name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(`/profile/${user.id}`)}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                        {theme === "dark" ? (
                          <Sun className="mr-2 h-4 w-4" />
                        ) : (
                          <Moon className="mr-2 h-4 w-4" />
                        )}
                        Toggle Theme
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link href="/auth/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex justify-around items-center max-w-lg mx-auto">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 ${
                  isActive("/") ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <Home className={`h-6 w-6 ${isActive("/") ? "fill-blue-600" : ""}`} />
                <span className="text-xs font-medium">Home</span>
              </Button>
            </Link>

            <Link href="/search">
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 ${
                  isActive("/search") ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <Search className="h-6 w-6" />
                <span className="text-xs font-medium">Search</span>
              </Button>
            </Link>

            <Link href="/post">
              <Button
                size="sm"
                className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg -mt-6"
              >
                <PlusCircle className="h-7 w-7" />
              </Button>
            </Link>

            <Link href="/messages">
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 relative ${
                  isActive("/messages") ? "text-blue-600" : "text-gray-600"
                }`}
              >
                <MessageCircle className="h-6 w-6" />
                {unreadCount > 0 && (
                  <Badge className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
                <span className="text-xs font-medium">Messages</span>
              </Button>
            </Link>

            <Link href={user ? `/profile/${user.id}` : "/auth/login"}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 ${
                  router.pathname.startsWith("/profile") ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {user ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-xs">
                      {profile?.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-6 w-6" />
                )}
                <span className="text-xs font-medium">Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
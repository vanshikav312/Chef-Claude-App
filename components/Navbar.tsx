"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Bookmark, History, LogOut, LogIn, Compass, Layers } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { href: "/", label: "AI Studio", icon: Sparkles },
    { href: "/saved", label: "Saved Recipes", icon: Bookmark },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <>
      {/* Desktop Sticky Header */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/85 border-b border-gray-100 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-2.5 bg-bite-red rounded-2xl text-white shadow-md shadow-bite-red/20 group-hover:scale-105 transition-transform flex items-center justify-center">
                <Layers className="w-5 h-5 text-bite-accent" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-bite-red block leading-none">
                  BITE<span className="text-bite-accent">.AI</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest text-bite-muted uppercase block mt-0.5">
                  Chef Assistant
                </span>
              </div>
            </Link>

            {user && (
              <div className="hidden md:flex items-center gap-1.5 bg-bite-bg/80 p-1.5 rounded-full border border-gray-100">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-bite-red text-white shadow-sm"
                          : "text-bite-muted hover:text-bite-red hover:bg-white/60"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-bite-accent" : ""}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[10px] font-black text-bite-muted uppercase tracking-wider">
                    {user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </span>
                  <button
                    onClick={handleSignOut}
                    title="Sign out"
                    className="p-2.5 rounded-full text-bite-muted hover:text-bite-red hover:bg-bite-red/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-bite-red hover:bg-[#8A0000] shadow-md shadow-bite-red/20 hover:shadow-lg transition-all"
                >
                  <LogIn className="w-3.5 h-3.5 text-bite-accent" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {user && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden pointer-events-none animate-slide-up">
          <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl shadow-bite-red/10 rounded-full py-2 px-4 flex items-center justify-around pointer-events-auto max-w-sm mx-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-full transition-all relative ${
                    isActive ? "text-bite-red" : "text-bite-muted hover:text-bite-red/70"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-bite-accent" : ""}`} />
                  <span className="text-[9px] font-bold tracking-tight">{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-bite-red" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

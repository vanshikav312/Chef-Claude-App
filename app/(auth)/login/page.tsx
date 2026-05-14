"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, ArrowRight, Layers } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-bite-red/5 via-transparent to-bite-accent/10 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-bite-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100 relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-bite-red/5 text-bite-red rounded-2xl mb-3 border border-bite-red/10">
            <Layers className="w-8 h-8 text-bite-accent" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-bite-text tracking-tight">
            Sign In
          </h2>
          <p className="text-xs text-bite-muted mt-1 font-medium">
            Access your AI Chef Studio via Supabase Secure Auth
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-xs font-bold text-bite-red text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-bite-muted uppercase tracking-wider mb-1.5 px-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@example.com"
                className="w-full pl-10 pr-4 py-3.5 bg-bite-bg/50 border border-gray-200/80 rounded-full text-bite-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bite-accent/20 focus:border-bite-accent transition-all text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-bite-muted uppercase tracking-wider mb-1.5 px-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3.5 bg-bite-bg/50 border border-gray-200/80 rounded-full text-bite-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bite-accent/20 focus:border-bite-accent transition-all text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-bite-red hover:bg-[#8A0000] text-white font-black rounded-full text-xs tracking-wide shadow-md shadow-bite-red/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-70 mt-4"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Secure Sign In</span>
                <ArrowRight className="w-3.5 h-3.5 text-bite-accent" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-bite-muted mt-6 pt-5 border-t border-gray-50 font-medium">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-bite-red hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}

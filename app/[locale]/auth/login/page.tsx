"use client";

import { Card, CardContent } from "@/components/ui/card";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Navbarblogs from "@/components/Navbarblogs";
import apiRequest from "@/lib/apiRequest";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { updateUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest.post("/auth/login", { email, password });
      updateUser(res.data);
      toast.success("Login successful!");
      // Redirect to home or desired page
      router.push(`/${locale}/blogs`);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center  px-4 py-10 md:py-0 relative">
      <Navbarblogs />
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="rounded-2xl shadow-xl backdrop-blur-lg bg-white/70 dark:bg-black/70">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold font-teko tracking-wide text-foreground">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-sm">
                Login to your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-base font-semibold"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

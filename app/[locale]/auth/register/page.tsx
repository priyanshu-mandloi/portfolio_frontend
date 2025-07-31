"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Navbarblogs from "@/components/Navbarblogs";
import { UploadCloud } from "lucide-react";
import apiRequest from "@/lib/apiRequest";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", name);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      await apiRequest.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Registration successful!");
      // Redirect to login page
      router.push(`/${locale}/auth/login`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center  px-4 py-10 md:py-0 relative">
      <Navbarblogs />
      <motion.div
        className="w-full max-w-md mt-30"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="rounded-2xl shadow-xl backdrop-blur-lg bg-white/70 dark:bg-black/70">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold font-teko tracking-wide text-foreground">
                Create Account
              </h1>
              <p className="text-muted-foreground text-sm">
                Sign up to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="name"
                name="username"
                required
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter password here..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="flex items-center space-x-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-input bg-muted flex-shrink-0">
                  <Image
                    src={preview || "/assets/avatar_placeholder_dark.png"}
                    alt="Avatar preview"
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>

                <div className="relative w-full">
                  <Input
                    id="avatar"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="opacity-0 absolute inset-0 z-10 cursor-pointer"
                  />
                  <div className="w-full border border-input rounded-md py-2 px-3 flex items-center justify-between text-muted-foreground text-sm z-0 bg-background">
                    {avatar ? avatar.name : "Upload profile picture"}
                    <UploadCloud className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full text-base font-semibold"
                disabled={loading}
              >
                {loading ? "Registering…" : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

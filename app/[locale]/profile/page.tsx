"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbarblogs from "@/components/Navbarblogs";
import apiRequest from "@/lib/apiRequest";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { currentUser, updateUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Profile picture must be less than 2 MB.");
        return;
      }
      setAvatar(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);
    if (currentPassword && newPassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    try {
      const res = await apiRequest.put("/auth/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data.user);
      toast.success("Profile updated successfully!");
      router.push("/blogs");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 dark:text-gray-300">
          Please login to edit your profile.
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbarblogs />
      <div className="flex justify-center items-center min-h-screen px-4 pt-24">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6 space-y-6"
        >
          <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
            Edit Profile
          </h1>

          {/* Username */}
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {/* Avatar */}
          <div className="space-y-1">
            <Label htmlFor="avatar">Profile Picture</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Max file size: 2 MB
            </p>
          </div>

          {/* Change Password */}
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Change Password
          </h2>
          <div className="space-y-1">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </div>
    </>
  );
}

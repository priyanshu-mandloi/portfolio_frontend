"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ModeToggle } from "./ModeToggle";
import apiRequest from "@/lib/apiRequest";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const navItems = [
  { href: "/", label: "Portfolio" },
  { href: "/blogs", label: "Blogs" },
];

export default function Navbarblogs() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, loadingUser, updateUser } = useAuth();

  useEffect(() => {
    setIsMounted(true);
    const toggleBackground = () => {
      const header = document.querySelector("header");
      if (!header) return;
      if (window.scrollY > 20) {
        header.classList.add("bg-white/10", "backdrop-blur-lg");
      } else {
        header.classList.remove("bg-white/10", "backdrop-blur-lg");
      }
    };
    window.addEventListener("scroll", toggleBackground);
    return () => window.removeEventListener("scroll", toggleBackground);
  }, []);

  const toggleMenu = () => setIsOpen((p) => !p);

  const avatarSrc =
    currentUser?.avatarUrl ||
    (isMounted && theme === "dark"
      ? "/assets/avatar_placeholder_dark.png"
      : "/assets/avatar_placeholder.png");

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      localStorage.removeItem("user");
      updateUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full z-50 bg-transparent fixed top-0 left-0">
      {/* Desktop Navbar */}
      <nav
        className="hidden md:grid grid-cols-3 items-center px-6 py-4 max-w-screen-xl mx-auto"
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Left – Logo */}
        <div className="relative h-16 w-28 flex-shrink-0">
          {isMounted && (
            <Image
              src={
                theme === "dark" ? "/assets/logo_light.png" : "/assets/logo.png"
              }
              alt="Website Logo"
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Center – Nav links */}
        <ul className="flex justify-center space-x-8 font-oleo text-xl">
          {navItems.map(({ href, label }) => (
            <li key={href}>
              <Link href={href as any} className="relative group inline-block">
                <span className="transition-colors duration-500 group-hover:text-purple-400">
                  {label}
                </span>
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-purple-700 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right – Mode toggle & auth */}
        <div className="flex items-center justify-end gap-4">
          <ModeToggle />

          {loadingUser ? (
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          ) : currentUser ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative h-10 w-10 rounded-full border-2 border-violet-600 overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform">
                    <Image
                      src={avatarSrc}
                      alt="avatar"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  {currentUser?.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="destructive"
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium cursor-pointer"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href={"/auth/login" as any}>
                <Button variant="outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href={"/auth/register" as any}>
                <Button variant="outline" className="cursor-pointer">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto">
        <div className="relative h-16 w-28 flex-shrink-0">
          {isMounted && (
            <Image
              src={
                theme === "dark" ? "/assets/logo_light.png" : "/assets/logo.png"
              }
              alt="Website Logo"
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
        <ModeToggle />
        {!loadingUser && currentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative h-10 w-10 rounded-full border-2 border-violet-600 overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform">
                <Image
                  src={avatarSrc}
                  alt="avatar"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/profile">Edit Profile</Link>
              </DropdownMenuItem>
              {currentUser?.role === "ADMIN" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <button
          onClick={toggleMenu}
          className="focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {/* Mobile Dropdown Panel */}
      {isOpen && (
        <nav className="md:hidden absolute top-[72px] left-0 right-0 bg-white/10 backdrop-blur-lg dark:text-white text-black shadow-lg rounded-b-lg p-6">
          <ul className="flex flex-col gap-4 font-oleo text-lg">
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <Link href={href as any} onClick={toggleMenu}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            {loadingUser ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : currentUser ? (
              <Button
                variant="destructive"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="cursor-pointer"
              >
                Logout
              </Button>
            ) : (
              <Link href={"/auth/login" as any} onClick={toggleMenu}>
                <Button variant="outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

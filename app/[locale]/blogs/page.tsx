"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageSquare, Pencil, Share2, Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Link from "next/link";
import Loader from "@/components/Loader";
import Navbarblogs from "@/components/Navbarblogs";
import apiRequest from "@/lib/apiRequest";
import { gsap } from "gsap";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Blog {
  id: string;
  title: string;
  topic: string;
  tags: string[];
  isPublic: boolean;
  image: string;
  authorId: string;
  _count?: { comments: number; likes: number };
}

export default function BlogsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest.get("/blogs");
      setBlogs(res.data);
    } catch {
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".blog-card",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [loading, blogs]);

  const topics = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.topic))).sort(),
    [blogs]
  );

  const availableTagPool = filterTopic
    ? blogs.filter((b) => b.topic === filterTopic)
    : blogs;

  const tags = useMemo(
    () =>
      Array.from(
        new Set(availableTagPool.flatMap((b) => b.tags.map((t) => t.trim())))
      )
        .filter(Boolean)
        .sort(),
    [availableTagPool]
  );

  const filteredBlogs = useMemo(() => {
    let list = blogs;
    if (filterTopic) list = list.filter((b) => b.topic === filterTopic);
    if (filterTag) list = list.filter((b) => b.tags.includes(filterTag));
    return list;
  }, [blogs, filterTopic, filterTag]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog?")) return;
    try {
      await apiRequest.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      setBlogs((b) => b.filter((x) => x.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleShare = (e: React.MouseEvent, blog: Blog) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/blogs/${blog.id}`
        : `/blogs/${blog.id}`;
    const title = blog.title;
    const text = `Check out this blog: ${blog.title}`;
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      (navigator as any)
        .share({ title, text, url })
        .then(() => toast.success("Shared"))
        .catch(() => {
          navigator.clipboard?.writeText(url);
        });
      return;
    }
    try {
      navigator.clipboard?.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbarblogs />
      <Toaster position="top-right" />

      <section className="mt-20 py-10">
        <div className="flex justify-between items-center px-6 md:px-20 p-0 md:p-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold"
          >
            Blogs
          </motion.h1>
          {currentUser?.role === "ADMIN" && (
            <Button
              onClick={() => router.push("/blogs/create")}
              className="bg-green-500 cursor-pointer"
            >
              Create Blog
            </Button>
          )}
        </div>

        <div className="flex gap-3 flex-wrap px-6 md:px-20 mt-6">
          <Button
            variant={filterTopic === null ? "default" : "outline"}
            onClick={() => {
              setFilterTopic(null);
              setFilterTag(null);
            }}
            className="cursor-pointer"
          >
            All
          </Button>
          {topics.map((topic) => (
            <Button
              key={topic}
              variant={filterTopic === topic ? "default" : "outline"}
              onClick={() => {
                const same = filterTopic === topic;
                setFilterTopic(same ? null : topic);
                setFilterTag(null);
              }}
              className="cursor-pointer"
            >
              {topic}
            </Button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-6 md:px-20 mt-10">
          {loading ? (
            <Loader />
          ) : filteredBlogs.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">
              No blogs available.
            </p>
          ) : (
            filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="blog-card block relative h-64 rounded-xl overflow-hidden shadow-md group"
              >
                <Card className="relative h-full w-full border-none shadow-none cursor-pointer">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${blog.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none select-none">
                    <h3 className="text-lg md:text-xl font-semibold line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm opacity-80">Topic: {blog.topic}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-white/20 px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-between items-center pointer-events-auto">
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/blogs/${blog.id}#comments`);
                          }}
                          className="inline-flex items-center gap-1 hover:opacity-80"
                          aria-label="View likes"
                        >
                          <Heart className="w-4 h-4 text-red-500" />
                          {blog._count?.likes ?? 0}
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push(`/blogs/${blog.id}#comments`);
                          }}
                          className="inline-flex items-center gap-1 hover:opacity-80"
                          aria-label="View comments"
                        >
                          <MessageSquare className="w-4 h-4" />
                          {blog._count?.comments ?? 0}
                        </button>
                        <button
                          onClick={(e) => handleShare(e, blog)}
                          className="inline-flex items-center gap-1 hover:opacity-80 cursor-pointer"
                          aria-label="Share blog"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                      {currentUser?.role === "ADMIN" && (
                        <div className="flex gap-2">
                          <Pencil
                            className="w-4 h-4 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              router.push(`/blogs/edit/${blog.id}`);
                            }}
                          />
                          <Trash2
                            className="w-4 h-4 cursor-pointer text-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(blog.id);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>

      <div className="mt-30">
        <Footer />
      </div>
    </div>
  );
}

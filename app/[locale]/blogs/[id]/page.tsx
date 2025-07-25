"use client";

import "@/styles/blog_content.css";

import { Heart, MessageSquare, Pencil, Trash2, User } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import DOMPurify from "isomorphic-dompurify";
import Footer from "@/components/Footer";
import Image from "next/image";
import Navbarblogs from "@/components/Navbarblogs";
import { Textarea } from "@/components/ui/textarea";
import apiRequest from "@/lib/apiRequest";
import { normalizeBlogHtml } from "@/lib/normalize-blog-html";
import { useAuth } from "@/context/AuthContext";

interface BlogComment {
  id: string;
  content: string;
  createdAt: string;
  user?: {
    id?: string;
    username?: string;
    avatarUrl?: string | null;
  };
  userId?: string; // Add this field for backend compatibility
}

interface BlogLike {
  id: string;
  userId: string;
}

interface Blog {
  id: string;
  title: string;
  content: string;
  contentHtml?: string;
  topic: string;
  tags: string[];
  image: string;
  isPublic: boolean;
  authorId: string;
  author?: {
    id: string;
    username?: string;
    avatarUrl?: string | null;
  };
  comments?: BlogComment[];
  likes?: BlogLike[];
}

export default function BlogDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const router = useRouter();
  const { currentUser } = useAuth();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [likeBusy, setLikeBusy] = useState(false);
  const [delBusy, setDelBusy] = useState(false);
  const [commentDeleting, setCommentDeleting] = useState<string | null>(null);

  const fetchBlog = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await apiRequest.get(`/blogs/${id}`);
      setBlog(res.data);
    } catch (error) {
      console.error("Fetch blog error:", error);
      toast.error("Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  useEffect(() => {
    // Debug currentUser
    console.log("Current User:", currentUser);
    console.log("Current User ID:", currentUser?.id);
  }, [currentUser]);

  const likeCount = blog?.likes?.length ?? 0;
  const userHasLiked =
    !!currentUser && !!blog?.likes?.some((l) => l.userId === currentUser.id);

  const commentCount = blog?.comments?.length ?? 0;

  const sanitizedHtml = useMemo(() => {
    const html = blog?.contentHtml ?? blog?.content ?? "";
    const normalized = normalizeBlogHtml(html);
    return DOMPurify.sanitize(normalized, {
      ADD_ATTR: ["style", "class", "id", "data-language"],
      ADD_TAGS: ["pre", "code", "iframe", "figure", "figcaption"],
    });
  }, [blog?.contentHtml, blog?.content]);

  const handleLike = async () => {
    if (!currentUser) return toast.error("Login to like");
    if (!blog) return;
    if (userHasLiked) {
      toast("Already liked");
      return;
    }
    try {
      setLikeBusy(true);
      setBlog((prev) =>
        prev
          ? {
              ...prev,
              likes: [
                ...(prev.likes ?? []),
                { id: "temp", userId: currentUser.id },
              ],
            }
          : prev
      );
      await apiRequest.post(`/blogs/${blog.id}/like`);
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Like failed");
      setBlog((prev) =>
        prev
          ? {
              ...prev,
              likes: (prev.likes ?? []).filter(
                (l) => l.userId !== currentUser.id
              ),
            }
          : prev
      );
    } finally {
      setLikeBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;
    if (!confirm("Delete this blog?")) return;
    try {
      setDelBusy(true);
      await apiRequest.delete(`/blogs/${blog.id}`);
      toast.success("Blog deleted");
      router.push("/blogs");
    } catch (error) {
      console.error("Delete blog error:", error);
      toast.error("Delete failed");
    } finally {
      setDelBusy(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!currentUser) return toast.error("Login to comment");
    const text = comment.trim();
    if (!text) return toast.error("Comment can't be empty");

    // Declare tempComment outside try block so it's accessible in catch
    const tempComment: BlogComment = {
      id: `temp-${Date.now()}`,
      content: text,
      createdAt: new Date().toISOString(),
      userId: currentUser.id, // Add userId for backend compatibility
      user: {
        id: currentUser.id,
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
      },
    };

    try {
      // Optimistically update UI
      setBlog((prev) =>
        prev
          ? { ...prev, comments: [...(prev.comments ?? []), tempComment] }
          : prev
      );
      setComment("");

      // Make API call
      const response = await apiRequest.post(`/blogs/${id}/comment`, {
        content: text,
      });

      // Update with real comment data from server
      setBlog((prev) => {
        if (!prev) return prev;
        const updatedComments = [...(prev.comments ?? [])];
        const tempIndex = updatedComments.findIndex(
          (c) => c.id === tempComment.id
        );
        if (tempIndex !== -1) {
          updatedComments[tempIndex] = response.data;
        }
        return { ...prev, comments: updatedComments };
      });

      toast.success("Comment added");
    } catch (error) {
      console.error("Comment error:", error);
      toast.error("Comment failed");

      // Remove temp comment on failure
      setBlog((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments?.filter((c) => c.id !== tempComment.id),
        };
      });
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!currentUser) return toast.error("Unauthorized");
    if (!confirm("Delete this comment?")) return;

    try {
      setCommentDeleting(commentId);

      // Make API call first
      await apiRequest.delete(`/blogs/${id}/comment/${commentId}`);

      // Update UI after successful deletion
      setBlog((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments?.filter((c) => c.id !== commentId),
            }
          : prev
      );

      toast.success("Comment deleted");
    } catch (error) {
      console.error("Delete comment error:", error);
      toast.error("Failed to delete comment");
    } finally {
      setCommentDeleting(null);
    }
  };

  const scrollToComments = () => {
    const el = document.getElementById("comments");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Helper function to check if user can delete comment
  const canDeleteComment = (comment: BlogComment) => {
    if (!currentUser) return false;

    // Admin can delete any comment
    if (currentUser.role === "ADMIN") return true;

    // User can delete their own comment
    // Check both user.id and userId for compatibility
    return (
      currentUser.id === comment.user?.id || currentUser.id === comment.userId
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbarblogs />
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto p-4 mb-24 mt-24 space-y-6 animate-pulse">
          <div className="w-full aspect-video rounded-lg bg-muted" />
          <div className="h-10 w-2/3 bg-muted rounded" />
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbarblogs />
        <Toaster position="top-right" />
        <p className="mt-20 text-center">Blog not found.</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbarblogs />
      <Toaster position="top-right" />

      <article className="max-w-3xl lg:max-w-4xl mx-auto px-4 mt-24">
        <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-8">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1280px) 80vw, 1200px"
            className="object-cover"
            priority
          />
        </div>

        <h1 className="relative mb-2 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
          <span className="relative z-10">{blog.title}</span>
          <span className="absolute inset-0 top-3 bottom-1 -z-0 bg-primary/20 blur-sm rounded-sm" />
        </h1>

        <div
          className="mt-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm 
                     text-muted-foreground border-t border-b border-border"
        >
          <div className="flex flex-wrap items-center gap-3">
            {blog.author?.avatarUrl ? (
              <Image
                src={blog.author.avatarUrl}
                alt={blog.author?.username || "Author"}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 opacity-70" />
            )}
            <span>{blog.author?.username ?? "Unknown"}</span>
            <span>•</span>
            <span>{blog.topic}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleLike}
              disabled={likeBusy || userHasLiked}
              className="flex items-center gap-1 sm:gap-2"
              aria-label="Like this post"
            >
              <Heart
                className={`w-4 h-4 ${
                  userHasLiked ? "text-red-500 fill-red-500" : ""
                }`}
              />
              <span>{likeCount}</span>
            </Button>

            <a
              href="#comments"
              onClick={(e) => {
                e.preventDefault();
                scrollToComments();
              }}
              className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-md hover:bg-muted transition"
              aria-label="Jump to comments"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{commentCount}</span>
            </a>

            {currentUser?.role === "ADMIN" && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.push(`/blogs/edit/${blog.id}`)}
                  className="flex items-center gap-1 sm:gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  disabled={delBusy}
                  className="flex items-center gap-1 sm:gap-2 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {blog.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags.map((t) => (
              <button
                key={t}
                className="text-xs bg-muted px-2 py-0.5 rounded hover:bg-primary/20 hover:text-primary transition"
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        <div
          className="mt-10 blog-content prose prose-slate dark:prose-invert max-w-none leading-relaxed break-words"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />

        <div id="comments" className="scroll-mt-24 mt-16">
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Add a comment
          </h2>
          {currentUser ? (
            <>
              <Textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
              <Button className="mt-2" onClick={handleCommentSubmit}>
                Post Comment
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => router.push("/auth/login")}
            >
              Login to comment
            </Button>
          )}
        </div>

        {blog.comments && blog.comments.length > 0 && (
          <div className="mt-10 space-y-6">
            {!currentUser && <div id="comments" className="scroll-mt-24" />}
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments ({blog.comments.length})
            </h2>
            {blog.comments.map((c) => (
              <div
                key={c.id}
                className="flex gap-3 p-4 rounded-lg border border-border bg-card relative"
              >
                {c.user?.avatarUrl ? (
                  <div className="relative h-10 w-10 rounded-full overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform">
                    <Image
                      src={c.user.avatarUrl}
                      alt={c.user.username || "User"}
                      fill
                      sizes="40px"
                      className="rounded-full object-cover flex-shrink-0"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted flex-shrink-0">
                    <User className="w-4 h-4 opacity-70" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">
                    {c.user?.username || "Anonymous"}
                  </p>
                  <p className="text-sm">{c.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>

                {canDeleteComment(c) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => handleCommentDelete(c.id)}
                    disabled={commentDeleting === c.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </article>

      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}

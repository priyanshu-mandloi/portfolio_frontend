"use client";

import { Edit, Upload } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbarblogs from "@/components/Navbarblogs";
import { Switch } from "@/components/ui/switch";
import apiRequest from "@/lib/apiRequest";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";

// Replace MarkdownEditor with TipTapEditor
const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

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
}

export default function EditBlogPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const router = useRouter();
  const { currentUser } = useAuth();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    topic: "",
    tags: "",
    isPublic: true,
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const res = await apiRequest.get(`/blogs/${id}`);
      const data: Blog = res.data;
      setBlog(data);
      setForm({
        title: data.title,
        content: data.contentHtml ?? data.content ?? "",
        topic: data.topic,
        tags: data.tags.join(", "),
        isPublic: data.isPublic,
      });
      setPreview(data.image);
    } catch {
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadBlog();
  }, [id]);

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditorChange = (html: string) => {
    setForm((f) => ({ ...f, content: html }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(blog?.image ?? null);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog) return;
    if (!currentUser) {
      toast.error("You must be logged in.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content); // HTML
      fd.append("topic", form.topic);
      fd.append("tags", form.tags);
      fd.append("isPublic", form.isPublic ? "true" : "false");
      if (image) fd.append("image", image);

      await apiRequest.put(`/blogs/${blog.id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Blog updated");
      router.push(`/blogs/${blog.id}`);
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbarblogs />
        <Toaster position="top-right" />
        <p className="mt-24 text-center">Loading...</p>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbarblogs />
        <Toaster position="top-right" />
        <p className="mt-24 text-center">Blog not found.</p>
        <Footer />
      </div>
    );
  }

  if (currentUser?.role !== "ADMIN" && currentUser?.id !== blog.authorId) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbarblogs />
        <Toaster position="top-right" />
        <p className="mt-24 text-center">Not authorized.</p>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbarblogs />
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto p-4 mt-24">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Edit className="w-5 h-5" /> Edit Blog
        </h1>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleField}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <TiptapEditor value={form.content} onChange={handleEditorChange} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                name="topic"
                value={form.topic}
                onChange={handleField}
                required
              />
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={form.tags}
                onChange={handleField}
                placeholder="tag1, tag2"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isPublic}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isPublic: v }))}
              />
              <Label>{form.isPublic ? "Public" : "Private"}</Label>
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Label
              htmlFor="image"
              className="flex flex-col items-center gap-2 cursor-pointer hover:text-primary transition-colors"
            >
              <Upload className="w-8 h-8" />
              <span>
                {image ? "Change Featured Image" : "Replace Featured Image"}
              </span>
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-4 w-full max-h-64 object-cover rounded-lg"
              />
            )}
          </div>

          <Button type="submit" size="lg" disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

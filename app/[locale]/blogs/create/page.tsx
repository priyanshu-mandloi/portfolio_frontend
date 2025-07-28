"use client";

import { Edit, Eye, Upload } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbarblogs from "@/components/Navbarblogs";
import { Switch } from "@/components/ui/switch";
import apiRequest from "@/lib/apiRequest";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { normalizeBlogHtml } from "@/lib/normalize-blog-html";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
const LOCAL_STORAGE_KEY = "create-blog-draft";

const saveDraftToLocalStorage = (data: any) => {
  const payload = {
    data,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
};

const loadDraftFromLocalStorage = () => {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const savedAt = new Date(parsed.savedAt);
    const now = new Date();
    const diff = now.getTime() - savedAt.getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (diff < sevenDays) return parsed.data;
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
  return null;
};
export default function CreateBlogPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    title: "",
    content: "",
    topic: "",
    tags: "",
    isPublic: true,
  });
  const [editorJSON, setEditorJSON] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const draft = loadDraftFromLocalStorage();
    if (draft) {
      setForm(draft.form);
      setEditorJSON(draft.editorJSON || null);
    }
  }, []);
  const autoSave = (updatedForm: any, updatedJSON: any = editorJSON) => {
    setSaving(true);
    saveDraftToLocalStorage({ form: updatedForm, editorJSON: updatedJSON });
    setTimeout(() => setSaving(false), 500);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);
    autoSave(updatedForm);
  };

  const handleEditorChange = (html: string, json?: any) => {
    const updatedForm = { ...form, content: html };
    setForm(updatedForm);
    setEditorJSON(json || null);
    autoSave(updatedForm, json);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select an image");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("topic", form.topic);
    formData.append("tags", form.tags);
    formData.append("isPublic", form.isPublic ? "true" : "false");
    formData.append("image", image);
    if (editorJSON) {
      formData.append("contentJSON", JSON.stringify(editorJSON));
    }
    try {
      await apiRequest.post("/blogs/create", formData, {
        withCredentials: true,
        headers: currentUser?.token
          ? { Authorization: `Bearer ${currentUser.token}` }
          : undefined,
      });
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast.success("Blog created successfully!");
      router.push("/blogs");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to create blog";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderPreviewContent = (htmlContent: string) => {
    if (!htmlContent) return { __html: "" };
    const processedContent = normalizeBlogHtml(htmlContent);
    return { __html: processedContent };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbarblogs />
      <Toaster position="top-right" />

      {/* Custom preview styles (light/dark) */}
      <style jsx global>{`
        .preview-content {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          line-height: 1.8;
          color: inherit;
        }

        .preview-content h1,
        .preview-content h2,
        .preview-content h3,
        .preview-content h4,
        .preview-content h5,
        .preview-content h6 {
          margin-block: 1.2em 0.6em;
          font-weight: 600;
          line-height: 1.3;
        }

        .preview-content h1 {
          font-size: 2em;
        }
        .preview-content h2 {
          font-size: 1.75em;
        }
        .preview-content h3 {
          font-size: 1.5em;
        }
        .preview-content h4 {
          font-size: 1.25em;
        }
        .preview-content h5 {
          font-size: 1.1em;
        }
        .preview-content h6 {
          font-size: 1em;
        }

        .preview-content p,
        .preview-content li {
          margin-block: 0.6em;
        }

        .preview-content ul,
        .preview-content ol {
          margin-block: 1em;
          padding-left: 1.5em;
          list-style-position: outside;
        }

        .preview-content li {
          margin-block: 0.4em;
        }

        .preview-content blockquote {
          border-left: 4px solid #007acc;
          margin: 20px 0;
          padding: 10px 0 10px 20px;
          color: #666;
          font-style: italic;
          background: rgba(0, 122, 204, 0.05);
        }

        .dark .preview-content blockquote {
          border-left-color: #58a6ff;
          color: #8b949e;
          background: rgba(88, 166, 255, 0.05);
        }

        .preview-content code:not(.code-block code) {
          background: #f1f3f4;
          border: 1px solid #dadce0;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono",
            Consolas, "Courier New", monospace;
          color: #d63384;
        }

        .dark .preview-content code:not(.code-block code) {
          background: #2d2d2d;
          border-color: #404040;
          color: #ff6b9d;
        }

        .preview-content a {
          color: #007acc;
          text-decoration: underline;
        }

        .dark .preview-content a {
          color: #58a6ff;
        }

        .preview-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .preview-content th,
        .preview-content td {
          border: 1px solid #e0e0e0;
          padding: 8px;
          text-align: left;
        }

        .preview-content th {
          background-color: #f3f4f6;
          font-weight: 600;
        }

        .dark .preview-content th,
        .dark .preview-content td {
          border-color: #3a3a3a;
        }

        .dark .preview-content th {
          background-color: #1f1f1f;
        }

        .preview-content .code-block {
          background: #f8f9fa !important;
          border: 1px solid #e9ecef !important;
          border-radius: 8px !important;
          padding: 16px !important;
          margin: 20px 0 !important;
          font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono",
            Consolas, "Courier New", monospace !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          overflow-x: auto !important;
          position: relative !important;
          white-space: pre !important;
          word-wrap: normal !important;
          color: #212529 !important;
        }

        .dark .preview-content .code-block {
          background: #1e1e1e !important;
          border-color: #3e3e3e !important;
          color: #d4d4d4 !important;
        }

        .preview-content .code-block::before {
          content: attr(data-language);
          position: absolute;
          top: -1px;
          right: -1px;
          background: #007acc;
          color: white;
          padding: 4px 10px;
          font-size: 11px;
          border-radius: 0 8px 0 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 500;
        }
      `}</style>

      {/* Mobile Preview Toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowPreview(!showPreview)}
          size="sm"
          className="rounded-full shadow-lg"
        >
          {showPreview ? (
            <Edit className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {showPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      <div className="max-w-7xl mx-auto p-4 mt-24">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8 text-center lg:text-left"
        >
          Create Blog{" "}
          {saving && (
            <span className="text-sm text-muted-foreground">(Saving...)</span>
          )}
        </motion.h2>

        <div className="grid lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
          {/* Form Section */}
          <div className={`${showPreview ? "hidden lg:block" : "block"}`}>
            <div className="bg-card border border-border rounded-lg p-6 h-full">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Blog Editor
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium mb-2 block"
                  >
                    Blog Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter your blog title..."
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="content"
                    className="text-sm font-medium mb-2 block"
                  >
                    Content
                  </Label>
                  <TiptapEditor
                    value={form.content}
                    onChange={handleEditorChange}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="topic"
                      className="text-sm font-medium mb-2 block"
                    >
                      Topic
                    </Label>
                    <Input
                      id="topic"
                      name="topic"
                      placeholder="e.g., JavaScript"
                      value={form.topic}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="tags"
                      className="text-sm font-medium mb-2 block"
                    >
                      Tags
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      placeholder="tag1, tag2, tag3"
                      value={form.tags}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.isPublic}
                      onCheckedChange={(val) =>
                        setForm((f) => {
                          const updated = { ...f, isPublic: val };
                          autoSave(updated);
                          return updated;
                        })
                      }
                    />
                    <Label className="font-medium">
                      {form.isPublic ? "Public Post" : "Private Draft"}
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {form.isPublic
                      ? "Visible to everyone"
                      : "Only visible to you"}
                  </span>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Label
                    htmlFor="image"
                    className="flex flex-col items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="text-sm font-medium">
                      {image
                        ? "Change Featured Image"
                        : "Upload Featured Image"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB
                    </span>
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {image && (
                    <p className="text-sm text-green-600 mt-2 flex items-center justify-center gap-2">
                      ✓ {image.name}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Blog Post"}
                </Button>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className={`${showPreview ? "block" : "hidden lg:block"}`}>
            <div className="bg-card border border-border rounded-lg p-6 h-full">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </h3>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                {imagePreview && (
                  <div className="mb-6">
                    <img
                      src={imagePreview}
                      alt="Featured image preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {form.title ? (
                  <h1 className="text-3xl font-bold mb-4 text-foreground">
                    {form.title}
                  </h1>
                ) : (
                  <h1 className="text-3xl font-bold mb-4 text-muted-foreground italic">
                    Your blog title will appear here...
                  </h1>
                )}

                <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground border-b border-border pb-4">
                  {form.topic && (
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {form.topic}
                    </span>
                  )}
                  {form.tags && (
                    <div className="flex flex-wrap gap-2">
                      {form.tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="ml-auto">
                    {form.isPublic ? "🌍 Public" : "🔒 Private"}
                  </span>
                </div>

                <div className="min-h-[300px] preview-content">
                  {form.content ? (
                    <div
                      dangerouslySetInnerHTML={renderPreviewContent(
                        form.content
                      )}
                    />
                  ) : (
                    <p className="text-red-500 italic text-center py-12">
                      Start writing your blog content to see the preview...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* End Preview */}
        </div>
      </div>
    </div>
  );
}

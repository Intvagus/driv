"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import type { Database } from "@/types/database";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toaster";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  author: z.string().optional(),
  status: z.enum(["draft", "published"]),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AdminBlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);

  const { register, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "draft" },
  });

  useEffect(() => {
    if (isNew) return;
    const supabase = createClient();
    supabase.from("blog_posts").select("*").eq("id", params.id).single().then((result: { data: unknown }) => {
      const data = result.data as BlogPost | null;
      if (data) reset({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt ?? "",
        content: data.content ?? "",
        author: data.author ?? "",
        status: data.status,
        seo_title: data.seo_title ?? "",
        seo_description: data.seo_description ?? "",
      });
      setLoading(false);
    });
  }, [params.id, isNew, reset]);

  const onSubmit = async (data: FormData) => {
    const supabase = createClient();
    const payload = {
      ...data,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    };
    if (isNew) {
      const { error } = await supabase.from("blog_posts").insert([payload]);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", params.id as string);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Saved!", variant: "success" });
    router.push("/admin/blog");
  };

  if (loading) return <div className="text-gray-400 py-12 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-serif font-bold text-brand-dark">{isNew ? "New Post" : "Edit Post"}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Title *</label>
            <Input {...register("title")} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Slug *</label>
            <Input {...register("slug")} />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Author</label>
            <Input {...register("author")} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Status</label>
            <Select defaultValue="draft" onValueChange={(v: string) => setValue("status", v as "draft" | "published")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Excerpt</label>
          <Textarea {...register("excerpt")} rows={2} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Content (Markdown)</label>
          <Textarea {...register("content")} rows={12} className="font-mono text-xs" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">SEO Title</label>
            <Input {...register("seo_title")} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">SEO Description</label>
            <Input {...register("seo_description")} />
          </div>
        </div>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isNew ? "Create Post" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

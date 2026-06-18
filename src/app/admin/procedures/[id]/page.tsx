"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import type { Database } from "@/types/database";

type Procedure = Database["public"]["Tables"]["procedures"]["Row"];
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toaster";

const schema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  category: z.enum(["surgical", "non_surgical"]),
  technique: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  featured: z.boolean().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  pre_op_care: z.string().optional(),
  post_op_care: z.string().optional(),
  risks: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AdminProcedureEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";
  const [loading, setLoading] = useState(!isNew);

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "draft", category: "surgical", featured: false },
  });

  useEffect(() => {
    if (isNew) return;
    const supabase = createClient();
    supabase.from("procedures").select("*").eq("id", params.id).single().then((result: { data: unknown }) => {
      const data = result.data as Procedure | null;
      if (data) {
        reset({
          title: data.title,
          slug: data.slug,
          category: data.category,
          technique: data.technique ?? "",
          description: data.description ?? "",
          status: data.status,
          featured: data.featured,
          seo_title: data.seo_title ?? "",
          seo_description: data.seo_description ?? "",
          pre_op_care: data.pre_op_care ?? "",
          post_op_care: data.post_op_care ?? "",
          risks: data.risks ?? "",
        });
      }
      setLoading(false);
    });
  }, [params.id, isNew, reset]);

  const onSubmit = async (data: FormData) => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = supabase.from("procedures") as any;
    if (isNew) {
      const { error } = await table.insert([data]);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await table.update(data).eq("id", params.id as string);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Saved!", variant: "success" });
    router.push("/admin/procedures");
  };

  if (loading) return <div className="text-gray-400 py-12 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-serif font-bold text-brand-dark">
        {isNew ? "New Procedure" : "Edit Procedure"}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Title *</label>
            <Input {...register("title")} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Slug *</label>
            <Input {...register("slug")} />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Category *</label>
            <Select defaultValue="surgical" onValueChange={(v: string) => setValue("category", v as "surgical" | "non_surgical")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="surgical">Surgical</SelectItem>
                <SelectItem value="non_surgical">Non-Surgical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Status *</label>
            <Select defaultValue="draft" onValueChange={(v: string) => setValue("status", v as "draft" | "published" | "archived")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Technique</label>
            <Input {...register("technique")} placeholder="e.g. FUE" />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
          <Textarea {...register("description")} rows={4} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Pre-Op Care</label>
            <Textarea {...register("pre_op_care")} rows={3} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Post-Op Care</label>
            <Textarea {...register("post_op_care")} rows={3} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Risks & Disclaimers</label>
          <Textarea {...register("risks")} rows={3} />
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
        <div className="flex items-center gap-3 pt-2">
          <input type="checkbox" id="featured" {...register("featured")} className="rounded" />
          <label htmlFor="featured" className="text-sm text-gray-700">Feature on homepage</label>
        </div>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isNew ? "Create Procedure" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

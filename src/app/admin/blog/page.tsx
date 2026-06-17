import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, ArrowRight } from "lucide-react";
import type { Database } from "@/types/database";

type BlogPost = Pick<
  Database["public"]["Tables"]["blog_posts"]["Row"],
  "id" | "title" | "slug" | "status" | "author" | "published_at" | "created_at"
>;

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: rawPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, status, author, published_at, created_at")
    .order("created_at", { ascending: false });
  const posts = (rawPosts ?? []) as BlogPost[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold text-brand-dark">Blog Posts</h1>
        <Button asChild variant="primary" size="sm">
          <Link href="/admin/blog/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Title", "Slug", "Author", "Status", "Published", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-brand-dark max-w-xs truncate">{p.title}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.slug}</td>
                <td className="px-4 py-3 text-gray-600">{p.author ?? "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.status === "published" ? "success" : "warning"} className="text-xs capitalize">{p.status}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString("en-PK") : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${p.id}`} className="text-brand-gold">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {!posts.length && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No posts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

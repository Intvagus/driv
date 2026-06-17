import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";

// Placeholder blog posts - in production these would come from Supabase
const posts: Record<string, {
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  content: string;
}> = {
  "fue-vs-dhi-hair-transplant": {
    title: "FUE vs DHI Hair Transplant: Which Technique Is Right for You?",
    excerpt: "Understanding the differences between FUE and DHI techniques.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-09-15",
    tags: ["FUE", "DHI", "Guide"],
    content: `
## What is FUE?

Follicular Unit Extraction (FUE) is the gold standard in hair transplant surgery. Individual follicles are extracted from the donor area using a micro-punch tool and then implanted into recipient sites.

**Advantages of FUE:**
- Minimal scarring (tiny dot scars, barely visible)
- Faster recovery compared to strip methods
- Suitable for large graft counts (2,000–4,000+)
- Can harvest from beard or body hair if needed

## What is DHI?

Direct Hair Implantation (DHI) uses a specialized Choi Implanter Pen to simultaneously create channels and implant grafts. This eliminates the "graft time outside the body" variable.

**Advantages of DHI:**
- Higher density possible in targeted areas
- No pre-made incisions needed
- Potentially better graft survival rates
- Ideal for hairline work and adding density to existing hair

## Which Should You Choose?

The best technique depends on your specific hair loss pattern, donor density, and aesthetic goals. During your consultation, Dr. Rana Irfan will recommend the most suitable approach based on a trichoscopic analysis.

*This article is for educational purposes only. Consult a qualified surgeon for personalized advice.*
    `,
  },
};

interface Props {
  params: { slug: string };
}

export default function BlogPostPage({ params }: Props) {
  const post = posts[params.slug] ?? {
    title: "Article Coming Soon",
    excerpt: "",
    author: "Dr. Rana Irfan",
    publishedAt: new Date().toISOString(),
    tags: [],
    content: "This article will be available soon. Please check back later.",
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>
            <div className="flex gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="gold" className="text-xs">{tag}</Badge>
              ))}
            </div>
            <h1 className="heading-1 text-white mb-4">{post.title}</h1>
            <div className="flex gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-PK", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            </div>
          </div>
        </section>

        <article className="section-padding">
          <div className="container-custom max-w-3xl">
            <div className="prose prose-lg max-w-none prose-headings:text-brand-dark prose-headings:font-serif prose-a:text-brand-gold">
              {post.content.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <h2 key={i}>{line.replace("## ", "")}</h2>;
                if (line.startsWith("**") && line.endsWith("**")) return <p key={i}><strong>{line.replace(/\*\*/g, "")}</strong></p>;
                if (line.startsWith("- ")) return <li key={i}>{line.replace("- ", "")}</li>;
                if (line.startsWith("*") && line.endsWith("*")) return <p key={i} className="text-sm text-gray-500 italic">{line.replace(/\*/g, "")}</p>;
                if (line.trim()) return <p key={i}>{line}</p>;
                return null;
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
              <Button asChild variant="secondary">
                <Link href="/blog" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> All Articles
                </Link>
              </Button>
              <Button asChild variant="primary">
                <Link href="/book" className="flex items-center gap-2">
                  Book Consultation <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}

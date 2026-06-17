import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { BlogCard } from "@/components/sections/BlogCard";

const posts = [
  {
    title: "FUE vs DHI Hair Transplant: Which Technique Is Right for You?",
    slug: "fue-vs-dhi-hair-transplant",
    excerpt: "Understanding the differences between FUE and DHI techniques can help you make an informed decision about your hair restoration journey.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-09-15",
    tags: ["FUE", "DHI", "Guide"],
  },
  {
    title: "What to Expect in the First Month After a Hair Transplant",
    slug: "first-month-after-hair-transplant",
    excerpt: "The post-operative phase can be confusing. Here's a week-by-week breakdown of what you'll experience and how to maximize your results.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-08-28",
    tags: ["Recovery", "Post-Op"],
  },
  {
    title: "PRP Therapy for Hair Loss: A Complete Guide",
    slug: "prp-therapy-hair-loss-guide",
    excerpt: "Platelet-Rich Plasma therapy is gaining popularity as both a standalone treatment and a complement to hair transplant surgery.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-08-10",
    tags: ["PRP", "Non-Surgical"],
  },
  {
    title: "Norwood Scale Explained: Understanding Your Hair Loss Stage",
    slug: "norwood-scale-explained",
    excerpt: "The Norwood-Hamilton scale is the most widely used classification for male pattern baldness. Learn what your stage means for treatment options.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-07-22",
    tags: ["Education", "Hair Loss"],
  },
  {
    title: "How to Choose the Right Hair Transplant Clinic in Pakistan",
    slug: "choosing-hair-transplant-clinic-pakistan",
    excerpt: "With many clinics offering hair transplants in Pakistan, knowing what to look for can save you from costly mistakes.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-07-05",
    tags: ["Guide", "Pakistan"],
  },
  {
    title: "Beard Transplant: Everything You Need to Know",
    slug: "beard-transplant-guide",
    excerpt: "From patchy beards to complete restoration, beard transplants are delivering life-changing results for men of all ages.",
    author: "Dr. Rana Irfan",
    publishedAt: "2024-06-18",
    tags: ["Beard", "Facial Hair"],
  },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-brand-dark to-brand-dark-light py-20">
          <div className="container-custom text-center">
            <span className="text-brand-gold text-sm font-semibold uppercase tracking-widest">
              Knowledge Centre
            </span>
            <h1 className="heading-1 text-white mt-2 mb-4">Hair Restoration Blog</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Expert advice, procedure guides, and patient stories from Dr. Rana Irfan.
            </p>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <BlogCard key={post.slug} {...post} index={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFAB />
    </>
  );
}

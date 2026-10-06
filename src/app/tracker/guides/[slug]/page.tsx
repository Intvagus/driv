import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, Info } from "lucide-react";
import { GuidesHeader } from "@/components/tracker/GuidesHeader";
import { APP_NAME, FREE_CHECKIN_LIMIT } from "@/lib/tracker/config";
import { GUIDES, MEDICAL_REVIEWER, getGuide, isIndexable, type GuideBlock } from "@/lib/tracker/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const guide = getGuide(params.slug);
  if (!guide) return {};
  return {
    title: { absolute: `${guide.title} | ${APP_NAME}` },
    description: guide.description,
    alternates: { canonical: `/tracker/guides/${guide.slug}` },
    // Medical guides stay out of search until a reviewer has signed off.
    robots: isIndexable(guide) ? undefined : { index: false, follow: true },
    openGraph: { type: "article", title: guide.title, description: guide.description, siteName: APP_NAME },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function Block({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "p":
      return <p>{block.text}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      );
    case "note":
      return (
        <p className="not-prose flex gap-2 rounded-xl border border-rl-border bg-slate-50 p-4 text-sm text-slate-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          <span>{block.text}</span>
        </p>
      );
  }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);
  const reviewed = guide.medical && MEDICAL_REVIEWER;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updated,
    publisher: { "@type": "Organization", name: APP_NAME },
    ...(reviewed ? { reviewedBy: { "@type": "Person", name: MEDICAL_REVIEWER } } : {}),
  };

  return (
    <>
      <GuidesHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <Link href="/tracker/guides" className="hover:underline">
            Guides
          </Link>
        </nav>
        <article className="prose prose-slate mt-2 max-w-none prose-headings:tracking-tight prose-h2:mt-8 prose-h2:text-xl prose-a:text-rl-primary">
          <h1 className="text-3xl">{guide.title}</h1>
          <p className="not-prose text-sm text-slate-500">
            {guide.readMinutes} min read · Updated {formatDate(guide.updated)}
            {reviewed && <> · Medically reviewed by {MEDICAL_REVIEWER}</>}
          </p>
          {guide.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}

          <div className="not-prose my-10 rounded-2xl border border-rl-primary/30 bg-rl-primary/5 p-6">
            <p className="flex items-center gap-2 font-semibold">
              <Camera className="h-5 w-5 text-rl-primary" aria-hidden /> Start your baseline photos today
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {APP_NAME} guides the same four angles every month and lines them up side by side. Free for your first{" "}
              {FREE_CHECKIN_LIMIT} check-ins.
            </p>
            <Link
              href="/tracker/login?mode=signup"
              className="mt-4 inline-block rounded-lg bg-rl-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-rl-primary-dark"
            >
              Start free
            </Link>
          </div>

          {guide.sources.length > 0 && (
            <>
              <h2>Sources</h2>
              <ul className="text-sm">
                {guide.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener" target="_blank">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>

        <aside className="mt-10 border-t border-rl-border pt-6">
          <h2 className="font-semibold">More guides</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {others.map((g) => (
              <li key={g.slug}>
                <Link href={`/tracker/guides/${g.slug}`} className="text-rl-primary hover:underline">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}

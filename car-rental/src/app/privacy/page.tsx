import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Privacy policy
          </h1>
          <p className="mt-4 text-sm text-muted">
            Placeholder page — replace with reviewed privacy policy before launch.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

// SEO guides for Rootline, rendered at /tracker/guides/[slug].
//
// Guides marked `medical` make health statements. They are kept out of
// search engines (noindex, not in the sitemap) until a qualified reviewer is
// named in NEXT_PUBLIC_TRACKER_MEDICAL_REVIEWER, and that reviewer has read
// them. Sources were found by web search; re-check each link during review.

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "note"; text: string };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  medical: boolean;
  readMinutes: number;
  updated: string; // YYYY-MM-DD
  blocks: GuideBlock[];
  sources: { label: string; url: string }[];
};

export const MEDICAL_REVIEWER = process.env.NEXT_PUBLIC_TRACKER_MEDICAL_REVIEWER || "";

/** Whether search engines may index this guide yet. */
export function isIndexable(guide: Guide) {
  return !guide.medical || MEDICAL_REVIEWER.length > 0;
}

export const GUIDES: Guide[] = [
  {
    slug: "how-to-take-hair-progress-photos",
    title: "How to Take Hair Progress Photos You Can Actually Compare",
    description:
      "Lighting changes more from month to month than your hair does. Five rules and four angles for scalp photos that show real change.",
    medical: false,
    readMinutes: 5,
    updated: "2026-10-06",
    blocks: [
      {
        type: "p",
        text: "Most hair progress photos can't be compared. One month is shot under a bathroom ceiling light, the next by a window, and the difference in light is bigger than any change in your hair. Consistent photos fix that, and they take about three minutes a month.",
      },
      { type: "h2", text: "The five rules" },
      {
        type: "ol",
        items: [
          "Same place. Pick one spot in one room and always stand there.",
          "Same light. Overhead light tends to show more scalp than soft window light, so mixing them fakes change. Pick one and keep it, with the flash off.",
          "Same hair. Dry, clean and unstyled, with no product, fibers or hairspray. Shoot before a haircut, not just after one.",
          "Same distance and camera. Use the same phone and the same lens. The front camera's wide angle distorts the hairline, so the back camera with a helper or a mirror works better.",
          "Same time of month. A fixed date, such as the 1st, builds the habit and keeps the gaps even.",
        ],
      },
      { type: "h2", text: "The four angles" },
      {
        type: "ul",
        items: [
          "Front hairline: face the camera at eye level with your hair pulled back.",
          "Top (mid-scalp): tilt your head down so the part line fills the frame.",
          "Crown: shoot straight down at the back of the head, with a helper or a second mirror.",
          "Temples: turn your head 90 degrees, and use the same side every time.",
        ],
      },
      { type: "h2", text: "How often" },
      {
        type: "p",
        text: "Once a month. Hair grows slowly, so weekly photos mostly record changes in light and styling, which can be more worrying than helpful. Monthly photos show the real trend over 6 to 12 months.",
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "ul",
        items: [
          "Shooting with wet hair, which shows far more scalp.",
          "Switching between the front and back camera.",
          "Comparing only against last month. Always compare against your first (baseline) photo too.",
          "Deleting \"bad\" months. Gaps make the trend harder to read.",
        ],
      },
      { type: "h2", text: "Comparing them" },
      {
        type: "p",
        text: "Put two months side by side at the same angle, or lay one over the other with a slider. If the photos were taken consistently, real changes in density stand out; if they weren't, the comparison will mostly show the light. Bring the comparison to your doctor rather than drawing medical conclusions from it alone.",
      },
    ],
    sources: [],
  },
  {
    slug: "minoxidil-month-by-month",
    title: "Minoxidil Month by Month: What to Track and When",
    description:
      "Minoxidil is slow. What dermatology sources say to expect in the first year, why early shedding is common, and what to record each month.",
    medical: true,
    readMinutes: 6,
    updated: "2026-10-06",
    blocks: [
      {
        type: "p",
        text: "Minoxidil works slowly, and that makes it easy to give up too early or keep going without knowing whether it helps. Dermatology sources commonly advise using it consistently for about 6 to 12 months before judging how well it works for you. Here is what is commonly reported along the way, and what to record so you and your doctor can judge it.",
      },
      {
        type: "note",
        text: "This guide is general information, not medical advice. Everyone responds differently. Talk to your doctor before starting, stopping or changing any treatment.",
      },
      { type: "h2", text: "Weeks 2 to 8: a possible temporary shed" },
      {
        type: "p",
        text: "Many people notice more hair falling out in the first weeks. This temporary shedding is widely reported when starting minoxidil and usually settles as new growth begins. Record it each month instead of guessing. If shedding is heavy or continues past the first few months, tell your doctor.",
      },
      { type: "h2", text: "Months 2 to 4: the earliest changes" },
      {
        type: "p",
        text: "Some people see the first changes, often fine, short hairs, after two to four months of regular use. Many see little yet. Neither is a verdict, which is why photos taken the same way every month matter more than how your hair looks in the mirror on a given day.",
      },
      { type: "h2", text: "Months 6 to 12: time to judge" },
      {
        type: "p",
        text: "This is the window dermatology sources point to for deciding how well minoxidil works for you. Compare your 6- and 12-month photos against your baseline, not just against last month. For some people, success means regrowth; for others it means the loss has stopped getting worse. Your doctor can help you decide which you're seeing.",
      },
      { type: "h2", text: "What to record each month" },
      {
        type: "ul",
        items: [
          "Photos from the same four angles, in the same light.",
          "How much shedding you noticed, on a simple 1 to 5 scale.",
          "How many days you actually used it. Missed doses are the most common reason results disappoint.",
          "Anything new: scalp irritation, itching, unwanted hair growth elsewhere, or other changes to raise with your doctor.",
        ],
      },
      { type: "h2", text: "When to talk to your doctor" },
      {
        type: "ul",
        items: [
          "Shedding that is heavy or lasts beyond the first few months.",
          "Scalp irritation, or any side effect that worries you.",
          "No visible change after 6 to 12 months of consistent use.",
          "Before switching between topical and oral minoxidil, or changing the dose.",
        ],
      },
    ],
    sources: [
      {
        label: "Combating \"dread shed\": overlapping topical and oral minoxidil on temporary hair shedding (JAAD International)",
        url: "https://www.jaadinternational.org/article/S2666-3287(24)00043-9/fulltext",
      },
      {
        label: "Transient hair shedding after minoxidil treatment: a retrospective study (Journal of Dermatological Treatment, 2025)",
        url: "https://www.tandfonline.com/doi/full/10.1080/09546634.2025.2480739",
      },
      {
        label: "Female pattern hair loss (American Academy of Dermatology)",
        url: "https://www.aad.org/public/diseases/hair-loss/types/female-pattern",
      },
      { label: "How long does it take for minoxidil to work? (GoodRx)", url: "https://www.goodrx.com/minoxidil/how-long-for-minoxidil-to-work" },
    ],
  },
  {
    slug: "hair-transplant-growth-timeline",
    title: "Hair Transplant Growth Timeline: Tracking Months 1 to 12",
    description:
      "Transplanted hair usually sheds before it grows. What patients commonly see from week 2 to month 18, and a photo schedule to track it.",
    medical: true,
    readMinutes: 6,
    updated: "2026-10-06",
    blocks: [
      {
        type: "p",
        text: "The months after a hair transplant are a test of patience. Transplanted hair usually falls out first, regrows slowly, and keeps improving for a year or more. Clinic sources commonly describe results maturing over 12 to 18 months. Regular, consistent photos are the best way to see that you're on track.",
      },
      {
        type: "note",
        text: "Every patient heals differently. Follow your own surgeon's aftercare instructions and ask them what's normal for you.",
      },
      { type: "h2", text: "Weeks 2 to 8: transplanted hairs shed" },
      {
        type: "p",
        text: "Most transplanted hair shafts are commonly shed in the first weeks as the moved follicles enter a resting phase. The follicles stay in place under the skin. Some patients also lose some of their existing nearby hair for a while (often called shock loss), which commonly recovers over the following months.",
      },
      { type: "h2", text: "Months 3 to 4: new growth starts" },
      {
        type: "p",
        text: "New hairs commonly start to appear around months three to four. They're often fine and patchy at first. This is when photos taken the same way every month become valuable, because day-to-day changes are hard to see in a mirror.",
      },
      { type: "h2", text: "Months 6 to 9: coverage builds" },
      {
        type: "p",
        text: "Many patients see meaningful coverage in this window as hairs grow longer and thicker. Progress is often uneven, and the crown is commonly the last area to fill in.",
      },
      { type: "h2", text: "Months 12 to 18: the result matures" },
      {
        type: "p",
        text: "Results keep maturing through this period. Compare your 12-month photos against your pre-surgery baseline at the same angles. That comparison is the one to bring to your final follow-up.",
      },
      { type: "h2", text: "A photo schedule that works" },
      {
        type: "ol",
        items: [
          "Before surgery: baseline photos at the four standard angles (front, top, crown, temples).",
          "During healing: only photos your clinic asks for. Don't touch or disturb the grafts to take a picture.",
          "From month 1: once a month, same place, same light, dry hair.",
          "Before every follow-up: bring a side-by-side report so your surgeon can see the whole trend.",
        ],
      },
    ],
    sources: [
      {
        label: "When does transplanted hair start growing? Month by month (Acıbadem International)",
        url: "https://acibademinternational.com/blog/when-does-transplanted-hair-start-growing-month-by-month-reality/",
      },
      { label: "Hair transplant month by month: normal vs red flags (AKM Clinic)", url: "https://akmclinic.com/blog/hair-transplant-growth-timeline/" },
      { label: "3 weeks after hair transplant: shock loss and shedding (Cosmedica)", url: "https://cosmedica.com/3-weeks-after-hair-transplant/" },
    ],
  },
  {
    slug: "is-finasteride-working",
    title: "How to Tell if Finasteride Is Working",
    description:
      "The FDA label says benefit generally takes three months or more of daily use. How to judge progress fairly, and what to record for your doctor.",
    medical: true,
    readMinutes: 5,
    updated: "2026-10-06",
    blocks: [
      {
        type: "p",
        text: "Finasteride is slow and quiet: there's no moment when you can feel it working. The FDA-approved label for Propecia (finasteride 1 mg) says daily use for three months or more is generally necessary before benefit is observed. So the real question isn't \"is it working this week\" but \"what does the trend show over many months\".",
      },
      {
        type: "note",
        text: "Finasteride is a prescription medicine. This guide is general information, not medical advice. Talk to your prescriber about your results, any side effects, and before stopping or changing it.",
      },
      { type: "h2", text: "What \"working\" can look like" },
      {
        type: "ul",
        items: [
          "Regrowth: more coverage than your baseline photos.",
          "Holding steady: no further loss. For a condition that usually progresses, this can be a good result in itself.",
          "Continued loss: worth discussing with your prescriber, especially after many months of consistent use.",
        ],
      },
      { type: "h2", text: "Give it a fair test" },
      {
        type: "ol",
        items: [
          "Take baseline photos before you start, or as soon as you can.",
          "Take monthly photos the same way: same place, same light, dry hair, four angles.",
          "Track your daily doses. Results can't be judged fairly if many doses were missed.",
          "Compare against your baseline at 3, 6 and 12 months, not only against last month.",
        ],
      },
      { type: "h2", text: "What to bring to your prescriber" },
      {
        type: "ul",
        items: [
          "Side-by-side photos: baseline vs latest, at each angle.",
          "How consistently you've taken it.",
          "Any side effects or changes you've noticed, however minor they seem.",
        ],
      },
    ],
    sources: [
      {
        label: "PROPECIA (finasteride) tablets prescribing information (FDA)",
        url: "https://www.accessdata.fda.gov/drugsatfda_docs/label/2011/020788s018lbl.pdf",
      },
      {
        label: "Propecia label (DailyMed, U.S. National Library of Medicine)",
        url: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6f904709-65aa-44ce-b144-b4c8a0416e36",
      },
    ],
  },
  {
    slug: "choosing-a-hair-loss-tracker-app",
    title: "Choosing a Hair Loss Tracker App: 7 Things That Matter",
    description:
      "Several apps now track hair progress photos. Seven questions to ask before you trust one with a year of scalp photos.",
    medical: false,
    readMinutes: 4,
    updated: "2026-10-06",
    blocks: [
      {
        type: "p",
        text: "A tracker is only useful if you're still using it in month 12 and your photos are still there. These seven questions separate a good one from a photo album with extra steps.",
      },
      { type: "h2", text: "The seven questions" },
      {
        type: "ol",
        items: [
          "Does it guide the same angles every time? Fixed angles matter more than any other feature.",
          "Does it help you line up the shot? Look for your previous photo shown while you shoot, or an overlay.",
          "Where are the photos stored? On the phone only means a lost or replaced phone can lose your whole history. Cloud storage should be private and encrypted.",
          "Can you get your photos out? A report or export you can show a doctor is worth more than any in-app score.",
          "Does it track the treatment too? Missed doses explain many disappointing results.",
          "What does it claim? Be wary of apps that \"diagnose\" or promise regrowth. A tracker shows change; it doesn't treat or diagnose anything.",
          "Is the price clear? Know what's free, what's paid, and that you can cancel and delete your data at any time.",
        ],
      },
      { type: "h2", text: "How Rootline answers them" },
      {
        type: "p",
        text: "Rootline guides four fixed angles and shows last month's photo while you take the new one. It stores photos in private, encrypted cloud storage so they survive a new phone, and tracks daily treatments. Pro adds a printable report for your doctor. It makes no diagnosis or hair-score claims. It's free for your first three check-ins, and you can delete everything from your account page at any time.",
      },
    ],
    sources: [],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}

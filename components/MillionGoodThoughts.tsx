"use client";
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, RefreshCcw, Share2, Heart, Sparkles } from "lucide-react";

const Button = ({ className = "", as: As = "button", ...props }: any) => (
  <As
    className={
      "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition active:scale-[.98] " +
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600 " +
      className
    }
    {...props}
  />
);

const Card = ({ className = "", ...props }: any) => (
  <div
    className={
      "rounded-3xl border border-black/5 bg-white/80 backdrop-blur p-6 shadow-sm " +
      className
    }
    {...props}
  />
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs tracking-wide text-black/70">
    {children}
  </span>
);

// Seed quotes: verify rights before production
const SEED_QUOTES = [
  {
    text: "The best way to cheer yourself is to try to cheer someone else up.",
    author: "Mark Twain",
    source: "(attrib.)",
    moods: ["sad", "down", "lonely"],
    publicDomainLikely: true,
  },
  {
    text: "In the middle of winter, I found there was, within me, an invincible summer.",
    author: "Albert Camus",
    source: "Return to Tipasa",
    moods: ["hopeless", "down", "anxious"],
    publicDomainLikely: false,
  },
  {
    text: "The sun himself is weak when he first rises, and gathers strength and courage as the day gets on.",
    author: "Charles Dickens",
    source: "The Old Curiosity Shop",
    moods: ["unmotivated", "sad", "down"],
    publicDomainLikely: true,
  },
  {
    text: "What we do now echoes in eternity.",
    author: "Marcus Aurelius",
    source: "Meditations",
    moods: ["grieving", "lost", "down"],
    publicDomainLikely: true,
  },
  {
    text: "Do not let your fire go out, spark by irreplaceable spark.",
    author: "Ayn Rand",
    source: "Atlas Shrugged",
    moods: ["hopeless", "unmotivated"],
    publicDomainLikely: false,
  },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
    source: "(attrib.)",
    moods: ["unmotivated", "anxious"],
    publicDomainLikely: true,
  },
  {
    text: "We must let go of the life we have planned, so as to accept the one that is waiting for us.",
    author: "Joseph Campbell",
    source: "(attrib.)",
    moods: ["grieving", "sad"],
    publicDomainLikely: false,
  },
  {
    text: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    moods: ["hopeless", "grieving"],
    publicDomainLikely: true,
  },
  {
    text: "There is no charm equal to tenderness of heart.",
    author: "Jane Austen",
    source: "Emma",
    moods: ["lonely", "sad"],
    publicDomainLikely: true,
  },
  {
    text: "Courage is grace under pressure.",
    author: "Ernest Hemingway",
    source: "(attrib.)",
    moods: ["anxious", "stressed"],
    publicDomainLikely: false,
  },
];

const AFFIRMATIONS = [
  { text: "You have survived every hard day so far—today is no different.", moods: ["sad", "hopeless", "down"] },
  { text: "You don’t need to feel ready to take a tiny step. Take the step; readiness will follow.", moods: ["unmotivated", "anxious"] },
  { text: "Somewhere in your future, someone is grateful you didn’t give up today.", moods: ["hopeless", "grieving"] },
  { text: "Breathing in: calm. Breathing out: release. One breath is a beginning.", moods: ["anxious", "stressed"] },
  { text: "Your worth is not measured by today’s energy levels.", moods: ["unmotivated", "down"] },
];

const MOODS = [
  { id: "sad", label: "Sad" },
  { id: "down", label: "Down" },
  { id: "hopeless", label: "Hopeless" },
  { id: "anxious", label: "Anxious" },
  { id: "stressed", label: "Stressed" },
  { id: "lonely", label: "Lonely" },
  { id: "grieving", label: "Grieving" },
  { id: "unmotivated", label: "Unmotivated" },
];

function pickWeighted<T>(items: T[]): T | null {
  return items[Math.floor(Math.random() * items.length)] || null;
}

function filterByMood<T extends { moods?: string[] }>(mood: string | null, pool: T[]): T[] {
  if (!mood) return pool;
  const matched = pool.filter((q) => (q.moods || []).includes(mood));
  return matched.length ? matched : pool;
}

function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) as T : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

export default function MillionGoodThoughts() {
  const [mood, setMood] = useLocalStorage<string>("agt:mood", "sad");
  const [quote, setQuote] = useState<any>(null);
  const [safeMode, setSafeMode] = useLocalStorage<boolean>("agt:safe", true);

  const pool = useMemo(() => {
    const publicDomainOnly = safeMode;
    const base = publicDomainOnly
      ? SEED_QUOTES.filter((q) => q.publicDomainLikely)
      : SEED_QUOTES;
    const mooded = filterByMood(mood, base);
    const aff = filterByMood(mood, AFFIRMATIONS).map((a) => ({ ...a, author: "", source: "", publicDomainLikely: true, isAffirmation: true }));
    return [...mooded, ...aff];
  }, [mood, safeMode]);

  function generate() {
    const q = pickWeighted(pool);
    setQuote(q);
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, safeMode]);

  async function copyToClipboard() {
    if (!quote) return;
    const text = formatQuote(quote);
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Copied!");
    }
  }

  function formatQuote(q: any) {
    const by = q.author ? ` — ${q.author}` : "";
    return `“${q.text}”${by}`;
  }

  function shareQuote() {
    if (!quote) return;
    const text = formatQuote(quote);
    if ((navigator as any).share) {
      (navigator as any).share({ text, title: "A Million Good Thoughts" });
    } else {
      copyToClipboard();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-pink-50 text-slate-900">
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-12">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">A Million Good Thoughts</h1>
              <p className="text-sm text-black/60">Uplifting lines for heavy days.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={safeMode}
              onChange={(e) => setSafeMode(e.target.checked)}
            />
            Public‑domain/permissioned only
          </label>
        </header>

        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <Chip>How are you feeling?</Chip>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={
                    "rounded-full px-3 py-1 text-sm border transition " +
                    (mood === m.id
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-black/10 bg-white/70 text-black/70 hover:bg-black/5")
                  }
                  aria-pressed={mood === m.id}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            key={quote ? quote.text : "placeholder"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-6"
          >
            {quote ? (
              <blockquote className="text-balance text-lg leading-relaxed md:text-xl">
                <span className="select-text">“{quote.text}”</span>
                {quote.author && (
                  <footer className="mt-2 text-sm text-black/60">— {quote.author}</footer>
                )}
                <div className="mt-3 flex items-center gap-2">
                  {quote.publicDomainLikely ? (
                    <Chip>Public‑domain likely</Chip>
                  ) : (
                    <Chip>Check rights</Chip>
                  )}
                  {quote.isAffirmation && <Chip>Original affirmation</Chip>}
                </div>
              </blockquote>
            ) : (
              <p className="text-black/60">Click the button below to receive a thought.</p>
            )}
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={generate} title="Give me another">
              <RefreshCcw size={16} /> Another
            </Button>
            <Button onClick={copyToClipboard} className="bg-slate-900 hover:bg-slate-800 focus:ring-slate-900">
              <Copy size={16} /> Copy
            </Button>
            <Button onClick={shareQuote} className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600">
              <Share2 size={16} /> Share
            </Button>
          </div>
        </Card>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="mb-2 text-base font-semibold">About</h2>
            <p className="text-sm text-black/70">
              This is a simple first version. Toggle rights-safety above to favor public-domain or
              permissioned content. For modern works, secure permission or consider short excerpts or
              paraphrases; when in doubt, use original affirmations.
            </p>
          </Card>
          <Card>
            <h2 className="mb-2 text-base font-semibold">Gentle Safety Note</h2>
            <p className="text-sm text-black/70">
              These words can encourage, but they aren’t a substitute for professional help. If you’re in 
              crisis in the U.S., call or text <strong>988</strong> for the Suicide & Crisis Lifeline. If outside the U.S.,
              contact your local emergency number.
            </p>
          </Card>
        </section>

        <footer className="mt-10 flex items-center justify-between text-xs text-black/50">
          <div className="flex items-center gap-2">
            <Heart size={14} />
            Built with kindness.
          </div>
          <div>© {new Date().getFullYear()} A Million Good Thoughts</div>
        </footer>
      </div>
    </div>
  );
}

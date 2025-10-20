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
  text: "Keep your face always toward the sunshine—and shadows will fall behind you.",
  author: "Walt Whitman",
  source: "Leaves of Grass",
  moods: ["sad","down","hopeless"],
  publicDomainLikely: true
},
{
  text: "We must be willing to let go of the life we planned so as to have the life that is waiting for us.",
  author: "Joseph Campbell",
  source: "(attrib.)",
  moods: ["grieving","sad"],
  publicDomainLikely: false
},
{
  text: "The best way to cheer yourself is to try to cheer someone else up.",
  author: "Mark Twain",
  source: "(attrib.)",
  moods: ["sad","lonely","down"],
  publicDomainLikely: true
},
{
  text: "The only person you are destined to become is the person you decide to be.",
  author: "Ralph Waldo Emerson",
  source: "(attrib.)",
  moods: ["unmotivated","anxious"],
  publicDomainLikely: true
},
{
  text: "When you arise in the morning think of what a precious privilege it is to be alive—to breathe, to think, to enjoy, to love.",
  author: "Marcus Aurelius",
  source: "Meditations",
  moods: ["down","hopeless","anxious"],
  publicDomainLikely: true
},
{
  text: "What we do now echoes in eternity.",
  author: "Marcus Aurelius",
  source: "Meditations",
  moods: ["grieving","lost","down"],
  publicDomainLikely: true
},
{
  text: "In the depth of winter I finally learned that within me there lay an invincible summer.",
  author: "Albert Camus",
  source: "Return to Tipasa",
  moods: ["hopeless","down","anxious"],
  publicDomainLikely: false
},
{
  text: "Do not let your fire go out, spark by irreplaceable spark in the hopeless swamps of the not-quite, the not-yet, and the not-when.",
  author: "Ayn Rand",
  source: "Atlas Shrugged",
  moods: ["hopeless","unmotivated"],
  publicDomainLikely: false
},
{
  text: "There is no charm equal to tenderness of heart.",
  author: "Jane Austen",
  source: "Emma",
  moods: ["lonely","sad"],
  publicDomainLikely: true
},
{
  text: "Courage is grace under pressure.",
  author: "Ernest Hemingway",
  source: "(attrib.)",
  moods: ["anxious","stressed"],
  publicDomainLikely: false
},
{
  text: "Every good moment we share is a victory over the days that felt like they’d never end.",
  author: "",
  source: "",
  moods: ["sad","lonely","hopeless"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "One breath in, one breath out. Calm returns in the silence of just breathing.",
  author: "",
  source: "",
  moods: ["anxious","stressed"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Your worth is not measured by today’s energy levels.",
  author: "",
  source: "",
  moods: ["unmotivated","down"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Sometimes the smallest step in the right direction ends up being the biggest step of your life.",
  author: "",
  source: "",
  moods: ["hopeless","unmotivated"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Healing doesn’t mean the damage never existed. It means the damage no longer controls our lives.",
  author: "",
  source: "",
  moods: ["grieving","sad","down"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Not all strong people wear their toughness on the outside—sometimes the strongest are the ones who smile when they feel like crying.",
  author: "",
  source: "",
  moods: ["lonely","down","hopeless"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "You are capable of amazing things—even when you don’t feel capable. Trust tomorrow’s energy to become today’s change.",
  author: "",
  source: "",
  moods: ["unmotivated","anxious"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Begin where you are. Use what you have. Do what you can.",
  author: "Arthur Ashe",
  source: "(attrib.)",
  moods: ["unmotivated","down"],
  publicDomainLikely: false
},
{
  text: "Success is peace of mind which is knowing you made the effort to become the best of which you are capable.",
  author: "John Wooden",
  source: "(attrib.)",
  moods: ["unmotivated","anxious"],
  publicDomainLikely: false
},
{
  text: "To live is the rarest thing in the world. Most people exist, that is all.",
  author: "Oscar Wilde",
  source: "(attrib.)",
  moods: ["down","sad"],
  publicDomainLikely: true
},
{
  text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  author: "Ralph Waldo Emerson",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "The only way out is always through.",
  author: "Robert Frost",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "The secret of getting ahead is getting started.",
  author: "Mark Twain",
  source: "(attrib.)",
  moods: ["unmotivated","down"],
  publicDomainLikely: true
},
{
  text: "Life is what happens when you’re busy making other plans.",
  author: "John Lennon",
  source: "(attrib.)",
  moods: ["down","anxious"],
  publicDomainLikely: false
},
{
  text: "Don’t judge each day by the harvest you reap but by the seeds that you plant.",
  author: "Robert Louis Stevenson",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "No legacy is so rich as honesty.",
  author: "William Shakespeare",
  source: "(attrib.)",
  moods: ["unmotivated","down"],
  publicDomainLikely: true
},
{
  text: "Believe you can and you’re halfway there.",
  author: "Theodore Roosevelt",
  source: "(attrib.)",
  moods: ["unmotivated","anxious"],
  publicDomainLikely: true
},
{
  text: "It does not matter how slowly you go as long as you do not stop.",
  author: "Confucius",
  source: "(attrib.)",
  moods: ["unmotivated","down"],
  publicDomainLikely: true
},
{
  text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.",
  author: "Aristotle",
  source: "(attrib.)",
  moods: ["unmotivated","down"],
  publicDomainLikely: true
},
{
  text: "If you change the way you look at things, the things you look at change.",
  author: "Wayne Dyer",
  source: "(attrib.)",
  moods: ["hopeless","anxious"],
  publicDomainLikely: false
},
{
  text: "What you do makes a difference, and you have to decide what kind of difference you want to make.",
  author: "Jane Goodall",
  source: "(attrib.)",
  moods: ["hopeless","unmotivated"],
  publicDomainLikely: false
},
{
  text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  author: "Nelson Mandela",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: false
},
{
  text: "When one door of happiness closes, another opens; but often we look so long at the closed door that we do not see the one which has been opened.",
  author: "Helen Keller",
  source: "(attrib.)",
  moods: ["hopeless","sad"],
  publicDomainLikely: false
},
{
  text: "Happiness is the only good. The time to be happy is now, the place to be happy is here.",
  author: "Robert G. Ingersoll",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "Even the darkest night will end and the sun will rise.",
  author: "Victor Hugo",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "To love another person is to see the face of God.",
  author: "Victor Hugo",
  source: "Les Misérables",
  moods: ["sad","lonely"],
  publicDomainLikely: true
},
{
  text: "There is no substitute for hard work.",
  author: "Thomas Edison",
  source: "(attrib.)",
  moods: ["unmotivated","down"],
  publicDomainLikely: false
},
{
  text: "It always seems impossible until it’s done.",
  author: "Nelson Mandela",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: false
},
{
  text: "Somewhere in your future someone is grateful you didn’t give up today.",
  author: "",
  source: "",
  moods: ["hopeless","grieving"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Breathing in: calm. Breathing out: release. One breath is a beginning.",
  author: "",
  source: "",
  moods: ["anxious","stressed"],
  publicDomainLikely: true,
  isAffirmation: true
}
{
  text: "There is nothing either good or bad, but thinking makes it so.",
  author: "William Shakespeare",
  source: "Hamlet",
  moods: ["anxious","hopeless","down"],
  publicDomainLikely: true
},
{
  text: "Though nobody can go back and make a new beginning, anyone can start now and make a new ending.",
  author: "George Eliot",
  source: "(attrib.)",
  moods: ["hopeless","unmotivated"],
  publicDomainLikely: true
},
{
  text: "The best and most beautiful things in the world cannot be seen or even touched—they must be felt with the heart.",
  author: "Helen Keller",
  source: "(attrib.)",
  moods: ["grieving","lonely"],
  publicDomainLikely: false
},
{
  text: "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
  author: "Arthur Conan Doyle",
  source: "Sherlock Holmes",
  moods: ["anxious","stressed"],
  publicDomainLikely: true
},
{
  text: "He who has health has hope; and he who has hope has everything.",
  author: "Thomas Carlyle",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "Happiness depends upon ourselves.",
  author: "Aristotle",
  source: "(attrib.)",
  moods: ["sad","down"],
  publicDomainLikely: true
},
{
  text: "You are never too old to set another goal or to dream a new dream.",
  author: "C. S. Lewis",
  source: "(attrib.)",
  moods: ["hopeless","unmotivated"],
  publicDomainLikely: false
},
{
  text: "Act as if what you do makes a difference. It does.",
  author: "William James",
  source: "(attrib.)",
  moods: ["hopeless","unmotivated"],
  publicDomainLikely: true
},
{
  text: "Happiness is not something ready made. It comes from your own actions.",
  author: "Dalai Lama",
  source: "(attrib.)",
  moods: ["down","unmotivated"],
  publicDomainLikely: false
},
{
  text: "It is never too late to be what you might have been.",
  author: "George Eliot",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "Do what you can, with what you have, where you are.",
  author: "Theodore Roosevelt",
  source: "(attrib.)",
  moods: ["unmotivated","down"],
  publicDomainLikely: true
},
{
  text: "There is nothing in the world so irresistibly contagious as laughter and good humor.",
  author: "Charles Dickens",
  source: "A Christmas Carol",
  moods: ["sad","down"],
  publicDomainLikely: true
},
{
  text: "Kind words can be short and easy to speak, but their echoes are truly endless.",
  author: "Mother Teresa",
  source: "(attrib.)",
  moods: ["sad","lonely"],
  publicDomainLikely: false
},
{
  text: "Faith is taking the first step even when you don't see the whole staircase.",
  author: "Martin Luther King Jr.",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: false
},
{
  text: "Our greatest glory is not in never falling, but in rising every time we fall.",
  author: "Confucius",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "If you light a lamp for someone, it will also brighten your path.",
  author: "Buddha",
  source: "(attrib.)",
  moods: ["sad","lonely"],
  publicDomainLikely: true
},
{
  text: "All the darkness in the world cannot extinguish the light of a single candle.",
  author: "Francis of Assisi",
  source: "(attrib.)",
  moods: ["hopeless","sad"],
  publicDomainLikely: true
},
{
  text: "If we have no peace, it is because we have forgotten that we belong to each other.",
  author: "Mother Teresa",
  source: "(attrib.)",
  moods: ["sad","grieving"],
  publicDomainLikely: false
},
{
  text: "Peace begins with a smile.",
  author: "Mother Teresa",
  source: "(attrib.)",
  moods: ["stressed","anxious"],
  publicDomainLikely: false
},
{
  text: "Every moment is a fresh beginning.",
  author: "T. S. Eliot",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "There are far better things ahead than any we leave behind.",
  author: "C. S. Lewis",
  source: "(attrib.)",
  moods: ["hopeless","grieving"],
  publicDomainLikely: false
},
{
  text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
  author: "Buddha",
  source: "(attrib.)",
  moods: ["sad","lonely"],
  publicDomainLikely: true
},
{
  text: "Be kind whenever possible. It is always possible.",
  author: "Dalai Lama",
  source: "(attrib.)",
  moods: ["sad","down"],
  publicDomainLikely: false
},
{
  text: "With the new day comes new strength and new thoughts.",
  author: "Eleanor Roosevelt",
  source: "(attrib.)",
  moods: ["unmotivated","down"],
  publicDomainLikely: false
},
{
  text: "It is during our darkest moments that we must focus to see the light.",
  author: "Aristotle",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "The soul becomes dyed with the color of its thoughts.",
  author: "Marcus Aurelius",
  source: "Meditations",
  moods: ["down","unmotivated"],
  publicDomainLikely: true
},
{
  text: "Be not afraid of life. Believe that life is worth living, and your belief will help create the fact.",
  author: "William James",
  source: "(attrib.)",
  moods: ["hopeless","down"],
  publicDomainLikely: true
},
{
  text: "No one can make you feel inferior without your consent.",
  author: "Eleanor Roosevelt",
  source: "(attrib.)",
  moods: ["anxious","down"],
  publicDomainLikely: false
},
{
  text: "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.",
  author: "Eleanor Roosevelt",
  source: "(attrib.)",
  moods: ["anxious","stressed"],
  publicDomainLikely: false
},
{
  text: "Everything you’ve ever wanted is on the other side of fear.",
  author: "George Addair",
  source: "(attrib.)",
  moods: ["anxious","unmotivated"],
  publicDomainLikely: false
},
{
  text: "If you want to lift yourself up, lift up someone else.",
  author: "Booker T. Washington",
  source: "(attrib.)",
  moods: ["sad","hopeless"],
  publicDomainLikely: true
},
{
  text: "Keep love in your heart. A life without it is like a sunless garden when the flowers are dead.",
  author: "Oscar Wilde",
  source: "(attrib.)",
  moods: ["sad","lonely"],
  publicDomainLikely: true
},
{
  text: "A gentle word, a kind look, a good-natured smile can work wonders and accomplish miracles.",
  author: "William Hazlitt",
  source: "(attrib.)",
  moods: ["sad","lonely"],
  publicDomainLikely: true
},
{
  text: "A day without laughter is a day wasted.",
  author: "Charlie Chaplin",
  source: "(attrib.)",
  moods: ["down","sad"],
  publicDomainLikely: true
},
{
  text: "Everything has beauty, but not everyone sees it.",
  author: "Confucius",
  source: "(attrib.)",
  moods: ["down","unmotivated"],
  publicDomainLikely: true
},
{
  text: "Be faithful in small things because it is in them that your strength lies.",
  author: "Mother Teresa",
  source: "(attrib.)",
  moods: ["unmotivated","down"],
  publicDomainLikely: false
},
{
  text: "When you reach the end of your rope, tie a knot in it and hang on.",
  author: "Franklin D. Roosevelt",
  source: "(attrib.)",
  moods: ["hopeless","grieving"],
  publicDomainLikely: false
},
{
  text: "In the middle of every difficulty lies opportunity.",
  author: "Albert Einstein",
  source: "(attrib.)",
  moods: ["hopeless","stressed"],
  publicDomainLikely: false
},
{
  text: "Each day provides its own gifts.",
  author: "Marcus Aurelius",
  source: "Meditations",
  moods: ["sad","down"],
  publicDomainLikely: true
},
{
  text: "The greater part of our happiness or misery depends on our dispositions and not on our circumstances.",
  author: "Martha Washington",
  source: "(attrib.)",
  moods: ["sad","hopeless"],
  publicDomainLikely: true
},
{
  text: "Happiness is not having what you want. It is wanting what you have.",
  author: "Rabbi Hyman Schachtel",
  source: "(attrib.)",
  moods: ["sad","down"],
  publicDomainLikely: false
},
{
  text: "Gratitude turns what we have into enough.",
  author: "",
  source: "",
  moods: ["sad","unmotivated"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Even stars need darkness to shine.",
  author: "",
  source: "",
  moods: ["hopeless","sad"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Your story isn’t over; it’s just turning a page.",
  author: "",
  source: "",
  moods: ["hopeless","grieving"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Peace is not the absence of trouble, but the presence of calm.",
  author: "",
  source: "",
  moods: ["anxious","stressed"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "One kind act can start a chain reaction of good things you may never see.",
  author: "",
  source: "",
  moods: ["sad","down"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "You are doing better than you think you are.",
  author: "",
  source: "",
  moods: ["unmotivated","anxious"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Every sunrise is a reminder that light always returns.",
  author: "",
  source: "",
  moods: ["hopeless","sad"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "Small steps every day still move you forward.",
  author: "",
  source: "",
  moods: ["unmotivated","down"],
  publicDomainLikely: true,
  isAffirmation: true
},
{
  text: "You are stronger than the storm that tried to break you.",
  author: "",
  source: "",
  moods: ["hopeless","grieving"],
  publicDomainLikely: true,
  isAff

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

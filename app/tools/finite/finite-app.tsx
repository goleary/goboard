"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// ── Types ──────────────────────────────────────────────────────

interface ClosedItem {
  id: string;
  text: string;
  done: boolean;
}

interface OpenItem {
  id: string;
  text: string;
}

interface DoneEntry {
  id: string;
  text: string;
  timestamp: number;
}

interface OneThing {
  name: string;
  startDate: string;
}

interface WaitingItem {
  id: string;
  name: string;
}

interface FiniteState {
  closedList: ClosedItem[];
  openList: OpenItem[];
  closedListLimit: number;
  oneThing: OneThing | null;
  waitingWings: WaitingItem[];
  doneList: DoneEntry[];
}

// ── Constants ──────────────────────────────────────────────────

const BIRTHDATE = new Date(1991, 7, 22); // Aug 22, 1991
const EXPECTED_LIFESPAN = 80;
const STORAGE_KEY = "finite-state";

const OPEN_LIST_MESSAGES = [
  "You can't do them all and you were never going to.",
  "They'll still be there tomorrow.",
  "This is what not-doing looks like.",
  "Choosing means letting other things wait.",
  "Everything can't be now. That's okay.",
];

type Tab = "today" | "one-thing" | "done" | "reflect";

const TABS: { key: Tab; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "one-thing", label: "One Thing" },
  { key: "done", label: "Done" },
  { key: "reflect", label: "Reflect" },
];

// ── Meditations ────────────────────────────────────────────────

const MEDITATIONS: {
  quote: string;
  source: string;
  practice: string;
}[] = [
  {
    quote:
      "The world is already broken. You don't need to fix it before you can start living.",
    source: "Oliver Burkeman",
    practice:
      "Do one thing today that matters to you, without waiting for conditions to be perfect.",
  },
  {
    quote:
      "You are finite, and that is not a problem to be solved — it is the fundamental structure of a meaningful life.",
    source: "Oliver Burkeman",
    practice:
      "Notice one moment where you feel the pull to 'just quickly' do something off-list. Sit with the discomfort instead.",
  },
  {
    quote:
      "It is not that we have a short time to live, but that we waste a great deal of it.",
    source: "Seneca",
    practice:
      "Identify one activity today that you do out of habit rather than intention. Skip it.",
  },
  {
    quote:
      "The desire to get more done is really a desire to feel in control, and you can't.",
    source: "Oliver Burkeman",
    practice:
      "Choose one area where you'll deliberately aim for 'good enough' today, not excellent.",
  },
  {
    quote:
      "We are so made that we can derive intense enjoyment only from a contrast.",
    source: "Sigmund Freud",
    practice:
      "Do one thing today purely for its own sake, not as a means to anything else.",
  },
  {
    quote:
      "The best time to plant a tree was twenty years ago. The second best time is now.",
    source: "Chinese proverb",
    practice: "Start something you've been postponing. Do the worst version of it. Begin.",
  },
  {
    quote:
      "How we spend our days is, of course, how we spend our lives.",
    source: "Annie Dillard",
    practice:
      "Pay close attention to one ordinary moment today — washing dishes, walking, eating. Be fully there.",
  },
  {
    quote:
      "You don't have to see the whole staircase, just take the first step.",
    source: "Martin Luther King Jr.",
    practice:
      "Take one small, imperfect action on your One Thing. Five minutes is enough.",
  },
  {
    quote:
      "The soul becomes dyed with the colour of its thoughts.",
    source: "Marcus Aurelius",
    practice:
      "When you catch yourself mentally rehearsing the future, gently return to what is in front of you right now.",
  },
  {
    quote:
      "Attention is the beginning of devotion.",
    source: "Mary Oliver",
    practice:
      "Give one conversation today your complete, undivided attention. Put everything else down.",
  },
  {
    quote:
      "We suffer more often in imagination than in reality.",
    source: "Seneca",
    practice:
      "Notice one worry about the future. Ask: is this something I can act on right now? If not, let it be.",
  },
  {
    quote:
      "The impediment to action advances action. What stands in the way becomes the way.",
    source: "Marcus Aurelius",
    practice:
      "Instead of avoiding the hardest thing on your list, do it first. Accept that it will feel uncomfortable.",
  },
  {
    quote:
      "Almost everything will work again if you unplug it for a few minutes — including you.",
    source: "Anne Lamott",
    practice:
      "Take a real break today. Not scrolling — actual rest. Sit, stare, breathe.",
  },
  {
    quote:
      "You could leave life right now. Let that determine what you do and say and think.",
    source: "Marcus Aurelius",
    practice:
      "Act on one generous impulse immediately, without deliberating about whether it's the best use of your time.",
  },
  {
    quote:
      "Efficiency is not the point. The point is to experience your life, not to race through it.",
    source: "Oliver Burkeman",
    practice:
      "Deliberately do something slowly today. Walk slower. Eat slower. Read a page without skimming.",
  },
  {
    quote:
      "The price of anything is the amount of life you exchange for it.",
    source: "Henry David Thoreau",
    practice:
      "Before saying yes to any new commitment today, pause and ask: what am I saying no to?",
  },
  {
    quote:
      "Waking up to the truth of your situation is always better than remaining asleep to it.",
    source: "Oliver Burkeman",
    practice:
      "Acknowledge one thing you've been avoiding. You don't have to fix it — just stop pretending it isn't there.",
  },
  {
    quote:
      "People are frugal in guarding their personal property; but as soon as it comes to squandering time, they are most wasteful of the one thing in which it is right to be stingy.",
    source: "Seneca",
    practice:
      "Track how you actually spend the next hour. No judgment — just honest observation.",
  },
  {
    quote:
      "What a liberation to realize that the 'voice in my head' is not who I am.",
    source: "Eckhart Tolle",
    practice:
      "When you notice self-criticism today, treat it as weather — something passing through, not something true about you.",
  },
  {
    quote:
      "The things you own end up owning you.",
    source: "Chuck Palahniuk",
    practice:
      "Remove one thing from your to-do list or open list that you've been carrying out of guilt, not genuine desire.",
  },
  {
    quote:
      "In the middle of difficulty lies opportunity.",
    source: "Albert Einstein",
    practice:
      "Reframe one frustration today: what is this situation making possible that wouldn't exist otherwise?",
  },
  {
    quote:
      "Perfectionism is the voice of the oppressor.",
    source: "Anne Lamott",
    practice:
      "Finish something today and call it done, even though it could be better. Ship the imperfect thing.",
  },
  {
    quote:
      "No man is free who is not master of himself.",
    source: "Epictetus",
    practice:
      "Say no to one thing today that you'd normally agree to out of obligation or people-pleasing.",
  },
  {
    quote:
      "The only way to do great work is to love what you do.",
    source: "Steve Jobs",
    practice:
      "Notice what you naturally gravitate toward when no one is watching. That's a signal worth listening to.",
  },
  {
    quote:
      "It does not matter how slowly you go, so long as you do not stop.",
    source: "Confucius",
    practice:
      "Make the smallest possible amount of progress on something important. Tiny counts.",
  },
  {
    quote:
      "Time isn't a resource to be managed. It's the medium in which you exist.",
    source: "Oliver Burkeman",
    practice:
      "Abandon your schedule for one hour today. Do whatever feels right in the moment.",
  },
  {
    quote:
      "Be tolerant with others and strict with yourself.",
    source: "Marcus Aurelius",
    practice:
      "Extend grace to someone who frustrates you today. Their finitude is just like yours.",
  },
  {
    quote:
      "This is it. This moment is your life.",
    source: "adapted from Burkeman",
    practice:
      "Before bed, recall three moments from today that you were actually present for. That's enough.",
  },
];

const SELF_EXAM_QUESTIONS = [
  "Where are you pursuing comfort when discomfort is called for?",
  "Are you holding yourself to impossible standards?",
  "In what ways have you yet to accept that you are who you are?",
  "Where are you holding back until you feel ready?",
  "How would you spend today if nobody would ever know?",
];

// ── Helpers ────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function weeksLived(birthdate: Date, now: Date): number {
  const ms = now.getTime() - birthdate.getTime();
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}

function totalWeeks(lifespan: number): number {
  return lifespan * 52;
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function weeksSince(dateStr: string): number {
  const start = new Date(dateStr);
  const now = new Date();
  const ms = now.getTime() - start.getTime();
  return Math.max(1, Math.floor(ms / (7 * 24 * 60 * 60 * 1000)));
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function groupByDate(entries: DoneEntry[]): Map<string, DoneEntry[]> {
  const groups = new Map<string, DoneEntry[]>();
  for (const entry of entries) {
    const key = new Date(entry.timestamp).toDateString();
    const group = groups.get(key) || [];
    group.push(entry);
    groups.set(key, group);
  }
  return groups;
}

// ── Default State ──────────────────────────────────────────────

const DEFAULT_STATE: FiniteState = {
  closedList: [],
  openList: [],
  closedListLimit: 3,
  oneThing: null,
  waitingWings: [],
  doneList: [],
};

// ── Component ──────────────────────────────────────────────────

export default function FiniteApp() {
  const [state, setState] = useState<FiniteState | null>(null);
  const [tab, setTab] = useState<Tab>("today");
  const [openListExpanded, setOpenListExpanded] = useState(false);
  const [newClosedItem, setNewClosedItem] = useState("");
  const [newOpenItem, setNewOpenItem] = useState("");
  const [newDoneItem, setNewDoneItem] = useState("");
  const [newOneThingName, setNewOneThingName] = useState("");
  const [newWaitingItem, setNewWaitingItem] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState({ ...DEFAULT_STATE, ...JSON.parse(saved) });
      } else {
        setState(DEFAULT_STATE);
      }
    } catch {
      setState(DEFAULT_STATE);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const update = useCallback(
    (partial: Partial<FiniteState>) => {
      setState((prev) => (prev ? { ...prev, ...partial } : prev));
    },
    []
  );

  // ── Weeks calculation ──

  const now = useMemo(() => new Date(), []);
  const lived = useMemo(() => weeksLived(BIRTHDATE, now), [now]);
  const total = totalWeeks(EXPECTED_LIFESPAN);
  const remaining = total - lived;
  const meditationIndex = dayOfYear(now) % 28;

  if (!state) {
    return (
      <div className="min-h-screen bg-[#f8f5ee] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#c4bdb2] animate-pulse" />
      </div>
    );
  }

  // ── Closed list handlers ──

  const addClosedItem = () => {
    const text = newClosedItem.trim();
    if (!text || state.closedList.length >= state.closedListLimit) return;
    update({
      closedList: [...state.closedList, { id: uid(), text, done: false }],
    });
    setNewClosedItem("");
  };

  const toggleClosedItem = (id: string) => {
    const item = state.closedList.find((i) => i.id === id);
    if (!item) return;

    if (!item.done) {
      // Complete: move to done list, remove from closed
      update({
        closedList: state.closedList.filter((i) => i.id !== id),
        doneList: [
          { id: uid(), text: item.text, timestamp: Date.now() },
          ...state.doneList,
        ],
      });
    } else {
      update({
        closedList: state.closedList.map((i) =>
          i.id === id ? { ...i, done: false } : i
        ),
      });
    }
  };

  const removeClosedItem = (id: string) => {
    update({
      closedList: state.closedList.filter((i) => i.id !== id),
    });
  };

  // ── Open list handlers ──

  const addOpenItem = () => {
    const text = newOpenItem.trim();
    if (!text) return;
    update({
      openList: [...state.openList, { id: uid(), text }],
    });
    setNewOpenItem("");
  };

  const removeOpenItem = (id: string) => {
    update({
      openList: state.openList.filter((i) => i.id !== id),
    });
  };

  const promoteOpenItem = (id: string) => {
    if (state.closedList.length >= state.closedListLimit) return;
    const item = state.openList.find((i) => i.id === id);
    if (!item) return;
    update({
      openList: state.openList.filter((i) => i.id !== id),
      closedList: [
        ...state.closedList,
        { id: uid(), text: item.text, done: false },
      ],
    });
  };

  // ── Done list handlers ──

  const addDoneItem = () => {
    const text = newDoneItem.trim();
    if (!text) return;
    update({
      doneList: [
        { id: uid(), text, timestamp: Date.now() },
        ...state.doneList,
      ],
    });
    setNewDoneItem("");
  };

  // ── One Thing handlers ──

  const setOneThing = () => {
    const name = newOneThingName.trim();
    if (!name) return;
    if (state.oneThing) {
      update({
        waitingWings: [
          ...state.waitingWings,
          { id: uid(), name: state.oneThing.name },
        ],
        oneThing: { name, startDate: new Date().toISOString().slice(0, 10) },
      });
    } else {
      update({
        oneThing: { name, startDate: new Date().toISOString().slice(0, 10) },
      });
    }
    setNewOneThingName("");
  };

  const completeOneThing = () => {
    if (!state.oneThing) return;
    update({
      doneList: [
        {
          id: uid(),
          text: `Completed: ${state.oneThing.name}`,
          timestamp: Date.now(),
        },
        ...state.doneList,
      ],
      oneThing: null,
    });
  };

  const addWaitingItem = () => {
    const name = newWaitingItem.trim();
    if (!name) return;
    update({
      waitingWings: [...state.waitingWings, { id: uid(), name }],
    });
    setNewWaitingItem("");
  };

  const removeWaitingItem = (id: string) => {
    update({
      waitingWings: state.waitingWings.filter((i) => i.id !== id),
    });
  };

  const promoteWaitingItem = (id: string) => {
    const item = state.waitingWings.find((i) => i.id === id);
    if (!item) return;
    const oldOneThing = state.oneThing;
    update({
      oneThing: { name: item.name, startDate: new Date().toISOString().slice(0, 10) },
      waitingWings: [
        ...state.waitingWings.filter((i) => i.id !== id),
        ...(oldOneThing ? [{ id: uid(), name: oldOneThing.name }] : []),
      ],
    });
  };

  // ── Render helpers ──

  const openListMessage =
    OPEN_LIST_MESSAGES[
      Math.floor(dayOfYear(now) * 7 + state.openList.length) %
        OPEN_LIST_MESSAGES.length
    ];

  const meditation = MEDITATIONS[meditationIndex];

  const doneGrouped = groupByDate(state.doneList);

  return (
    <div className="min-h-screen bg-[#f8f5ee] text-[#33302b] font-[family-name:var(--font-newsreader)]">
      {/* ── Header ── */}
      <header className="pt-8 pb-4 px-5 text-center">
        <h1 className="font-[family-name:var(--font-fraunces)] text-2xl tracking-tight text-[#5a5347]">
          Finite
        </h1>
      </header>

      {/* ── Tab bar ── */}
      <nav className="flex justify-center gap-1 px-4 pb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              tab === t.key
                ? "bg-[#33302b] text-[#f8f5ee]"
                : "text-[#8a8479] hover:text-[#5a5347]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <main className="max-w-lg mx-auto px-5 pb-16">
        {/* ════════ TODAY ════════ */}
        {tab === "today" && (
          <div className="space-y-10">
            {/* Weeks grid */}
            <section>
              <div
                className="mx-auto"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(52, 1fr)",
                  gap: "1.5px",
                  maxWidth: "320px",
                }}
              >
                {Array.from({ length: total }, (_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-[1px] ${
                      i < lived
                        ? i === lived - 1
                          ? "bg-[#6b5c4c]"
                          : "bg-[#c4bdb2]"
                        : "bg-[#ece8e0]"
                    }`}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-[#8a8479] mt-3 leading-relaxed">
                {lived.toLocaleString()} weeks lived &middot;{" "}
                {remaining.toLocaleString()} remaining &middot; This is week{" "}
                {(lived + 1).toLocaleString()}
              </p>
            </section>

            {/* Closed list */}
            <section>
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-[family-name:var(--font-fraunces)] text-lg text-[#5a5347]">
                  What you&rsquo;re choosing today
                </h2>
                <span className="text-xs text-[#8a8479]">
                  {state.closedList.length} of {state.closedListLimit}
                </span>
              </div>

              {state.closedList.length === 0 && (
                <p className="text-sm text-[#8a8479] italic mb-4">
                  Nothing chosen yet. What matters most?
                </p>
              )}

              <ul className="space-y-2 mb-4">
                {state.closedList.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 group"
                  >
                    <button
                      onClick={() => toggleClosedItem(item.id)}
                      className="w-5 h-5 rounded-full border-2 border-[#c4bdb2] flex-shrink-0 flex items-center justify-center hover:border-[#7a8b6f] transition-colors"
                    >
                      {item.done && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#7a8b6f]" />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-base ${
                        item.done
                          ? "line-through text-[#b5afa5]"
                          : "text-[#33302b]"
                      }`}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() => removeClosedItem(item.id)}
                      className="text-[#c4bdb2] hover:text-[#8a8479] opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                      aria-label="Remove"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>

              {state.closedList.length < state.closedListLimit && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addClosedItem();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newClosedItem}
                    onChange={(e) => setNewClosedItem(e.target.value)}
                    placeholder="Add something..."
                    className="flex-1 bg-transparent border-b border-[#ddd8ce] text-sm py-1.5 px-0 placeholder:text-[#c4bdb2] focus:outline-none focus:border-[#8a8479] transition-colors"
                  />
                  <button
                    type="submit"
                    className="text-sm text-[#8a8479] hover:text-[#5a5347] transition-colors"
                  >
                    Add
                  </button>
                </form>
              )}
            </section>

            {/* Open list */}
            <section>
              <button
                onClick={() => setOpenListExpanded(!openListExpanded)}
                className="w-full text-left"
              >
                <p className="text-sm text-[#8a8479] leading-relaxed">
                  {state.openList.length === 0 ? (
                    <span className="italic">
                      Your open list is empty. That&rsquo;s fine too.
                    </span>
                  ) : (
                    <>
                      <span className="text-[#6b5c4c] font-medium">
                        {state.openList.length}
                      </span>{" "}
                      other{" "}
                      {state.openList.length === 1 ? "thing" : "things"} on
                      your open list.{" "}
                      <span className="italic">{openListMessage}</span>
                    </>
                  )}
                  <span className="ml-1 inline-block transition-transform duration-200"
                    style={{
                      transform: openListExpanded ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  >
                    &rsaquo;
                  </span>
                </p>
              </button>

              {openListExpanded && (
                <div className="mt-4 pl-0">
                  <ul className="space-y-1.5 mb-3">
                    {state.openList.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2 group text-sm text-[#8a8479]"
                      >
                        <span className="flex-1">{item.text}</span>
                        {state.closedList.length <
                          state.closedListLimit && (
                          <button
                            onClick={() => promoteOpenItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-xs text-[#7a8b6f] hover:text-[#5a7a4a] transition-all"
                            title="Move to today"
                          >
                            &uarr;
                          </button>
                        )}
                        <button
                          onClick={() => removeOpenItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#c4bdb2] hover:text-[#8a8479] transition-all"
                          aria-label="Remove"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addOpenItem();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={newOpenItem}
                      onChange={(e) => setNewOpenItem(e.target.value)}
                      placeholder="Add to open list..."
                      className="flex-1 bg-transparent border-b border-[#e8e2d8] text-sm py-1 px-0 placeholder:text-[#c4bdb2] focus:outline-none focus:border-[#8a8479] transition-colors"
                    />
                    <button
                      type="submit"
                      className="text-xs text-[#8a8479] hover:text-[#5a5347] transition-colors"
                    >
                      Add
                    </button>
                  </form>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ════════ ONE THING ════════ */}
        {tab === "one-thing" && (
          <div className="space-y-10">
            {state.oneThing ? (
              <section className="text-center pt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a8479] mb-6">
                  Your one thing
                </p>
                <h2 className="font-[family-name:var(--font-fraunces)] text-3xl text-[#33302b] mb-3 leading-snug">
                  {state.oneThing.name}
                </h2>
                <p className="text-sm text-[#8a8479] mb-8">
                  Week {weeksSince(state.oneThing.startDate)} of giving this
                  your best energy.
                </p>
                <button
                  onClick={completeOneThing}
                  className="text-xs text-[#8a8479] hover:text-[#5a5347] border border-[#ddd8ce] rounded-full px-4 py-1.5 transition-colors"
                >
                  Mark complete
                </button>
              </section>
            ) : (
              <section className="text-center pt-8">
                <p className="text-sm text-[#8a8479] italic mb-6">
                  What deserves your best energy right now?
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setOneThing();
                  }}
                  className="max-w-xs mx-auto"
                >
                  <input
                    type="text"
                    value={newOneThingName}
                    onChange={(e) => setNewOneThingName(e.target.value)}
                    placeholder="Name your one thing..."
                    className="w-full bg-transparent border-b border-[#ddd8ce] text-center text-base py-2 px-0 placeholder:text-[#c4bdb2] focus:outline-none focus:border-[#8a8479] transition-colors"
                  />
                  <button
                    type="submit"
                    className="mt-4 text-sm text-[#8a8479] hover:text-[#5a5347] transition-colors"
                  >
                    Set focus
                  </button>
                </form>
              </section>
            )}

            {/* Waiting in the wings */}
            <section>
              <div className="border-t border-[#ece8e0] pt-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#b5afa5] mb-1">
                  Waiting in the wings
                </p>
                <p className="text-xs text-[#b5afa5] italic mb-4">
                  These are real desires. They&rsquo;ll get a turn. Not now.
                </p>

                {state.waitingWings.length === 0 && (
                  <p className="text-sm text-[#c4bdb2] italic mb-4">
                    Nothing waiting yet.
                  </p>
                )}

                <ul className="space-y-1.5 mb-4">
                  {state.waitingWings.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-2 group text-sm text-[#8a8479]"
                    >
                      <span className="flex-1">{item.name}</span>
                      <button
                        onClick={() => promoteWaitingItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-xs text-[#7a8b6f] hover:text-[#5a7a4a] transition-all"
                        title="Make this your one thing"
                      >
                        Focus
                      </button>
                      <button
                        onClick={() => removeWaitingItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#c4bdb2] hover:text-[#8a8479] transition-all"
                        aria-label="Remove"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addWaitingItem();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={newWaitingItem}
                    onChange={(e) => setNewWaitingItem(e.target.value)}
                    placeholder="Something for later..."
                    className="flex-1 bg-transparent border-b border-[#e8e2d8] text-sm py-1 px-0 placeholder:text-[#c4bdb2] focus:outline-none focus:border-[#8a8479] transition-colors"
                  />
                  <button
                    type="submit"
                    className="text-xs text-[#8a8479] hover:text-[#5a5347] transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>
            </section>

            <p className="text-xs text-[#c4bdb2] italic text-center leading-relaxed max-w-xs mx-auto">
              Focusing on one thing means tolerating the discomfort of all the
              unlived possibilities.
            </p>
          </div>
        )}

        {/* ════════ DONE ════════ */}
        {tab === "done" && (
          <div className="space-y-8">
            <section>
              <p className="text-xs uppercase tracking-[0.2em] text-[#8a8479] mb-4">
                What you&rsquo;ve done
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addDoneItem();
                }}
                className="flex gap-2 mb-6"
              >
                <input
                  type="text"
                  value={newDoneItem}
                  onChange={(e) => setNewDoneItem(e.target.value)}
                  placeholder="Something you did..."
                  className="flex-1 bg-transparent border-b border-[#ddd8ce] text-sm py-1.5 px-0 placeholder:text-[#c4bdb2] focus:outline-none focus:border-[#8a8479] transition-colors"
                />
                <button
                  type="submit"
                  className="text-sm text-[#8a8479] hover:text-[#5a5347] transition-colors"
                >
                  Add
                </button>
              </form>

              {state.doneList.length === 0 ? (
                <p className="text-sm text-[#c4bdb2] italic">
                  Each day starts empty and fills up.
                </p>
              ) : (
                <div className="space-y-6">
                  {Array.from(doneGrouped.entries()).map(
                    ([dateKey, entries]) => (
                      <div key={dateKey}>
                        <p className="text-xs text-[#b5afa5] mb-2">
                          {formatDate(entries[0].timestamp)}
                        </p>
                        <ul className="space-y-1.5">
                          {entries.map((entry) => (
                            <li
                              key={entry.id}
                              className="text-sm text-[#5a5347] flex items-start gap-2"
                            >
                              <span className="text-[#7a8b6f] mt-0.5 flex-shrink-0">
                                &check;
                              </span>
                              <span>{entry.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            <p className="text-sm text-[#8a8479] italic text-center pt-4 border-t border-[#ece8e0]">
              You did enough. You are enough.
            </p>
          </div>
        )}

        {/* ════════ REFLECT ════════ */}
        {tab === "reflect" && (
          <div className="space-y-10">
            <section className="text-center pt-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#b5afa5] mb-6">
                Day {(meditationIndex + 1)} of 28
              </p>
              <blockquote className="font-[family-name:var(--font-fraunces)] text-xl leading-relaxed text-[#33302b] mb-3 max-w-sm mx-auto">
                &ldquo;{meditation.quote}&rdquo;
              </blockquote>
              <p className="text-xs text-[#8a8479] mb-8">
                &mdash; {meditation.source}
              </p>
            </section>

            <section>
              <p className="text-xs uppercase tracking-[0.2em] text-[#b5afa5] mb-3">
                Today&rsquo;s practice
              </p>
              <p className="text-sm text-[#5a5347] leading-relaxed">
                {meditation.practice}
              </p>
            </section>

            <section className="border-t border-[#ece8e0] pt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-[#b5afa5] mb-4">
                Five questions for self-examination
              </p>
              <ol className="space-y-3">
                {SELF_EXAM_QUESTIONS.map((q, i) => (
                  <li
                    key={i}
                    className="text-sm text-[#5a5347] leading-relaxed flex gap-2"
                  >
                    <span className="text-[#b5afa5] flex-shrink-0">
                      {i + 1}.
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

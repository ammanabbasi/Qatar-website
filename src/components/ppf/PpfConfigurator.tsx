"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, buttonClasses } from "@/components/ui/Button";
import { AlertIcon, CheckIcon, ChevronIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { CarDiagram } from "./CarDiagram";
import {
  BODY_TYPES,
  COVERAGES,
  CUSTOM_MINIMUM_QAR,
  FILMS,
  PARTS,
  PART_KEYS,
  PRESET_PARTS,
  isFilm,
  makeBookingRef,
  quotePpf,
  type BodyType,
  type CoverageKey,
  type FilmKey,
  type PartKey,
} from "@/data/ppfInstall";
import { formatNumber, formatQar } from "@/lib/pricing";
import { buildPpfBookingWhatsAppUrl } from "@/lib/whatsapp";
import { trackPpfBooking } from "@/lib/analytics";

type L = "en" | "ar";
type Step = 0 | 1 | 2 | 3;
const STEP_KEYS = ["stepVehicle", "stepCoverage", "stepFilm", "stepDetails"] as const;

type FieldKey = "make" | "model" | "year" | "name" | "mobile" | "email" | "preferredDate" | "consent";
type Form = {
  make: string;
  model: string;
  year: string;
  existingFilm: string;
  preferredDate: string;
  name: string;
  mobile: string;
  email: string;
  notes: string;
  consent: boolean;
  website: string; // honeypot
};

type Result = { saved: boolean; ref: string };

const EXISTING = ["existingNone", "existingPpf", "existingWrap", "existingRepaint", "existingUnsure"] as const;
const DURATION: Record<CoverageKey, string> = {
  "front-end": "durationFrontEnd",
  "full-front": "durationFullFront",
  "full-body": "durationFullBody",
  custom: "durationCustom",
};
/** Film packshots - the same images the product pages use. */
const FILM_IMAGE: Record<FilmKey, string> = {
  pro: "/products/vtek/vtek-weather-armor-pro.webp",
  "pro-plus": "/products/vtek/vtek-weather-armor-pro-plus.webp",
  matte: "/products/vtek/vtek-weather-armor-matte.webp",
  prism: "/products/vtek/vtek-weather-armor-prism.webp",
};
const FORM_FIELDS: FieldKey[] = ["make", "model", "year", "name", "mobile", "email", "consent"];
/** Matches the sheet-down / modal-out animations in globals.css. */
const CLOSE_MS = 260;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Counts the displayed price toward its new value — 400 ms, eased. */
function useAnimatedNumber(target: number | null) {
  const [shown, setShown] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = target;
    if (target === null || from === null || from === target || prefersReducedMotion()) {
      setShown(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 400);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Ad click IDs from the landing URL, falling back to the Google tag's own cookie. */
function readClickIds() {
  const q = new URLSearchParams(window.location.search);
  let gclid = q.get("gclid") ?? "";
  if (!gclid) {
    const m = document.cookie.match(/(?:^|;\s*)_gcl_aw=([^;]+)/);
    if (m) gclid = decodeURIComponent(m[1]).split(".").slice(2).join(".");
  }
  return {
    gclid,
    gbraid: q.get("gbraid") ?? "",
    wbraid: q.get("wbraid") ?? "",
    utmSource: q.get("utm_source") ?? "",
    utmMedium: q.get("utm_medium") ?? "",
    utmCampaign: q.get("utm_campaign") ?? "",
  };
}

function BodyIcon({ body, className = "h-10 w-auto" }: { body: BodyType; className?: string }) {
  const d = {
    sedan: "M6 30 L14 30 Q16 24 22 24 Q28 24 30 30 L66 30 Q68 24 74 24 Q80 24 82 30 L92 30 L92 24 Q90 19 78 17 L62 9 Q56 6 44 6 L34 7 Q26 9 20 16 L10 18 Q6 20 6 24 Z",
    suv: "M6 30 L14 30 Q16 23 22 23 Q28 23 30 30 L66 30 Q68 23 74 23 Q80 23 82 30 L92 30 L92 20 Q91 15 84 14 L72 5 Q68 3 58 3 L28 3 Q22 3 18 8 L10 15 Q6 17 6 21 Z",
    "large-suv": "M4 30 L13 30 Q15 22 22 22 Q29 22 31 30 L65 30 Q67 22 74 22 Q81 22 83 30 L94 30 L94 16 Q93 12 88 11 L80 2 L26 2 Q20 2 17 6 L8 13 Q4 15 4 19 Z",
  }[body];
  return (
    <svg viewBox="0 0 98 36" aria-hidden className={className}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="22" cy="30" r="4.5" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="74" cy="30" r="4.5" fill="var(--color-surface)" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Field({
  id,
  label,
  required,
  optionalLabel,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-footnote font-semibold text-(--color-text)">
        {label}
        {required ? <span aria-hidden className="ms-0.5 text-(--color-danger)">*</span> : null}
        {optionalLabel ? (
          <span className="ms-1.5 font-normal text-(--color-text-subtle)">({optionalLabel})</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-caption font-medium text-(--color-danger)">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-caption text-(--color-text-muted)">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const plainBorder = "border-(--color-border) focus-visible:border-(--color-brand-deep)";

const inputCls =
  "h-12 w-full rounded-xl border bg-(--color-surface) px-3.5 text-body text-(--color-text) transition-colors duration-150 placeholder:text-(--color-text-subtle) hover:border-(--color-text-subtle) focus-visible:outline-2 focus-visible:outline-offset-0 disabled:opacity-50";

const optionCls = (active: boolean) =>
  `relative flex w-full items-center gap-4 rounded-xl border bg-(--color-surface) p-4 text-start transition-[border-color,background-color,box-shadow,transform] duration-150 ease-soft active:scale-[0.985] ${
    active
      ? "border-(--color-brand) bg-(--color-brand)/[0.07] shadow-[inset_0_0_0_1px_var(--color-brand)]"
      : "border-(--color-border) hover:border-(--color-text-subtle)"
  }`;

/**
 * The installed-PPF quote builder. On the page it is a launcher card; the
 * four steps run in a native <dialog> — a full-height bottom sheet on phones
 * (drag the handle down, or press Back, to close) and a centred modal on
 * larger screens. Quote state lives here, outside the dialog, so closing and
 * reopening picks up exactly where the customer left off.
 */
export function PpfConfigurator() {
  const t = useTranslations("PpfInstall");
  const locale = useLocale() as L;
  const qar = (n: number) => formatQar(n, locale);

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [body, setBody] = useState<BodyType | null>(null);
  // "Front-end" is the default coverage: it matches the "from" price, so the
  // footer shows a real price and the diagram shows its zone from the first
  // view. Every panel on the diagram stays tappable ("Choose parts" is last).
  const [coverage, setCoverage] = useState<CoverageKey>("front-end");
  const [parts, setParts] = useState<Set<PartKey>>(new Set());
  const [film, setFilm] = useState<FilmKey>("pro");
  const [announce, setAnnounce] = useState("");
  const [form, setForm] = useState<Form>({
    make: "",
    model: "",
    year: "",
    existingFilm: "existingNone",
    preferredDate: "",
    name: "",
    mobile: "",
    email: "",
    notes: "",
    consent: false,
    website: "",
  });
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const startedAt = useRef(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const closeTimer = useRef(0);
  const drag = useRef<{ y: number; dy: number; t: number } | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // ── open / close ────────────────────────────────────────────────────────
  const finishClose = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    const d = dialogRef.current;
    if (d) d.style.translate = "";
    setClosing(false);
    setOpen(false);
  }, []);

  const animateClose = useCallback(() => {
    if (closeTimer.current) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = 0;
      finishClose();
    }, prefersReducedMotion() ? 0 : CLOSE_MS);
  }, [finishClose]);

  // Opening pushes a history entry so a phone's Back button closes the
  // sheet instead of leaving the page; closing from the UI pops it again.
  // (Next.js merges native pushState into its router — see its docs on the
  // Native History API.)
  const requestClose = useCallback(() => {
    if ((window.history.state as { ppfSheet?: boolean } | null)?.ppfSheet) window.history.back();
    else animateClose();
  }, [animateClose]);

  const openSheet = useCallback(
    (preset?: BodyType) => {
      if (preset && !result) {
        setBody(preset);
        setDir(1);
        setStep(1);
      }
      if (open) return;
      window.history.pushState({ ppfSheet: true }, "");
      setOpen(true);
    },
    [open, result],
  );

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onPop = () => animateClose();
    window.addEventListener("popstate", onPop);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("popstate", onPop);
    };
  }, [open, animateClose]);

  // Any "#quote" link on the page (the hero button, deep links) opens the
  // sheet; without JavaScript it still scrolls to the launcher.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href="#quote"]');
      if (!a) return;
      e.preventDefault();
      openSheet();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openSheet]);

  // Deep links, first load only: `?film=pro-plus` preselects that film (the
  // product pages link here) and `#quote` opens the sheet. Read on the client
  // so the page itself can stay statically rendered.
  useEffect(() => {
    let wanted = new URLSearchParams(window.location.search).get("film");
    if (wanted === "ultimate") wanted = "pro-plus";
    const deepLink = window.location.hash === "#quote";
    if (!isFilm(wanted) && !deepLink) return;
    const id = window.setTimeout(() => {
      if (isFilm(wanted)) setFilm(wanted);
      if (deepLink) openSheet();
    }, 350);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // New step or result: back to the top of the sheet, focus its heading.
  const viewKey = `${step}|${result?.ref ?? ""}`;
  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [viewKey, open]);

  // ── drag the sheet down to dismiss (phones only) ─────────────────────────
  function onDragStart(e: ReactPointerEvent) {
    if (window.matchMedia("(min-width: 40rem)").matches) return;
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = { y: e.clientY, dy: 0, t: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onDragMove(e: ReactPointerEvent) {
    const g = drag.current;
    const d = dialogRef.current;
    if (!g || !d) return;
    g.dy = Math.max(0, e.clientY - g.y);
    d.style.transition = "none";
    d.style.translate = `0 ${g.dy}px`;
  }
  function onDragEnd() {
    const g = drag.current;
    const d = dialogRef.current;
    drag.current = null;
    if (!g || !d) return;
    const velocity = g.dy / Math.max(1, performance.now() - g.t);
    d.style.transition = "translate 240ms var(--ease-sheet)";
    if (g.dy > 120 || velocity > 0.6) {
      d.style.translate = "0 100%";
      if ((window.history.state as { ppfSheet?: boolean } | null)?.ppfSheet) {
        // Pop our history entry; the popstate close is skipped by the timer guard.
        closeTimer.current = window.setTimeout(() => {
          closeTimer.current = 0;
          finishClose();
        }, 240);
        window.history.back();
      } else {
        closeTimer.current = window.setTimeout(() => {
          closeTimer.current = 0;
          finishClose();
        }, 240);
      }
    } else {
      d.style.translate = "";
    }
  }

  // ── quote ───────────────────────────────────────────────────────────────
  const selectedParts: Set<PartKey> = useMemo(() => {
    if (coverage === "custom") return parts;
    return new Set(PRESET_PARTS[coverage]);
  }, [coverage, parts]);

  const quote = useMemo(
    () =>
      body
        ? quotePpf({ body, coverage, parts: [...parts], film })
        : { priceQar: null, isEstimate: false },
    [body, coverage, parts, film],
  );
  const animatedPrice = useAnimatedNumber(quote.priceQar);

  const bodyInfo = BODY_TYPES.find((b) => b.key === body);
  const coverageInfo = COVERAGES.find((c) => c.key === coverage)!;
  const filmInfo = FILMS.find((f) => f.key === film)!;
  const partNames = coverage === "custom" ? PARTS.filter((p) => parts.has(p.key)).map((p) => p.name[locale]) : [];

  const canAdvance =
    (step === 0 && body !== null) ||
    (step === 1 && (coverage !== "custom" || parts.size > 0)) ||
    step === 2;

  const go = (next: Step) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  // ── validation (on blur, and everything on submit) ──
  const maxYear = new Date().getFullYear() + 1;
  function errorFor(k: FieldKey): string | undefined {
    const v = form;
    switch (k) {
      case "make":
      case "model":
      case "name":
        return v[k].trim().length < (k === "name" ? 2 : 1) ? t("errRequired") : undefined;
      case "year": {
        const y = Number(v.year);
        return !Number.isInteger(y) || y < 1990 || y > maxYear ? t("errYear", { max: maxYear }) : undefined;
      }
      case "mobile": {
        const digits = v.mobile.replace(/[\s()-]/g, "").replace(/^(\+|00)?974/, "");
        return /^[3567]\d{7}$/.test(digits) ? undefined : t("errMobile");
      }
      case "email":
        return v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()) ? t("errEmail") : undefined;
      case "preferredDate":
        return undefined;
      case "consent":
        return v.consent ? undefined : t("errConsent");
    }
  }
  const shownError = (k: FieldKey) => (touched[k] || submitted ? errorFor(k) : undefined);
  const set = <K extends keyof Form>(k: K, val: Form[K]) => setForm((f) => ({ ...f, [k]: val }));
  const blur = (k: FieldKey) => () => setTouched((s) => ({ ...s, [k]: true }));
  const aria = (k: FieldKey, hasHint = false) => {
    const err = shownError(k);
    return {
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `ppf-${k}-error` : hasHint ? `ppf-${k}-hint` : undefined,
    };
  };
  const borderFor = (k: FieldKey) =>
    shownError(k)
      ? "border-(--color-danger) focus-visible:border-(--color-danger) focus-visible:outline-(--color-danger)"
      : plainBorder;

  // Tapping a panel (diagram or list) always lands in "Choose parts": from a
  // preset it seeds the selection with that preset's panels, then toggles.
  function togglePart(p: PartKey) {
    const next = new Set(selectedParts);
    const wasOn = next.has(p);
    if (wasOn) next.delete(p);
    else next.add(p);
    setCoverage("custom");
    setParts(next);
    const name = PARTS.find((x) => x.key === p)?.name[locale] ?? p;
    setAnnounce(t(wasOn ? "partRemoved" : "partAdded", { part: name }));
  }

  function chooseCoverage(c: CoverageKey) {
    // "Choose parts" keeps whatever is lit, so the customer edits from there.
    if (c === "custom") setParts(new Set(selectedParts));
    setCoverage(c);
  }

  function setAllParts(all: boolean) {
    setCoverage("custom");
    setParts(all ? new Set(PART_KEYS) : new Set());
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const firstBad = FORM_FIELDS.find((k) => errorFor(k));
    if (firstBad) {
      const el = document.getElementById(`ppf-${firstBad}`);
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
      return;
    }
    if (!body) return;
    setSending(true);
    const payload = {
      body,
      coverage,
      parts: coverage === "custom" ? [...parts] : [],
      film,
      locale,
      ...form,
      existingFilm: t(form.existingFilm as (typeof EXISTING)[number]),
      year: Number(form.year),
      startedAt: startedAt.current,
      ...readClickIds(),
    };
    let next: Result;
    try {
      const res = await fetch("/api/ppf-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const out = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string };
      next = { saved: Boolean(out.ok), ref: out.ref ?? makeBookingRef() };
    } catch {
      next = { saved: false, ref: makeBookingRef() };
    }
    if (next.saved) {
      trackPpfBooking({ ref: next.ref, priceQar: quote.priceQar, coverage, film, body });
    }
    setSending(false);
    setResult(next);
  }

  function startOver() {
    setResult(null);
    setSubmitted(false);
    setTouched({});
    setDir(-1);
    setStep(0);
    startedAt.current = Date.now();
  }

  // Before a coverage is chosen the footer shows the entry price instead of a dash.
  const entryPrice = quotePpf({ body: body ?? "sedan", coverage: "front-end", parts: [], film: "pro" }).priceQar!;
  const priceLabel = !body
    ? t("eyebrow")
    : quote.priceQar === null
      ? coverage === "custom" && parts.size === 0
        ? t("summaryChooseParts")
        : t("summaryQuote")
      : quote.isEstimate
        ? t("summaryEstimate")
        : t("summaryFixed");
  const priceText =
    animatedPrice !== null && quote.priceQar !== null
      ? qar(animatedPrice)
      : !body
        ? t("priceFrom", { price: qar(entryPrice) })
        : coverage === "custom" && parts.size === 0
          ? t("priceFrom", { price: qar(CUSTOM_MINIMUM_QAR) })
          : t("priceToQuote");

  const whatsappHref = result
    ? buildPpfBookingWhatsAppUrl({
        locale,
        ref: result.ref,
        vehicle: `${form.year} ${form.make} ${form.model}`.trim(),
        bodyType: bodyInfo?.name[locale] ?? "",
        coverage: coverageInfo.name[locale],
        parts: partNames,
        film: filmInfo.name[locale],
        price:
          quote.priceQar === null
            ? undefined
            : `${quote.isEstimate ? (locale === "ar" ? "تقديري " : "estimate ") : ""}${qar(quote.priceQar)}`,
        preferredDate: form.preferredDate || undefined,
        name: form.name.trim(),
      })
    : "";

  const recap = `${bodyInfo?.name[locale]} · ${coverageInfo.name[locale]} · ${filmInfo.name[locale]}`;
  const startedQuote = body !== null && !result;

  // ── quote selector (in the page hero) ───────────────────────────────────
  const ctaLabel = result
    ? t("launchViewBooking", { ref: result.ref })
    : startedQuote
      ? `${t("launchResume")}${quote.priceQar !== null ? ` · ${qar(quote.priceQar)}` : ""}`
      : t("launchStart");

  const launcher = (
    <div className="rounded-hero bg-(--color-surface) p-4 text-(--color-text) sm:p-5">
      <p className="px-2 text-footnote font-semibold">{t("bodyTitle")}</p>
      <ul className="mt-1 divide-y divide-(--color-border-soft)">
        {BODY_TYPES.map((b) => {
          const from = quotePpf({ body: b.key, coverage: "front-end", parts: [], film: "pro" }).priceQar!;
          return (
            <li key={b.key}>
              <button
                type="button"
                onClick={() => openSheet(b.key)}
                className="group flex min-h-16 w-full items-center gap-3 rounded-xl px-2 py-2.5 text-start transition-colors duration-150 hover:bg-(--color-bg) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--color-brand-deep) active:bg-(--color-fill)"
              >
                <span className="flex h-10 w-14 shrink-0 items-center justify-center text-(--color-text-muted) transition-colors duration-150 group-hover:text-(--color-text) rtl:-scale-x-100">
                  <BodyIcon body={b.key} className="h-7 w-auto" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body font-semibold leading-tight">{b.name[locale]}</span>
                  <span className="mt-0.5 block text-caption text-(--color-text-muted)">{b.examples[locale]}</span>
                </span>
                <span className="shrink-0 text-end leading-tight">
                  <span className="block text-caption text-(--color-text-muted)">{t("from")}</span>
                  <span className="block text-footnote font-semibold tabular-nums">{qar(from)}</span>
                </span>
                <ChevronIcon className="hidden h-3.5 w-3.5 shrink-0 text-(--color-text-subtle) transition-transform sm:block duration-150 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <button
          type="button"
          onClick={() => openSheet()}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-(--color-brand) px-7 text-body font-semibold text-(--color-ink) transition-[background-color,transform] duration-150 hover:bg-(--color-brand-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-deep) active:scale-[0.98] sm:w-auto"
        >
          {ctaLabel}
          <ChevronIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
        </button>
        <a
          href="#prices"
          className="text-center text-footnote text-(--color-link) underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-brand-deep) sm:text-start"
        >
          {t("launchPrices")}
        </a>
      </div>
    </div>
  );

  // ── steps ───────────────────────────────────────────────────────────────
  const heading = (text: string) => (
    <h3 ref={headingRef} tabIndex={-1} className="text-title-sm font-semibold outline-none sm:text-title">
      {text}
    </h3>
  );

  const stepBody = (() => {
    if (step === 0)
      return (
        <>
          {heading(t("bodyTitle"))}
          <div role="radiogroup" aria-label={t("bodyTitle")} className="mt-5 grid gap-3 sm:grid-cols-3">
            {BODY_TYPES.map((b) => {
              const active = body === b.key;
              const from = quotePpf({ body: b.key, coverage: "front-end", parts: [], film: "pro" }).priceQar!;
              return (
                <button
                  key={b.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setBody(b.key);
                    window.setTimeout(() => go(1), prefersReducedMotion() ? 0 : 220);
                  }}
                  className={`${optionCls(active)} sm:flex-col sm:items-start sm:gap-3 sm:p-5`}
                >
                  <span className="flex h-12 w-20 shrink-0 items-center justify-center text-(--color-text-muted) rtl:-scale-x-100 sm:h-14 sm:w-full sm:justify-start sm:rtl:justify-end">
                    <BodyIcon body={b.key} className="h-8 w-auto sm:h-11" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-body font-semibold">{b.name[locale]}</span>
                    <span className="mt-0.5 block text-caption text-(--color-text-muted)">{b.examples[locale]}</span>
                    <span className="mt-1.5 block text-footnote font-semibold tabular-nums">
                      {t("priceFrom", { price: qar(from) })}
                    </span>
                  </span>
                  <ChevronIcon className="h-3.5 w-3.5 shrink-0 text-(--color-text-subtle) rtl:-scale-x-100 sm:hidden" />
                </button>
              );
            })}
          </div>
        </>
      );

    if (step === 1 && body) {
      const total = PARTS.length;
      return (
        <>
          {heading(t("coverageTitle"))}
          <p className="mt-1.5 text-footnote text-(--color-text-muted)">{t("coverageTap")}</p>
          {/* Spoken confirmation of each tap on the diagram or the list. */}
          <p role="status" aria-live="polite" className="sr-only">
            {announce}
          </p>

          <div className="mt-4 grid grid-cols-[9.5rem_minmax(0,1fr)] items-start gap-x-3 gap-y-4 sm:grid-cols-[minmax(0,15.5rem)_minmax(0,1fr)] sm:gap-x-6">
            {/* The diagram is the centrepiece: always tappable, beside the packages on phones too. */}
            <div className="rounded-tile border border-(--color-border-soft) bg-(--color-surface) p-2 shadow-tile sm:row-span-3">
              <p className="text-center text-caption text-(--color-text-muted)">{t("front")}</p>
              <div className="my-1">
                <CarDiagram
                  selected={selectedParts}
                  frontEdge={coverage === "front-end"}
                  onTogglePart={togglePart}
                  label={t("diagramLabel")}
                  className="h-64 sm:h-[340px]"
                />
              </div>
              <p className="text-center text-caption text-(--color-text-muted)">{t("rear")}</p>
            </div>

            <div role="radiogroup" aria-label={t("packagesTitle")} className="grid gap-2">
              {COVERAGES.map((c) => {
                const active = coverage === c.key;
                const p = c.key === "custom" ? null : quotePpf({ body, coverage: c.key, parts: [], film: "pro" }).priceQar;
                return (
                  <button
                    key={c.key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => chooseCoverage(c.key)}
                    className={`${optionCls(active)} min-h-14 gap-2.5 px-3 py-2.5`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-footnote font-semibold leading-tight">{c.name[locale]}</span>
                      <span className="mt-0.5 block text-caption tabular-nums text-(--color-text-muted)">
                        {p !== null ? qar(p) : t("packageCustomSub")}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p key={coverage} className="ppf-step-in col-span-2 text-caption text-(--color-text-muted) sm:col-span-1 sm:col-start-2">
              {coverageInfo.desc[locale]}
              {coverage === "front-end" ? ` ${t("frontEndNote")}` : ""}{" "}
              {t("summaryDuration", { duration: t(DURATION[coverageInfo.key] as "durationFrontEnd") })}
            </p>

            <div role="group" aria-labelledby="ppf-parts-label" className="col-span-2 sm:col-span-1 sm:col-start-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p id="ppf-parts-label" className="text-footnote font-semibold">
                  {t("partsTitle")}{" "}
                  <span className="font-normal text-(--color-text-muted)">
                    {t("partsCount", {
                      count: formatNumber(selectedParts.size, locale),
                      total: formatNumber(total, locale),
                    })}
                  </span>
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setAllParts(true)} disabled={selectedParts.size === total}>
                    {t("partsSelectAll")}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setAllParts(false)} disabled={selectedParts.size === 0}>
                    {t("partsClear")}
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {PARTS.map((p) => {
                  const on = selectedParts.has(p.key);
                  return (
                    <button
                      key={p.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => togglePart(p.key)}
                      className={`inline-flex h-11 items-center gap-1.5 rounded-pill border px-3.5 text-footnote font-medium transition-[background-color,border-color,color,transform] duration-150 ease-soft active:scale-95 ${
                        on
                          ? "border-(--color-brand) bg-(--color-brand) text-(--color-ink)"
                          : "border-(--color-border) bg-(--color-surface) text-(--color-text) hover:border-(--color-text-subtle)"
                      }`}
                    >
                      {on ? <CheckIcon className="h-3.5 w-3.5" /> : null}
                      {p.name[locale]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      );
    }

    if (step === 2 && body)
      return (
        <>
          {heading(t("filmTitle"))}
          <div role="radiogroup" aria-label={t("filmTitle")} className="mt-5 grid gap-3 sm:grid-cols-2">
            {FILMS.map((f) => {
              const active = film === f.key;
              const p = quotePpf({ body, coverage, parts: [...parts], film: f.key }).priceQar;
              const baseP = quotePpf({ body, coverage, parts: [...parts], film: "pro" }).priceQar;
              return (
                <div key={f.key} className="relative">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFilm(f.key)}
                    className={`${optionCls(active)} h-full items-start pb-14`}
                  >
                    <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-(--color-border-soft) bg-(--color-surface)">
                      <Image src={FILM_IMAGE[f.key]} alt="" width={160} height={160} sizes="80px" className="h-full w-full scale-125 object-contain" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-body font-semibold">{f.name[locale]}</span>
                      <span className="mt-0.5 block text-footnote font-semibold tabular-nums">
                        {f.uplift === 0
                          ? t("filmIncluded")
                          : f.uplift === null
                            ? t("filmQuote")
                            : p !== null && baseP !== null
                              ? t("filmExtra", { amount: qar(p - baseP) })
                              : ""}
                      </span>
                      <span className="mt-1 block text-caption text-(--color-text-muted)">{f.desc[locale]}</span>
                      <span className="mt-1.5 block text-caption text-(--color-text-muted)">
                        {t("filmWarranty", { years: f.warrantyYears, yearsText: formatNumber(f.warrantyYears, locale) })}
                      </span>
                    </span>
                  </button>
                  <Link
                    href={`/b2c/products/${f.productSlug}`}
                    target="_blank"
                    className="text-link absolute bottom-1 end-4 min-h-11 text-caption"
                  >
                    {t("filmDetails")} ›
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      );

    if (step === 3)
      return (
        <form id="ppf-form" noValidate onSubmit={onSubmit}>
          {heading(t("detailsTitle"))}
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-(--color-border-soft) bg-(--color-surface) py-1 ps-4 pe-2">
            <p className="min-w-0 text-footnote text-(--color-text-muted)">{recap}</p>
            <button
              type="button"
              onClick={() => go(1)}
              className="text-link min-h-11 shrink-0 px-2 text-footnote font-medium"
            >
              {t("recapChange")}
            </button>
          </div>
          {submitted && FORM_FIELDS.some((k) => errorFor(k)) ? (
            <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-(--color-danger)/8 px-4 py-3 text-footnote font-medium text-(--color-danger)">
              <AlertIcon className="h-4 w-4 shrink-0" />
              {t("errForm")}
            </p>
          ) : null}
          <div role="group" aria-labelledby="ppf-group-car" className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4">
            <p id="ppf-group-car" className="col-span-2 text-footnote font-semibold">
              {t("groupCar")}
            </p>
            <Field id="ppf-make" label={t("make")} required error={shownError("make")}>
              <input id="ppf-make" autoComplete="off" value={form.make} onChange={(e) => set("make", e.target.value)} onBlur={blur("make")} maxLength={60} className={`${inputCls} ${borderFor("make")}`} {...aria("make")} />
            </Field>
            <Field id="ppf-model" label={t("model")} required error={shownError("model")}>
              <input id="ppf-model" autoComplete="off" value={form.model} onChange={(e) => set("model", e.target.value)} onBlur={blur("model")} maxLength={60} className={`${inputCls} ${borderFor("model")}`} {...aria("model")} />
            </Field>
            <div className="col-span-2 sm:col-span-1">
              <Field id="ppf-year" label={t("year")} required error={shownError("year")}>
                <input id="ppf-year" inputMode="numeric" value={form.year} onChange={(e) => set("year", e.target.value.replace(/\D/g, "").slice(0, 4))} onBlur={blur("year")} className={`${inputCls} ltr-nums ${borderFor("year")}`} {...aria("year")} />
              </Field>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <Field id="ppf-existing" label={t("existingFilm")}>
                <select id="ppf-existing" value={form.existingFilm} onChange={(e) => set("existingFilm", e.target.value)} className={`${inputCls} ${plainBorder}`}>
                  {EXISTING.map((k) => (
                    <option key={k} value={k}>
                      {t(k)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
          <div role="group" aria-labelledby="ppf-group-details" className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-x-4">
            <p id="ppf-group-details" className="text-footnote font-semibold sm:col-span-2">
              {t("groupDetails")}
            </p>
            <Field id="ppf-name" label={t("name")} required error={shownError("name")}>
              <input id="ppf-name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} onBlur={blur("name")} maxLength={80} className={`${inputCls} ${borderFor("name")}`} {...aria("name")} />
            </Field>
            <Field id="ppf-mobile" label={t("mobile")} required hint={t("mobileHint")} error={shownError("mobile")}>
              <input id="ppf-mobile" type="tel" autoComplete="tel" inputMode="tel" placeholder="5555 1234" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} onBlur={blur("mobile")} maxLength={20} className={`${inputCls} ltr-nums ${borderFor("mobile")}`} {...aria("mobile", true)} />
            </Field>
            <Field id="ppf-email" label={t("email")} optionalLabel={t("optional")} error={shownError("email")}>
              <input id="ppf-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} onBlur={blur("email")} maxLength={120} className={`${inputCls} ltr-nums ${borderFor("email")}`} {...aria("email")} />
            </Field>
            <Field id="ppf-preferredDate" label={t("preferredDate")} optionalLabel={t("optional")} hint={t("preferredDateHint")}>
              <input id="ppf-preferredDate" type="date" min={todayPlus(2)} value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} className={`${inputCls} ${plainBorder}`} aria-describedby="ppf-preferredDate-hint" />
            </Field>
            <div className="sm:col-span-2">
              <Field id="ppf-notes" label={t("notes")} optionalLabel={t("optional")}>
                <textarea id="ppf-notes" rows={3} maxLength={500} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t("notesPlaceholder")} className={`${inputCls} h-auto py-2.5 ${plainBorder}`} />
              </Field>
            </div>
            {/* Honeypot — hidden from people and assistive tech, irresistible to bots. */}
            <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="ppf-website">Website</label>
              <input id="ppf-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-(--color-border-soft) bg-(--color-surface) p-4 text-footnote text-(--color-text)">
                <input
                  id="ppf-consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  onBlur={blur("consent")}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-(--color-brand-deep)"
                  {...aria("consent")}
                />
                <span>
                  {t("consent")}
                  <span aria-hidden className="ms-0.5 text-(--color-danger)">*</span>
                </span>
              </label>
              {shownError("consent") ? (
                <p id="ppf-consent-error" className="mt-1.5 ps-1 text-caption font-medium text-(--color-danger)">
                  {shownError("consent")}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      );
    return null;
  })();

  const resultView = result ? (
    <div className="mx-auto max-w-xl py-2 text-center sm:py-6">
      <div className="relative mx-auto h-20 w-20">
        <svg viewBox="0 0 80 80" aria-hidden className="relative h-20 w-20">
          <circle cx="40" cy="40" r="36" fill={result.saved ? "var(--color-brand)" : "var(--color-fill)"} opacity={result.saved ? 0.15 : 1} />
          <circle cx="40" cy="40" r="36" fill="none" stroke={result.saved ? "var(--color-brand-deep)" : "var(--color-text-subtle)"} strokeWidth="3" className="ppf-draw" style={{ ["--len" as string]: 227 }} transform="rotate(-90 40 40)" />
          {result.saved ? (
            <path d="M25 41 L35 51 L56 30" fill="none" stroke="var(--color-brand-deep)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="ppf-draw" style={{ ["--len" as string]: 46, animationDelay: "350ms" }} />
          ) : (
            <path d="M40 24 V44 M40 54 V56" fill="none" stroke="var(--color-text)" strokeWidth="5" strokeLinecap="round" className="ppf-draw" style={{ ["--len" as string]: 34, animationDelay: "350ms" }} />
          )}
        </svg>
      </div>
      <h3 ref={headingRef} tabIndex={-1} className="ppf-step-in mt-5 text-title font-semibold outline-none">
        {result.saved ? t("successTitle") : t("failTitle")}
      </h3>
      <p className="ppf-step-in mt-2 text-body text-(--color-text-muted)" role="status">
        {result.saved ? t("successBody") : t("failBody")}
      </p>
      <div className="ppf-step-in mt-6 rounded-tile border border-(--color-border-soft) bg-(--color-surface) p-5 shadow-tile">
        <p className="text-footnote text-(--color-text-muted)">{t("refLabel")}</p>
        <p className="ltr-nums mt-1 font-mono text-title font-semibold tracking-wider text-(--color-text)">{result.ref}</p>
        <p className="mt-2 text-footnote text-(--color-text-muted)">
          {recap}
          {quote.priceQar !== null ? ` · ${qar(quote.priceQar)}` : ""}
        </p>
      </div>
      <ol className="mt-7 flex flex-col gap-3 text-start">
        <li className="text-body font-semibold">{t("nextTitle")}</li>
        {(["next1", "next2", "next3"] as const).map((k, i) => (
          <li key={k} className="flex gap-3 text-footnote text-(--color-text-muted)">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-caption font-semibold text-(--color-text)">
              {i + 1}
            </span>
            <span className="pt-0.5">{t(k)}</span>
          </li>
        ))}
      </ol>
      <Button variant="secondary" size="sm" className="mt-7" onClick={startOver}>
        {t("startOver")}
      </Button>
    </div>
  ) : null;

  // ── sheet ───────────────────────────────────────────────────────────────
  const sheet = (
    <dialog
      ref={dialogRef}
      className="ppf-sheet"
      aria-labelledby="ppf-sheet-title"
      data-closing={closing ? "" : undefined}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      {open ? (
        <div className="flex h-full flex-col">
          {/* Header: drag handle (phones), title, progress, close */}
          <div
            className="touch-none select-none border-b border-(--color-border-soft) bg-(--color-surface) px-4 pb-3 pt-2 sm:px-8 sm:pt-6"
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
          >
            <div aria-hidden className="mx-auto mb-2 h-1.5 w-10 rounded-pill bg-(--color-fill) sm:hidden" />
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {step > 0 && !result ? (
                  <button
                    type="button"
                    onClick={() => go((step - 1) as Step)}
                    aria-label={t("back")}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-(--color-fill) focus-visible:outline-2 focus-visible:outline-(--color-brand-deep)"
                  >
                    <ChevronIcon className="h-4 w-4 rotate-180 rtl:rotate-0" />
                  </button>
                ) : null}
                <p id="ppf-sheet-title" className="truncate text-body font-semibold">
                  {t("sheetTitle")}
                </p>
              </div>
              <button
                type="button"
                onClick={requestClose}
                aria-label={t("close")}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-fill) transition-colors hover:bg-(--color-fill-hover) focus-visible:outline-2 focus-visible:outline-(--color-brand-deep)"
              >
                <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
            {!result ? (
              <ol className="mt-3 grid grid-cols-4 gap-1.5" aria-label={t("stepOf", { current: step + 1, total: 4 })}>
                {STEP_KEYS.map((k, i) => {
                  const done = i < step;
                  const current = i === step;
                  return (
                    <li key={k}>
                      <button
                        type="button"
                        disabled={!done}
                        onClick={() => go(i as Step)}
                        aria-current={current ? "step" : undefined}
                        className="group -my-1.5 flex w-full flex-col gap-1.5 py-1.5 text-start disabled:cursor-default"
                      >
                        <span className="relative h-1 w-full overflow-hidden rounded-pill bg-(--color-fill)">
                          <span
                            className={`absolute inset-0 origin-left rounded-pill bg-(--color-brand) transition-transform duration-500 ease-(--ease-sheet) rtl:origin-right ${
                              done || current ? "scale-x-100" : "scale-x-0"
                            }`}
                          />
                        </span>
                        <span
                          className={`truncate text-caption font-semibold transition-colors ${
                            current ? "text-(--color-text)" : done ? "text-(--color-link) group-hover:underline" : "text-(--color-text-subtle)"
                          }`}
                        >
                          {t(k)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : null}
          </div>

          {/* Body: the step */}
          <div className="flex min-h-0 flex-1">
            <div ref={scrollRef} className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-8 sm:py-7">
              <div key={result ? `r-${result.ref}` : step} className={result ? "ppf-step-in" : dir === 1 ? "ppf-slide-fwd" : "ppf-slide-back"}>
                {result ? resultView : stepBody}
              </div>
            </div>
          </div>

          {/* Footer: live price + primary action, always in thumb reach */}
          {result ? (
            <div className="border-t border-(--color-border-soft) bg-(--color-surface) px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-8">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-order-ref={result.ref}
                data-placement="ppf_booking"
                data-conversion-value={quote.priceQar ?? undefined}
                data-conversion-currency="QAR"
                className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c w-full ${buttonClasses("primary", "lg")}`}
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t("sendWhatsApp")}
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-t border-(--color-border-soft) bg-(--color-surface) px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-8">
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption text-(--color-text-muted)">{priceLabel}</p>
                <p className="text-title-sm font-semibold leading-tight tabular-nums" aria-live="polite">
                  {priceText}
                </p>
                {body ? <p className="hidden truncate text-caption text-(--color-text-muted) sm:block">{recap}</p> : null}
              </div>
              {step > 0 ? (
                <button
                  key="back"
                  type="button"
                  onClick={() => go((step - 1) as Step)}
                  className="hidden h-12 items-center rounded-pill px-4 text-body font-medium text-(--color-text-muted) transition-colors duration-150 hover:text-(--color-text) sm:inline-flex"
                >
                  {t("back")}
                </button>
              ) : null}
              {/* Distinct keys: reusing one DOM button and flipping it to
                  type="submit" mid-click would submit the empty form the
                  moment "Continue" reaches the details step. */}
              {step === 0 ? null : step < 3 ? (
                <Button key="next" size="lg" onClick={() => go((step + 1) as Step)} disabled={!canAdvance}>
                  {t("next")}
                  <ChevronIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
                </Button>
              ) : (
                <Button key="submit" type="submit" form="ppf-form" size="lg" loading={sending}>
                  {sending ? t("submitting") : t("submit")}
                </Button>
              )}
            </div>
          )}
        </div>
      ) : null}
    </dialog>
  );

  return (
    <div className="scroll-mt-24">
      {launcher}
      {sheet}
    </div>
  );
}

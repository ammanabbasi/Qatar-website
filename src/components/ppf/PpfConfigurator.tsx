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
  isCoverage,
  isFilm,
  isVehicleBodySelection,
  makeBookingRef,
  quotePpf,
  quotePpfRange,
  type BodyType,
  type CoverageKey,
  type FilmKey,
  type PartKey,
  type VehicleBodySelection,
} from "@/data/ppfInstall";
import {
  POPULAR_QATAR_CARS,
  QATAR_CARS,
  resolveCarModelName,
  searchQatarCars,
  splitCarQuery,
  type QatarCarEntry,
} from "@/data/qatarCars";
import { formatNumber, formatQar } from "@/lib/pricing";
import {
  buildPpfBookingWhatsAppUrl,
  buildPpfCustomOfferWhatsAppUrl,
  buildPpfEnquiryWhatsAppUrl,
} from "@/lib/whatsapp";
import {
  trackPpfBooking,
  trackPpfQuoteComplete,
  trackPpfQuoteStart,
  trackPpfWhatsAppHandoff,
} from "@/lib/analytics";

type L = "en" | "ar";
type Step = 0 | 1 | 2 | 3;
const STEP_KEYS = ["stepVehicle", "stepCoverage", "stepFilm", "stepDetails"] as const;
const QUICK_YEARS = ["2026", "2025", "2024", "2023"] as const;

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
  "custom": "durationCustom",
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

function CustomCarIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 18.5h20v-3.2c0-1.1-.7-2.1-1.8-2.4l-2.7-.8-2.1-3.3A2.4 2.4 0 0 0 15.4 7.7H9.8c-.9 0-1.7.5-2.1 1.2L5.8 12l-1 .4c-.5.2-.8.7-.8 1.3v4.8Z" />
      <circle cx="8.5" cy="18.5" r="2.2" fill="var(--color-surface)" />
      <circle cx="19.5" cy="18.5" r="2.2" fill="var(--color-surface)" />
      <path d="M21 4.5v3M19.5 6h3" stroke="var(--color-brand-deep)" strokeWidth="2" />
    </svg>
  );
}

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6" />
      <path d="m13.5 13.5 3.5 3.5" />
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
  const [body, setBody] = useState<VehicleBodySelection | null>(null);
  // Default to "full-body" so high-intent full-body buyers immediately see
  // the complete 12-zone package and full-body pricing, while the hero pill bar
  // lets anyone switch to Full Front or Front-End in 1 tap.
  const [coverage, setCoverage] = useState<CoverageKey>("full-body");
  const [parts, setParts] = useState<Set<PartKey>>(new Set());
  const [film, setFilm] = useState<FilmKey>("pro");
  const [carQuery, setCarQuery] = useState("");
  const [customStepError, setCustomStepError] = useState(false);
  const [showPanels, setShowPanels] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
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
  const quoteStartTracked = useRef(false);
  const quoteCompleteTrackedKey = useRef("");
  const launcherRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const customMakeRef = useRef<HTMLInputElement>(null);
  const customPanelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef(0);
  const drag = useRef<{ y: number; dy: number; t: number } | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Track when the hero launcher card has scrolled out of view on mobile to show a sticky bottom bar.
  useEffect(() => {
    const el = launcherRef.current;
    if (!el) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      setShowStickyBar(el.getBoundingClientRect().bottom < 0);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(check);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const active = showStickyBar && !open;
    if (active) document.documentElement.dataset.stickyCta = "on";
    else delete document.documentElement.dataset.stickyCta;
    return () => {
      delete document.documentElement.dataset.stickyCta;
    };
  }, [showStickyBar, open]);

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

  const requestClose = useCallback(() => {
    if ((window.history.state as { ppfSheet?: boolean } | null)?.ppfSheet) window.history.back();
    else animateClose();
  }, [animateClose]);

  const openSheet = useCallback(
    (
      preset?: VehicleBodySelection,
      targetStep?: Step,
      presetCoverage?: CoverageKey,
      entryPoint = "hero_launcher",
    ) => {
      const nextCoverage = presetCoverage ?? coverage;
      if (presetCoverage) setCoverage(presetCoverage);
      if (preset && !result) {
        setBody(preset);
        setDir(1);
        if (targetStep !== undefined) {
          setStep(targetStep);
        } else if (preset === "custom") {
          const hasCar = Boolean(form.make.trim() || form.model.trim());
          setStep(hasCar ? 1 : 0);
        } else {
          setStep(1);
        }
      }
      if (!quoteStartTracked.current) {
        quoteStartTracked.current = true;
        trackPpfQuoteStart({
          body: preset ?? body ?? "unselected",
          coverage: nextCoverage,
          film,
          entryPoint,
        });
      }
      if (open) return;
      window.history.pushState({ ppfSheet: true }, "");
      setOpen(true);
    },
    [open, result, form.make, form.model, coverage, body, film],
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

  // Any "#quote" or "#quote-custom" link on the page opens the sheet;
  // links in the price table carry data-ppf-body / data-ppf-coverage / data-ppf-film.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href="#quote"], a[href="#quote-custom"]');
      if (!a) return;
      e.preventDefault();
      const href = a.getAttribute("href");
      const attrBody = a.getAttribute("data-ppf-body");
      const attrCov = a.getAttribute("data-ppf-coverage");
      let attrFilm = a.getAttribute("data-ppf-film");
      if (attrFilm === "ultimate") attrFilm = "pro-plus";
      const validCov = isCoverage(attrCov) ? attrCov : undefined;
      if (validCov) setCoverage(validCov);
      if (isFilm(attrFilm)) setFilm(attrFilm);
      if (href === "#quote-custom") {
        openSheet("custom", 0, validCov, "page_custom_link");
      } else if (isVehicleBodySelection(attrBody)) {
        openSheet(attrBody, isFilm(attrFilm) ? 2 : 1, validCov, "price_table_cell");
      } else {
        openSheet(undefined, undefined, validCov, "page_anchor");
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openSheet]);

  // Deep links, first load only: `?film=pro-plus` preselects that film (the
  // product pages link here) and `#quote` / `#quote-custom` opens the sheet.
  useEffect(() => {
    let wanted = new URLSearchParams(window.location.search).get("film");
    if (wanted === "ultimate") wanted = "pro-plus";
    const hash = window.location.hash;
    const deepLink = hash === "#quote" || hash === "#quote-custom";
    if (!isFilm(wanted) && !deepLink) return;
    const id = window.setTimeout(() => {
      if (isFilm(wanted)) setFilm(wanted);
      if (hash === "#quote-custom") openSheet("custom", 0);
      else if (deepLink) openSheet();
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

  // Scroll the Custom Offer panel into view smoothly when selected in Step 0
  useEffect(() => {
    if (open && step === 0 && body === "custom") {
      const id = window.setTimeout(() => {
        customPanelRef.current?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "nearest",
        });
      }, 80);
      return () => window.clearTimeout(id);
    }
  }, [open, step, body]);

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

  // ── smart car search & custom offer helpers ─────────────────────────────
  const matchedCars = useMemo(() => searchQatarCars(carQuery, 5), [carQuery]);

  const popularCars = useMemo(
    () =>
      POPULAR_QATAR_CARS.map((item) => {
        const entry = QATAR_CARS.find((c) => c.id === item.entryId);
        return entry ? { entry, label: item.shortLabel[locale] } : null;
      }).filter((x): x is { entry: QatarCarEntry; label: string } => x !== null),
    [locale],
  );

  const detectedFromCustomForm = useMemo(() => {
    const combined = `${form.make} ${form.model}`.trim();
    if (combined.length < 2) return null;
    return searchQatarCars(combined, 1)[0] ?? null;
  }, [form.make, form.model]);

  function selectMatchedCar(entry: QatarCarEntry, overrideModel?: string) {
    const resolved = resolveCarModelName(entry, overrideModel ?? carQuery, locale);
    setForm((f) => ({ ...f, make: resolved.make, model: resolved.model }));
    setCarQuery("");
    setCustomStepError(false);
    if (open) {
      setBody(entry.body);
      setDir(1);
      setStep(1);
    } else {
      openSheet(entry.body, 1);
    }
  }

  function selectCustomFromQuery(raw: string) {
    const { make, model } = splitCarQuery(raw, locale);
    setForm((f) => ({
      ...f,
      make: make || f.make,
      model: model || f.model,
    }));
    setCarQuery("");
    setCustomStepError(false);
    const hasCar = Boolean(make || model);
    if (open) {
      setBody("custom");
      setDir(1);
      setStep(hasCar ? 1 : 0);
    } else {
      openSheet("custom", hasCar ? 1 : 0);
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

  const quoteRange = useMemo(
    () =>
      body === "custom"
        ? quotePpfRange({ coverage, parts: [...parts], film })
        : null,
    [body, coverage, parts, film],
  );

  const animatedPrice = useAnimatedNumber(quote.priceQar);

  const bodyInfo = BODY_TYPES.find((b) => b.key === body);
  const coverageInfo = COVERAGES.find((c) => c.key === coverage)!;
  const filmInfo = FILMS.find((f) => f.key === film)!;
  const partNames = coverage === "custom" ? PARTS.filter((p) => parts.has(p.key)).map((p) => p.name[locale]) : [];

  const shortCarName = [form.make.trim(), form.model.trim()].filter(Boolean).join(" ");
  const fullCarName = [form.year.trim(), form.make.trim(), form.model.trim()].filter(Boolean).join(" ");

  const canAdvance =
    (step === 0 && body !== null && (body !== "custom" || Boolean(shortCarName))) ||
    (step === 1 && (coverage !== "custom" || parts.size > 0)) ||
    step === 2;

  const go = (next: Step) => {
    if (step === 0 && next > 0 && body === "custom" && !shortCarName) {
      setCustomStepError(true);
      customMakeRef.current?.focus();
      return;
    }
    setCustomStepError(false);
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  // ── validation (on blur, and everything on submit) ──
  const maxYear = new Date().getFullYear() + 1;
  function errorFor(k: FieldKey): string | undefined {
    const v = form;
    switch (k) {
      case "make":
        return v.make.trim().length < 1 && v.model.trim().length < 1 ? t("errRequired") : undefined;
      case "model":
        return v.model.trim().length < 1 && v.make.trim().length < 1 ? t("errRequired") : undefined;
      case "name":
        return v.name.trim().length < 2 ? t("errRequired") : undefined;
      case "year": {
        if (!v.year.trim()) return undefined;
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
    setShowPanels(true);
    setParts(next);
    const name = PARTS.find((x) => x.key === p)?.name[locale] ?? p;
    setAnnounce(t(wasOn ? "partRemoved" : "partAdded", { part: name }));
  }

  function chooseCoverage(c: CoverageKey) {
    // "Choose parts" keeps whatever is lit, so the customer edits from there.
    if (c === "custom") {
      setParts(new Set(selectedParts));
      setShowPanels(true);
    }
    setCoverage(c);
  }

  function setAllParts(all: boolean) {
    setCoverage("custom");
    setShowPanels(true);
    setParts(all ? new Set(PART_KEYS) : new Set());
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const firstBad = FORM_FIELDS.find((k) => errorFor(k));
    if (firstBad) {
      if (firstBad === "email" || firstBad === "preferredDate") {
        setShowOptionalDetails(true);
      }
      window.setTimeout(() => {
        const el = document.getElementById(`ppf-${firstBad}`);
        el?.focus();
        el?.scrollIntoView({ block: "center", behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }, 40);
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
      year: form.year.trim() ? Number(form.year) : "",
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
    quoteStartTracked.current = false;
    quoteCompleteTrackedKey.current = "";
  }

  // Track Funnel Stage 2 (Quote Completed) when customer reaches Step 3 with a configured quote
  useEffect(() => {
    if (!open || step !== 3 || !body || result) return;
    const key = `${body}|${coverage}|${film}|${quote.priceQar ?? "custom"}`;
    if (quoteCompleteTrackedKey.current === key) return;
    quoteCompleteTrackedKey.current = key;
    trackPpfQuoteComplete({
      body,
      coverage,
      film,
      priceQar: quote.priceQar,
      isEstimate: quote.isEstimate,
    });
  }, [open, step, body, coverage, film, quote.priceQar, quote.isEstimate, result]);

  // Before a vehicle is chosen, the footer shows the entry price for the active coverage preset.
  const entryPrice = quotePpf({
    body: body && body !== "custom" ? body : "sedan",
    coverage: coverage === "custom" ? "full-body" : coverage,
    parts: [],
    film: "pro",
  }).priceQar!;

  const rangeText = quoteRange
    ? t("priceRange", { min: qar(quoteRange.minQar), max: qar(quoteRange.maxQar) })
    : undefined;

  const priceLabel = !body
    ? t("eyebrow")
    : body === "custom"
      ? coverage === "custom" && parts.size === 0
        ? t("summaryChooseParts")
        : quoteRange
          ? t("summaryCustomRange")
          : t("summaryCustomOffer")
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
          : body === "custom" && rangeText
            ? rangeText
            : t("priceToQuote");

  const bodyLabel =
    body === "custom"
      ? t("customCarBadge")
      : bodyInfo?.name[locale] ?? "";

  const vehicleDisplay = shortCarName
    ? `${shortCarName} (${bodyLabel})`
    : bodyLabel;

  const recap = `${vehicleDisplay} · ${coverageInfo.name[locale]} · ${filmInfo.name[locale]}`;

  const whatsappHref = result
    ? buildPpfBookingWhatsAppUrl({
        locale,
        ref: result.ref,
        vehicle: `${form.year} ${form.make} ${form.model}`.trim(),
        bodyType: bodyLabel,
        coverage: coverageInfo.name[locale],
        parts: partNames,
        film: filmInfo.name[locale],
        price:
          quote.priceQar !== null
            ? `${quote.isEstimate ? (locale === "ar" ? "تقديري " : "estimate ") : ""}${qar(quote.priceQar)}`
            : rangeText
              ? `${t("customCarBadge")} (${rangeText})`
              : undefined,
        preferredDate: form.preferredDate || undefined,
        name: form.name.trim(),
      })
    : "";

  const fastOfferWhatsAppHref = buildPpfCustomOfferWhatsAppUrl({
    locale,
    vehicle: fullCarName || carQuery.trim() || bodyLabel || undefined,
    coverage: coverageInfo.name[locale],
    parts: partNames,
    film: filmInfo.name[locale],
    warrantyYears: filmInfo.warrantyYears,
    fixedPrice:
      body && body !== "custom" && quote.priceQar !== null
        ? `${quote.isEstimate ? (locale === "ar" ? "تقديري " : "Est. ") : ""}${qar(quote.priceQar)}`
        : undefined,
    priceRange: body === "custom" ? rangeText : undefined,
  });

  const startedQuote = body !== null && !result;

  // ── reusable Smart Car Make/Model Search Box ───────────────────────────
  const renderCarSearchBox = (inputId: string) => {
    const trimmed = carQuery.trim();
    return (
      <div className="relative">
        <label htmlFor={inputId} className="block text-caption font-medium text-(--color-text-muted)">
          {t("carSearchLabel")}
        </label>
        <div className="relative mt-1.5 flex items-center">
          <SearchIcon className="pointer-events-none absolute start-3.5 h-4 w-4 text-(--color-text-subtle)" />
          <input
            id={inputId}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            value={carQuery}
            onChange={(e) => setCarQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && trimmed.length > 0) {
                e.preventDefault();
                if (matchedCars.length === 1) {
                  selectMatchedCar(matchedCars[0]);
                } else {
                  selectCustomFromQuery(trimmed);
                }
              }
            }}
            placeholder={t("carSearchPlaceholder")}
            className="h-11 w-full rounded-xl border border-(--color-border) bg-(--color-bg) ps-10 pe-9 text-base text-(--color-text) transition-colors placeholder:text-(--color-text-subtle) hover:border-(--color-text-subtle) focus:bg-(--color-surface) focus-visible:border-(--color-brand-deep) focus-visible:outline-2 focus-visible:outline-offset-0 sm:text-footnote"
          />
          {carQuery ? (
            <button
              type="button"
              onClick={() => setCarQuery("")}
              aria-label={t("carSearchClear")}
              className="absolute end-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-(--color-text-subtle) hover:bg-(--color-fill) hover:text-(--color-text)"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          ) : null}
        </div>

        {/* 1-tap popular Qatar cars row when search is idle */}
        {trimmed.length === 0 ? (
          <div className="hide-scrollbar -mx-1 mt-2 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5">
            <span className="shrink-0 text-[11px] font-medium text-(--color-text-muted)">
              {t("popularCarsLabel")}
            </span>
            {popularCars.map(({ entry, label }) => {
              const isPicked =
                shortCarName.toLowerCase().includes(label.toLowerCase()) &&
                body === entry.body;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => selectMatchedCar(entry, label)}
                  className={`inline-flex h-7 shrink-0 items-center gap-1 rounded-pill border px-2.5 text-caption font-medium transition-colors active:scale-95 ${
                    isPicked
                      ? "border-(--color-brand) bg-(--color-brand)/20 text-(--color-ink)"
                      : "border-(--color-border-soft) bg-(--color-bg) text-(--color-text-muted) hover:border-(--color-text-subtle) hover:text-(--color-text)"
                  }`}
                >
                  {isPicked ? <CheckIcon className="h-3 w-3 text-(--color-brand-deep)" /> : null}
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}

        {trimmed.length > 0 ? (
          <div className="mt-2 overflow-hidden rounded-xl border border-(--color-border) bg-(--color-surface) shadow-tile">
            {matchedCars.length > 0 ? (
              <ul className="divide-y divide-(--color-border-soft)">
                {matchedCars.map((entry) => {
                  const cat = BODY_TYPES.find((b) => b.key === entry.body)!;
                  const fullBodyFrom = quotePpf({ body: entry.body, coverage: "full-body", parts: [], film: "pro" }).priceQar!;
                  const frontEndFrom = quotePpf({ body: entry.body, coverage: "front-end", parts: [], film: "pro" }).priceQar!;
                  return (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => selectMatchedCar(entry)}
                        className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-start transition-colors hover:bg-(--color-bg) active:bg-(--color-fill)"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-footnote font-semibold text-(--color-text)">
                            {entry.make[locale]} {entry.model[locale]}
                          </span>
                          <span className="mt-0.5 block text-caption text-(--color-brand-deep)">
                            {t("carSearchMatched", { category: cat.name[locale] })}
                          </span>
                        </span>
                        <span className="shrink-0 text-end">
                          <span className="block text-caption font-semibold tabular-nums text-(--color-text)">
                            {locale === "ar" ? `كامل: ${qar(fullBodyFrom)}` : `Full body: ${qar(fullBodyFrom)}`}
                          </span>
                          <span className="block text-[11px] tabular-nums text-(--color-text-muted)">
                            {locale === "ar" ? `واجهة من ${qar(frontEndFrom)}` : `Front-end: ${qar(frontEndFrom)}`}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            <button
              type="button"
              onClick={() => selectCustomFromQuery(trimmed)}
              className="flex w-full items-center justify-between gap-3 border-t border-(--color-border-soft) bg-(--color-brand)/[0.08] px-3.5 py-3 text-start transition-colors hover:bg-(--color-brand)/[0.14]"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-footnote font-semibold text-(--color-text)">
                  {t("carSearchUseCustom", { car: trimmed })}
                </span>
                <span className="mt-0.5 block text-caption text-(--color-text-muted)">
                  {t("carSearchUseCustomSub")}
                </span>
              </span>
              <ChevronIcon className="h-4 w-4 shrink-0 text-(--color-brand-deep) rtl:-scale-x-100" />
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  // ── quote selector (in the page hero) ───────────────────────────────────
  const ctaLabel = result
    ? t("launchViewBooking", { ref: result.ref })
    : startedQuote
      ? `${t("launchResume")}${quote.priceQar !== null ? ` · ${qar(quote.priceQar)}` : rangeText ? ` · ${rangeText}` : ""}`
      : t("launchStart");

  const heroPackages: Array<{
    key: Exclude<CoverageKey, "custom">;
    label: string;
    sub: string;
    badge?: string;
  }> = [
    {
      key: "full-body",
      label: locale === "ar" ? "الهيكل بالكامل (١٢ قطعة)" : "Full Body (All 12 Panels)",
      sub: locale === "ar" ? `من ${qar(3999)}` : `From ${qar(3999)}`,
      badge: locale === "ar" ? "أفضل قيمة" : "Best Value",
    },
    {
      key: "full-front",
      label: locale === "ar" ? "الواجهة الكاملة" : "Full Front",
      sub: locale === "ar" ? `من ${qar(1599)}` : `From ${qar(1599)}`,
    },
    {
      key: "front-end",
      label: locale === "ar" ? "الواجهة الأساسية (جزئي)" : "Front-End Partial",
      sub: locale === "ar" ? `من ${qar(899)}` : `From ${qar(899)}`,
    },
  ];

  const launcher = (
    <div ref={launcherRef} className="rounded-hero bg-(--color-surface) p-4 text-(--color-text) sm:p-5">
      {/* Compact Package Comparison & 1-Tap Preselector */}
      <div className="mb-3 rounded-xl border border-(--color-border-soft) bg-(--color-bg) p-2">
        <div className="flex items-center justify-between gap-2 px-1.5 pb-1.5">
          <span className="text-[11px] font-semibold tracking-wide text-(--color-text-muted) uppercase">
            {locale === "ar" ? "١. اختر الباقة للمقارنة الفورية" : "1. Compare package prices (PRO film)"}
          </span>
          <a href="#prices" className="text-[11px] font-semibold text-(--color-link) hover:underline">
            {locale === "ar" ? "جدول الأسعار الكامل ←" : "Full price table →"}
          </a>
        </div>
        <div role="radiogroup" aria-label={t("packagesTitle")} className="grid grid-cols-3 gap-1.5">
          {heroPackages.map((pkg) => {
            const active = coverage === pkg.key;
            return (
              <button
                key={pkg.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setCoverage(pkg.key)}
                className={`flex flex-col items-start justify-between rounded-lg border px-2.5 py-2 text-start transition-all ${
                  active
                    ? "border-(--color-brand) bg-(--color-brand)/18 text-(--color-ink) shadow-[inset_0_0_0_1px_var(--color-brand)]"
                    : "border-(--color-border-soft) bg-(--color-surface) text-(--color-text-muted) hover:border-(--color-text-subtle) hover:text-(--color-text)"
                }`}
              >
                <span className="flex w-full flex-wrap items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold leading-tight text-(--color-text)">
                    {pkg.label}
                  </span>
                  {pkg.badge ? (
                    <span className="rounded-pill bg-(--color-brand) px-1.5 py-0.5 text-[9px] font-bold text-(--color-ink)">
                      {pkg.badge}
                    </span>
                  ) : null}
                </span>
                <span className={`mt-1 text-caption font-bold tabular-nums ${active ? "text-(--color-ink)" : "text-(--color-brand-deep)"}`}>
                  {pkg.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="px-2 text-footnote font-semibold">
        {locale === "ar" ? "٢. اختر حجم سيارتك أو ابحث بالنوع والطراز" : `2. ${t("bodyTitle")}`}
      </p>

      <div className="mt-2 px-1">
        {renderCarSearchBox("ppf-hero-car-search")}
      </div>

      <ul className="mt-2 divide-y divide-(--color-border-soft)">
        {BODY_TYPES.map((b) => {
          const fullBodyPrice = quotePpf({ body: b.key, coverage: "full-body", parts: [], film: "pro" }).priceQar!;
          const frontEndPrice = quotePpf({ body: b.key, coverage: "front-end", parts: [], film: "pro" }).priceQar!;
          const fullFrontPrice = quotePpf({ body: b.key, coverage: "full-front", parts: [], film: "pro" }).priceQar!;
          const isSelectedTier = body === b.key && Boolean(shortCarName);
          return (
            <li key={b.key}>
              <button
                type="button"
                onClick={() => openSheet(b.key, undefined, coverage, "hero_vehicle_row")}
                className="group flex min-h-16 w-full items-center gap-3 rounded-xl px-2 py-2.5 text-start transition-colors duration-150 hover:bg-(--color-bg) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--color-brand-deep) active:bg-(--color-fill)"
              >
                <span className="flex h-10 w-14 shrink-0 items-center justify-center text-(--color-text-muted) transition-colors duration-150 group-hover:text-(--color-text) rtl:-scale-x-100">
                  <BodyIcon body={b.key} className="h-7 w-auto" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-body font-semibold leading-tight">{b.name[locale]}</span>
                    {isSelectedTier ? (
                      <span className="rounded-pill bg-(--color-brand)/20 px-2 py-0.5 text-caption font-semibold text-(--color-ink)">
                        {shortCarName}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-caption text-(--color-text-muted)">{b.examples[locale]}</span>
                </span>
                <span className="shrink-0 text-end leading-tight">
                  <span className="inline-flex items-center gap-1 rounded-md bg-(--color-brand)/18 px-2 py-0.5 text-caption font-bold tabular-nums text-(--color-ink)">
                    {locale === "ar" ? `كامل: ${qar(fullBodyPrice)}` : `Full body: ${qar(fullBodyPrice)}`}
                  </span>
                  <span className="mt-1 block text-[11px] tabular-nums text-(--color-text-muted)">
                    {coverage === "full-front"
                      ? locale === "ar"
                        ? `واجهة كاملة: ${qar(fullFrontPrice)}`
                        : `Full front: ${qar(fullFrontPrice)}`
                      : locale === "ar"
                        ? `واجهة جزئية: ${qar(frontEndPrice)}`
                        : `Front-end: ${qar(frontEndPrice)}`}
                  </span>
                </span>
                <ChevronIcon className="hidden h-3.5 w-3.5 shrink-0 text-(--color-text-subtle) transition-transform duration-150 group-hover:translate-x-0.5 sm:block rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
              </button>
            </li>
          );
        })}

        {/* 4th option: Not sure of your car type? Enter Make & Model for a Custom Offer */}
        <li>
          <button
            type="button"
            onClick={() => openSheet("custom", 0, coverage, "hero_custom_row")}
            className="group flex min-h-16 w-full items-center gap-3 rounded-xl px-2 py-2.5 text-start transition-colors duration-150 hover:bg-(--color-bg) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--color-brand-deep) active:bg-(--color-fill)"
          >
            <span className="flex h-10 w-14 shrink-0 items-center justify-center text-(--color-brand-deep) transition-colors duration-150">
              <CustomCarIcon className="h-7 w-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="text-footnote font-semibold leading-tight text-(--color-text) sm:text-body">
                  {t("customCarOptionTitle")}
                </span>
                {body === "custom" && shortCarName ? (
                  <span className="rounded-pill bg-(--color-brand)/20 px-2 py-0.5 text-caption font-semibold text-(--color-ink)">
                    {shortCarName}
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-caption text-(--color-text-muted)">
                {t("customCarOptionSub")}
              </span>
            </span>
            <span className="shrink-0 rounded-pill bg-(--color-brand)/15 px-2.5 py-1 text-caption font-semibold text-(--color-ink)">
              {t("customCarBadge")}
            </span>
            <ChevronIcon className="hidden h-3.5 w-3.5 shrink-0 text-(--color-text-subtle) transition-transform duration-150 group-hover:translate-x-0.5 sm:block rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
          </button>
        </li>
      </ul>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-3">
        <button
          type="button"
          onClick={() => openSheet(undefined, undefined, coverage, "hero_primary_cta")}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-(--color-brand) px-7 text-body font-semibold text-(--color-ink) transition-[background-color,transform] duration-150 hover:bg-(--color-brand-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-deep) active:scale-[0.98] sm:w-auto"
        >
          {ctaLabel}
          <ChevronIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
        </button>
        {/* Direct chat for people who would rather talk than fill in a form. */}
        <a
          href={buildPpfEnquiryWhatsAppUrl(locale)}
          target="_blank"
          rel="noopener noreferrer"
          data-placement="hero_whatsapp"
          className="plausible-event-name=whatsapp_click plausible-event-audience=b2c inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill border border-(--color-border) bg-(--color-surface) px-6 text-body font-semibold text-(--color-text) transition-[background-color,transform] duration-150 hover:bg-(--color-bg) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-brand-deep) active:scale-[0.98] sm:w-auto"
        >
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
          {t("heroWhatsApp")}
        </a>
        <a
          href="#prices"
          className="text-center text-footnote text-(--color-link) underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--color-brand-deep) sm:text-start"
        >
          {t("launchPrices")}
        </a>
      </div>

      {/* Short evidence line inside the launcher; the proofs themselves sit right below the hero. */}
      <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-(--color-border-soft) pt-3 text-[11px] text-(--color-text-muted)">
        <span className="inline-flex items-center gap-1 font-medium text-(--color-text)">
          <CheckIcon className="h-3.5 w-3.5 text-(--color-brand-deep)" />
          {locale === "ar" ? "الموزع المعتمد لـ VTEK في قطر" : "Authorised VTEK distributor in Qatar"}
        </span>
        <span>·</span>
        <span>{locale === "ar" ? "ضمان VTEK الإلكتروني NFC" : "VTEK NFC e-Warranty"}</span>
        <span>·</span>
        <span>
          {locale === "ar"
            ? "ضمان تركيب 12 شهراً من ABK"
            : "12-month ABK fitting guarantee"}
        </span>
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
    if (step === 0) {
      const customActive = body === "custom";
      const detectedCat = detectedFromCustomForm
        ? BODY_TYPES.find((b) => b.key === detectedFromCustomForm.body)
        : null;
      const detectedFromPrice = detectedFromCustomForm
        ? quotePpf({ body: detectedFromCustomForm.body, coverage: "full-body", parts: [], film: "pro" }).priceQar!
        : null;

      return (
        <>
          {heading(t("bodyTitle"))}

          <div className="mt-3">
            {renderCarSearchBox("ppf-sheet-car-search")}
          </div>

          <div role="radiogroup" aria-label={t("bodyTitle")} className="mt-4 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
            {BODY_TYPES.map((b) => {
              const active = body === b.key;
              const fullBodyP = quotePpf({ body: b.key, coverage: "full-body", parts: [], film: "pro" }).priceQar!;
              const frontEndP = quotePpf({ body: b.key, coverage: "front-end", parts: [], film: "pro" }).priceQar!;
              return (
                <button
                  key={b.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setBody(b.key);
                    setCustomStepError(false);
                    window.setTimeout(() => go(1), prefersReducedMotion() ? 0 : 220);
                  }}
                  className={`${optionCls(active)} py-3.5 sm:flex-col sm:items-start sm:gap-3 sm:p-5`}
                >
                  <span className="flex h-11 w-16 shrink-0 items-center justify-center text-(--color-text-muted) rtl:-scale-x-100 sm:h-14 sm:w-full sm:justify-start sm:rtl:justify-end">
                    <BodyIcon body={b.key} className="h-8 w-auto sm:h-11" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-body font-semibold leading-tight">{b.name[locale]}</span>
                      {active && shortCarName ? (
                        <span className="rounded-pill bg-(--color-brand)/20 px-2 py-0.5 text-caption font-semibold text-(--color-ink)">
                          {shortCarName}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-caption text-(--color-text-muted)">{b.examples[locale]}</span>
                    <span className="mt-1.5 block text-footnote font-bold tabular-nums text-(--color-text)">
                      {locale === "ar" ? `الهيكل بالكامل: ${qar(fullBodyP)}` : `Full body: ${qar(fullBodyP)}`}
                    </span>
                    <span className="mt-0.5 block text-caption tabular-nums text-(--color-text-muted)">
                      {locale === "ar" ? `الواجهة من ${qar(frontEndP)}` : `Front-end from ${qar(frontEndP)}`}
                    </span>
                  </span>
                  <ChevronIcon className="h-3.5 w-3.5 shrink-0 text-(--color-text-subtle) rtl:-scale-x-100 sm:hidden" />
                </button>
              );
            })}
          </div>

          {/* 4th option card: Not sure of your car type? Enter Make & Model for a Custom Offer */}
          <div className="mt-2.5 sm:mt-3">
            <button
              type="button"
              role="radio"
              aria-checked={customActive}
              onClick={() => {
                setBody("custom");
                setCustomStepError(false);
              }}
              className={`${optionCls(customActive)} py-3.5`}
            >
              <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-xl bg-(--color-brand)/15 text-(--color-brand-deep)">
                <CustomCarIcon className="h-7 w-7" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-footnote font-semibold leading-tight sm:text-body">{t("customCarOptionTitle")}</span>
                <span className="mt-0.5 block text-caption text-(--color-text-muted)">
                  {t("customCarOptionSub")}
                </span>
              </span>
              <span className="shrink-0 rounded-pill bg-(--color-brand)/15 px-3 py-1 text-caption font-semibold text-(--color-ink)">
                {t("customCarBadge")}
              </span>
            </button>

            {customActive ? (
              <div
                ref={customPanelRef}
                className="ppf-step-in mt-3 rounded-tile border border-(--color-border) bg-(--color-surface) p-4 sm:p-5"
              >
                <p className="text-footnote font-semibold text-(--color-text)">
                  {t("customCarPanelTitle")}
                </p>
                <p className="mt-1 text-caption text-(--color-text-muted)">
                  {t("customCarPanelDesc")}
                </p>

                <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
                  <Field id="ppf-step0-make" label={t("make")} required>
                    <input
                      ref={customMakeRef}
                      id="ppf-step0-make"
                      autoComplete="off"
                      placeholder={t("makePlaceholder")}
                      value={form.make}
                      onChange={(e) => {
                        set("make", e.target.value);
                        if (e.target.value.trim()) setCustomStepError(false);
                      }}
                      maxLength={60}
                      className={`${inputCls} ${customStepError && !shortCarName ? "border-(--color-danger)" : plainBorder}`}
                    />
                  </Field>
                  <Field id="ppf-step0-model" label={t("model")} required>
                    <input
                      id="ppf-step0-model"
                      autoComplete="off"
                      placeholder={t("modelPlaceholder")}
                      value={form.model}
                      onChange={(e) => {
                        set("model", e.target.value);
                        if (e.target.value.trim()) setCustomStepError(false);
                      }}
                      maxLength={60}
                      className={`${inputCls} ${customStepError && !shortCarName ? "border-(--color-danger)" : plainBorder}`}
                    />
                  </Field>
                  <div className="col-span-2 sm:col-span-1">
                    <Field id="ppf-step0-year" label={t("year")} optionalLabel={t("optional")}>
                      <div className="flex items-center gap-2">
                        <input
                          id="ppf-step0-year"
                          inputMode="numeric"
                          placeholder={t("yearPlaceholder")}
                          value={form.year}
                          onChange={(e) => set("year", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className={`${inputCls} ltr-nums w-24 shrink-0 sm:w-full ${plainBorder}`}
                        />
                        <div className="hide-scrollbar flex items-center gap-1 overflow-x-auto sm:hidden">
                          {QUICK_YEARS.map((yr) => (
                            <button
                              key={yr}
                              type="button"
                              onClick={() => set("year", yr)}
                              className={`ltr-nums h-9 shrink-0 rounded-lg border px-2.5 text-caption font-semibold transition-colors ${
                                form.year === yr
                                  ? "border-(--color-brand) bg-(--color-brand)/20 text-(--color-ink)"
                                  : "border-(--color-border-soft) bg-(--color-bg) text-(--color-text-muted)"
                              }`}
                            >
                              {yr}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Field>
                  </div>
                </div>

                {customStepError && !shortCarName ? (
                  <p role="alert" className="mt-2.5 text-caption font-medium text-(--color-danger)">
                    {t("customCarErrMakeOrModel")}
                  </p>
                ) : null}

                {/* If their typed Make + Model matches a known Qatar car, offer 1-tap instant fixed pricing */}
                {detectedFromCustomForm && detectedCat && detectedFromPrice !== null ? (
                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--color-brand)/40 bg-(--color-brand)/[0.08] px-3.5 py-2.5">
                    <p className="text-caption font-medium text-(--color-text)">
                      {t("customCarAutoDetected", {
                        car: `${detectedFromCustomForm.make[locale]} ${detectedFromCustomForm.model[locale]}`,
                        category: detectedCat.name[locale],
                        price: locale === "ar" ? `كامل ${qar(detectedFromPrice)}` : `Full body ${qar(detectedFromPrice)}`,
                      })}
                    </p>
                    <button
                      type="button"
                      onClick={() => selectMatchedCar(detectedFromCustomForm)}
                      className="rounded-pill bg-(--color-brand) px-3.5 py-1.5 text-caption font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand-hover)"
                    >
                      {t("customCarUseDetected", { category: detectedCat.name[locale] })}
                    </button>
                  </div>
                ) : null}

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2.5 border-t border-(--color-border-soft) pt-3.5">
                  <p className="text-caption text-(--color-text-muted)">
                    {t("customOfferFastBar")}
                  </p>
                  <a
                    href={fastOfferWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-placement="ppf_custom_offer_fast"
                    onClick={() =>
                      trackPpfWhatsAppHandoff({
                        body: body ?? "custom",
                        coverage,
                        film,
                        priceQar: quote.priceQar,
                        placement: "ppf_custom_offer_fast",
                      })
                    }
                    className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "sm")}`}
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                    {t("customCarWhatsAppFast")}
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </>
      );
    }

    if (step === 1 && body) {
      const total = PARTS.length;
      const panelsOpen = coverage === "custom" || showPanels;
      return (
        <>
          <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-(--color-border-soft) bg-(--color-surface) px-3.5 py-2">
            <span className="min-w-0 truncate text-caption font-semibold text-(--color-text)">
              {vehicleDisplay}
            </span>
            <button
              type="button"
              onClick={() => go(0)}
              className="text-link shrink-0 text-caption font-semibold"
            >
              {t("recapChange")}
            </button>
          </div>

          {heading(t("coverageTitle"))}
          <p className="mt-1 text-footnote text-(--color-text-muted)">{t("coverageTap")}</p>
          {/* Spoken confirmation of each tap on the diagram or the list. */}
          <p role="status" aria-live="polite" className="sr-only">
            {announce}
          </p>

          <div className="mt-3.5 grid grid-cols-[8.25rem_minmax(0,1fr)] items-start gap-x-2.5 gap-y-3.5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-x-6">
            {/* The diagram is the centrepiece: always tappable, beside the packages on phones too. */}
            <div className="rounded-tile border border-(--color-border-soft) bg-(--color-surface) p-1.5 shadow-tile sm:row-span-3 sm:p-2">
              <p className="text-center text-[11px] text-(--color-text-muted)">{t("front")}</p>
              <div className="my-0.5">
                <CarDiagram
                  selected={selectedParts}
                  frontEdge={coverage === "front-end"}
                  onTogglePart={togglePart}
                  label={t("diagramLabel")}
                  className="h-60 sm:h-[340px]"
                />
              </div>
              <p className="text-center text-[11px] text-(--color-text-muted)">{t("rear")}</p>
            </div>

            <div role="radiogroup" aria-label={t("packagesTitle")} className="grid gap-2">
              {COVERAGES.map((c) => {
                const active = coverage === c.key;
                const isBestValue = c.key === "full-body";
                const isPopular = c.key === "full-front";
                const p =
                  c.key === "custom"
                    ? null
                    : body === "custom"
                      ? null
                      : quotePpf({ body, coverage: c.key, parts: [], film: "pro" }).priceQar;
                const r =
                  c.key !== "custom" && body === "custom"
                    ? quotePpfRange({ coverage: c.key, parts: [], film: "pro" })
                    : null;
                return (
                  <button
                    key={c.key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => chooseCoverage(c.key)}
                    className={`${optionCls(active)} min-h-14 gap-2 px-3 py-2.5`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center justify-between gap-1">
                        <span className="text-footnote font-semibold leading-tight">{c.name[locale]}</span>
                        {isBestValue ? (
                          <span className="rounded-pill bg-(--color-brand) px-2 py-0.5 text-[10px] font-bold text-(--color-ink)">
                            {locale === "ar" ? "أفضل قيمة · ١٢ قطعة" : "Best value · 12 panels"}
                          </span>
                        ) : isPopular ? (
                          <span className="rounded-pill bg-(--color-brand)/20 px-2 py-0.5 text-[10px] font-bold text-(--color-ink)">
                            {t("popularBadge")}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 flex flex-wrap items-center justify-between gap-1 text-caption tabular-nums text-(--color-text-muted)">
                        <span className="font-semibold text-(--color-text)">
                          {p !== null
                            ? qar(p)
                            : r !== null
                              ? t("priceRange", { min: qar(r.minQar), max: qar(r.maxQar) })
                              : t("packageCustomSub")}
                        </span>
                        <span className="text-[11px] text-(--color-text-subtle)">
                          {t(DURATION[c.key] as "durationFrontEnd")}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <p key={coverage} className="ppf-step-in col-span-2 rounded-xl bg-(--color-surface) px-3.5 py-2.5 text-caption text-(--color-text-muted) sm:col-span-1 sm:col-start-2">
              {coverageInfo.desc[locale]}
              {coverage === "front-end" ? ` ${t("frontEndNote")}` : ""}{" "}
              <span className="font-medium text-(--color-text)">
                {t("summaryDuration", { duration: t(DURATION[coverageInfo.key] as "durationFrontEnd") })}
              </span>
            </p>

            <div role="group" aria-labelledby="ppf-parts-label" className="col-span-2 sm:col-span-1 sm:col-start-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  id="ppf-parts-label"
                  onClick={() => setShowPanels((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-footnote font-semibold text-(--color-link)"
                >
                  <span>
                    {panelsOpen
                      ? t("hidePanelsBtn")
                      : t("customizePanelsBtn", {
                          count: formatNumber(selectedParts.size, locale),
                          total: formatNumber(total, locale),
                        })}
                  </span>
                  <ChevronIcon className={`h-3.5 w-3.5 transition-transform ${panelsOpen ? "-rotate-90" : "rotate-90"}`} />
                </button>
                {panelsOpen ? (
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="secondary" onClick={() => setAllParts(true)} disabled={selectedParts.size === total}>
                      {t("partsSelectAll")}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setAllParts(false)} disabled={selectedParts.size === 0}>
                      {t("partsClear")}
                    </Button>
                  </div>
                ) : null}
              </div>

              {panelsOpen ? (
                <div className="ppf-step-in mt-2.5 flex flex-wrap gap-1.5 sm:gap-2">
                  {PARTS.map((p) => {
                    const on = selectedParts.has(p.key);
                    return (
                      <button
                        key={p.key}
                        type="button"
                        aria-pressed={on}
                        onClick={() => togglePart(p.key)}
                        className={`inline-flex h-10 items-center gap-1.5 rounded-pill border px-3 text-caption font-medium transition-[background-color,border-color,color,transform] duration-150 ease-soft active:scale-95 sm:h-11 sm:px-3.5 sm:text-footnote ${
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
              ) : null}
            </div>
          </div>

          {body === "custom" ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--color-border-soft) bg-(--color-surface) px-4 py-3">
              <p className="text-caption text-(--color-text-muted)">
                {t("customOfferFastBar")}
              </p>
              <a
                href={fastOfferWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                data-placement="ppf_custom_offer_step1"
                onClick={() =>
                  trackPpfWhatsAppHandoff({
                    body,
                    coverage,
                    film,
                    priceQar: quote.priceQar,
                    placement: "ppf_custom_offer_step1",
                  })
                }
                className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "sm")}`}
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                {t("customOfferFastCta")}
              </a>
            </div>
          ) : null}
        </>
      );
    }

    if (step === 2 && body)
      return (
        <>
          <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-(--color-border-soft) bg-(--color-surface) px-3.5 py-2">
            <span className="min-w-0 truncate text-caption font-semibold text-(--color-text)">
              {vehicleDisplay} · {coverageInfo.name[locale]}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="text-link shrink-0 text-caption font-semibold"
            >
              {t("recapChange")}
            </button>
          </div>

          {heading(t("filmTitle"))}
          <div role="radiogroup" aria-label={t("filmTitle")} className="mt-4 grid gap-3 sm:grid-cols-2">
            {FILMS.map((f) => {
              const active = film === f.key;
              const p = quotePpf({ body, coverage, parts: [...parts], film: f.key }).priceQar;
              const baseP = quotePpf({ body, coverage, parts: [...parts], film: "pro" }).priceQar;
              const fRange =
                body === "custom"
                  ? quotePpfRange({ coverage, parts: [...parts], film: f.key })
                  : null;
              return (
                <div
                  key={f.key}
                  className={`flex flex-col justify-between rounded-xl border bg-(--color-surface) p-3.5 transition-[border-color,background-color,box-shadow] duration-150 sm:p-4 ${
                    active
                      ? "border-(--color-brand) bg-(--color-brand)/[0.07] shadow-[inset_0_0_0_1px_var(--color-brand)]"
                      : "border-(--color-border) hover:border-(--color-text-subtle)"
                  }`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setFilm(f.key)}
                    className="flex w-full items-start gap-3.5 text-start"
                  >
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-(--color-border-soft) bg-(--color-surface) sm:h-20 sm:w-20">
                      <Image src={FILM_IMAGE[f.key]} alt="" width={160} height={160} sizes="80px" className="h-full w-full scale-125 object-contain" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-1">
                        <span className="text-footnote font-semibold sm:text-body">{f.name[locale]}</span>
                        <span className="text-footnote font-bold tabular-nums text-(--color-brand-deep)">
                          {f.uplift === null
                            ? t("filmQuote")
                            : p !== null
                              ? qar(p)
                              : fRange !== null
                                ? t("priceRange", { min: qar(fRange.minQar), max: qar(fRange.maxQar) })
                                : ""}
                        </span>
                      </span>
                      {p !== null && baseP !== null && f.uplift !== null ? (
                        <span className="mt-0.5 block text-caption font-medium text-(--color-text-muted)">
                          {f.uplift === 0 ? t("filmIncluded") : t("filmExtra", { amount: qar(p - baseP) })}
                        </span>
                      ) : null}
                      <span className="mt-1 block text-caption text-(--color-text-muted)">{f.desc[locale]}</span>
                    </span>
                  </button>

                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-(--color-border-soft) pt-2.5 text-caption">
                    <span className="font-medium text-(--color-text-muted)">
                      {t("filmWarranty", { years: f.warrantyYears, yearsText: formatNumber(f.warrantyYears, locale) })}
                    </span>
                    <Link
                      href={`/b2c/products/${f.productSlug}`}
                      target="_blank"
                      className="text-link shrink-0 font-medium"
                    >
                      {t("filmDetails")} ›
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {body === "custom" ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-(--color-border-soft) bg-(--color-surface) px-4 py-3">
              <p className="text-caption text-(--color-text-muted)">
                {t("customOfferFastBar")}
              </p>
              <a
                href={fastOfferWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                data-placement="ppf_custom_offer_step2"
                onClick={() =>
                  trackPpfWhatsAppHandoff({
                    body,
                    coverage,
                    film,
                    priceQar: quote.priceQar,
                    placement: "ppf_custom_offer_step2",
                  })
                }
                className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "sm")}`}
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                {t("customOfferFastCta")}
              </a>
            </div>
          ) : null}
        </>
      );

    if (step === 3) {
      const hasOptionalValues = Boolean(
        form.preferredDate ||
          form.email.trim() ||
          form.notes.trim() ||
          form.existingFilm !== "existingNone" ||
          shownError("email") ||
          shownError("preferredDate"),
      );
      const optionalOpen = showOptionalDetails || hasOptionalValues;

      return (
        <form id="ppf-form" noValidate onSubmit={onSubmit}>
          {heading(t("detailsTitle"))}
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-(--color-border-soft) bg-(--color-surface) py-1.5 ps-3.5 pe-2">
            <p className="min-w-0 text-footnote font-medium text-(--color-text)">{recap}</p>
            <button
              type="button"
              onClick={() => go(0)}
              className="text-link min-h-10 shrink-0 px-2 text-footnote font-semibold"
            >
              {t("recapChange")}
            </button>
          </div>

          {/* 1-tap WhatsApp quote handoff available for all customers */}
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-(--color-brand)/35 bg-(--color-brand)/[0.07] px-3.5 py-2.5">
            <p className="text-caption font-medium text-(--color-text)">
              {body === "custom" ? t("customOfferFastBar") : t("directWhatsAppBar")}
            </p>
            <a
              href={fastOfferWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="ppf_custom_offer_step3"
              onClick={() =>
                trackPpfWhatsAppHandoff({
                  body: body ?? "unselected",
                  coverage,
                  film,
                  priceQar: quote.priceQar,
                  placement: "ppf_custom_offer_step3",
                })
              }
              className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c ${buttonClasses("secondary", "sm")}`}
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              {body === "custom" ? t("customOfferFastCta") : t("directWhatsAppCta")}
            </a>
          </div>

          {/* Decision-point credentials, warranty & booking terms summary */}
          <div className="mt-3 rounded-xl border border-(--color-border-soft) bg-(--color-surface) p-3.5 text-caption text-(--color-text-muted)">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--color-brand-deep)" />
                <span>
                  <strong className="font-semibold text-(--color-text)">
                    {locale === "ar" ? "الضمان والاعتماد: " : "Dual written warranty: "}
                  </strong>
                  {locale === "ar"
                    ? `ضمان VTEK الإلكتروني لمدة ${formatNumber(filmInfo.warrantyYears, "ar")} ${filmInfo.warrantyYears >= 3 && filmInfo.warrantyYears <= 10 ? "سنوات" : "سنة"} + ضمان تركيب ١٢ شهراً من ABK.`
                    : `${filmInfo.warrantyYears}-year VTEK NFC e-Warranty + 12-month ABK fitting guarantee.`}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--color-brand-deep)" />
                <span>
                  <strong className="font-semibold text-(--color-text)">
                    {locale === "ar" ? "شروط الحجز والدفع: " : "Booking & cancellation: "}
                  </strong>
                  {locale === "ar"
                    ? "تأكيد الموعد عبر واتساب خلال ساعات العمل · الدفع بعد تأكيد الموعد · إلغاء مجاني حتى ٤٨ ساعة قبل الموعد."
                    : "Slot confirmed on WhatsApp during business hours · Pay after slot confirmation · Free cancellation up to 48h prior."}
                </span>
              </div>
            </div>
          </div>

          {submitted && FORM_FIELDS.some((k) => errorFor(k)) ? (
            <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-(--color-danger)/8 px-4 py-3 text-footnote font-medium text-(--color-danger)">
              <AlertIcon className="h-4 w-4 shrink-0" />
              {t("errForm")}
            </p>
          ) : null}

          <div role="group" aria-labelledby="ppf-group-car" className="mt-5 grid grid-cols-2 gap-x-3 gap-y-3.5 sm:gap-x-4">
            <p id="ppf-group-car" className="col-span-2 text-footnote font-semibold">
              {t("groupCar")}
            </p>
            <Field id="ppf-make" label={t("make")} required error={shownError("make")}>
              <input id="ppf-make" autoComplete="off" placeholder={t("makePlaceholder")} value={form.make} onChange={(e) => set("make", e.target.value)} onBlur={blur("make")} maxLength={60} className={`${inputCls} ${borderFor("make")}`} {...aria("make")} />
            </Field>
            <Field id="ppf-model" label={t("model")} required error={shownError("model")}>
              <input id="ppf-model" autoComplete="off" placeholder={t("modelPlaceholder")} value={form.model} onChange={(e) => set("model", e.target.value)} onBlur={blur("model")} maxLength={60} className={`${inputCls} ${borderFor("model")}`} {...aria("model")} />
            </Field>
            <div className="col-span-2">
              <Field id="ppf-year" label={t("year")} optionalLabel={t("optional")} error={shownError("year")}>
                <div className="flex items-center gap-2">
                  <input id="ppf-year" inputMode="numeric" placeholder={t("yearPlaceholder")} value={form.year} onChange={(e) => set("year", e.target.value.replace(/\D/g, "").slice(0, 4))} onBlur={blur("year")} className={`${inputCls} ltr-nums w-28 shrink-0 sm:w-40 ${borderFor("year")}`} {...aria("year")} />
                  <div className="hide-scrollbar flex items-center gap-1.5 overflow-x-auto">
                    {QUICK_YEARS.map((yr) => (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => set("year", yr)}
                        className={`ltr-nums h-10 shrink-0 rounded-xl border px-3 text-caption font-semibold transition-colors ${
                          form.year === yr
                            ? "border-(--color-brand) bg-(--color-brand)/20 text-(--color-ink)"
                            : "border-(--color-border-soft) bg-(--color-surface) text-(--color-text-muted) hover:border-(--color-text-subtle)"
                        }`}
                      >
                        {yr}
                      </button>
                    ))}
                  </div>
                </div>
              </Field>
            </div>
          </div>

          <div role="group" aria-labelledby="ppf-group-details" className="mt-5 grid gap-3.5 sm:grid-cols-2 sm:gap-x-4">
            <p id="ppf-group-details" className="text-footnote font-semibold sm:col-span-2">
              {t("groupDetails")}
            </p>
            <Field id="ppf-name" label={t("name")} required error={shownError("name")}>
              <input id="ppf-name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} onBlur={blur("name")} maxLength={80} className={`${inputCls} ${borderFor("name")}`} {...aria("name")} />
            </Field>
            <Field id="ppf-mobile" label={t("mobile")} required hint={t("mobileHint")} error={shownError("mobile")}>
              <input id="ppf-mobile" type="tel" autoComplete="tel" inputMode="tel" placeholder="5555 1234" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} onBlur={blur("mobile")} maxLength={20} className={`${inputCls} ltr-nums ${borderFor("mobile")}`} {...aria("mobile", true)} />
            </Field>

            {/* Progressive disclosure for optional details so mobile users see a clean 1-screen form */}
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setShowOptionalDetails((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-(--color-border-soft) bg-(--color-surface) px-3.5 py-2.5 text-start text-caption font-semibold text-(--color-link) transition-colors hover:bg-(--color-fill)/40"
              >
                <span>{t("optionalDetailsToggle")}</span>
                <ChevronIcon className={`h-3.5 w-3.5 shrink-0 transition-transform ${optionalOpen ? "-rotate-90" : "rotate-90"}`} />
              </button>

              {optionalOpen ? (
                <div className="ppf-step-in mt-3 grid gap-3.5 rounded-tile border border-(--color-border-soft) bg-(--color-surface) p-3.5 sm:grid-cols-2 sm:gap-x-4 sm:p-4">
                  <Field id="ppf-preferredDate" label={t("preferredDate")} optionalLabel={t("optional")} hint={t("preferredDateHint")}>
                    <input id="ppf-preferredDate" type="date" min={todayPlus(2)} value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} className={`${inputCls} ${plainBorder}`} aria-describedby="ppf-preferredDate-hint" />
                  </Field>
                  <Field id="ppf-existing" label={t("existingFilm")}>
                    <select id="ppf-existing" value={form.existingFilm} onChange={(e) => set("existingFilm", e.target.value)} className={`${inputCls} ${plainBorder}`}>
                      {EXISTING.map((k) => (
                        <option key={k} value={k}>
                          {t(k)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="ppf-email" label={t("email")} optionalLabel={t("optional")} error={shownError("email")}>
                      <input id="ppf-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} onBlur={blur("email")} maxLength={120} className={`${inputCls} ltr-nums ${borderFor("email")}`} {...aria("email")} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field id="ppf-notes" label={t("notes")} optionalLabel={t("optional")}>
                      <textarea id="ppf-notes" rows={2} maxLength={500} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t("notesPlaceholder")} className={`${inputCls} h-auto py-2.5 ${plainBorder}`} />
                    </Field>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Honeypot — hidden from people and assistive tech, irresistible to bots. */}
            <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="ppf-website">Website</label>
              <input id="ppf-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-(--color-border-soft) bg-(--color-surface) p-3.5 text-footnote text-(--color-text) sm:p-4">
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
    }
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
            <path d="M40 24 V44 M40 54 V56" fill="none" stroke="var(--color-text)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="ppf-draw" style={{ ["--len" as string]: 34, animationDelay: "350ms" }} />
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
          {quote.priceQar !== null ? ` · ${qar(quote.priceQar)}` : rangeText ? ` · ${rangeText}` : ""}
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
            <div ref={scrollRef} className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-8 sm:py-7">
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
                onClick={() =>
                  trackPpfWhatsAppHandoff({
                    body: body ?? "unselected",
                    coverage,
                    film,
                    priceQar: quote.priceQar,
                    placement: "ppf_booking_confirmed",
                    ref: result.ref,
                  })
                }
                className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c w-full ${buttonClasses("primary", "lg")}`}
              >
                <WhatsAppIcon className="h-5 w-5" />
                {t("sendWhatsApp")}
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-t border-(--color-border-soft) bg-(--color-surface) px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 sm:px-8 sm:pt-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-caption text-(--color-text-muted)">{priceLabel}</p>
                <p className="text-body font-bold leading-tight tabular-nums sm:text-title-sm" aria-live="polite">
                  {priceText}
                </p>
                {body ? <p className="truncate text-[11px] text-(--color-text-muted) sm:text-caption">{recap}</p> : null}
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
              {step === 0 && !body ? null : step < 3 ? (
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

  // Phone-only sticky bottom bar when the hero launcher has scrolled out of view.
  const stickyMobileBar =
    showStickyBar && !open ? (
      <div className="cart-sticky fixed inset-x-0 bottom-0 z-30 border-t border-(--color-border-soft) bg-(--color-surface)/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2.5 text-(--color-text) backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption font-semibold text-(--color-text)">
              {body ? vehicleDisplay : t("stickyTitle")}
            </p>
            <p className="truncate text-footnote font-bold tabular-nums text-(--color-brand-deep)">
              {priceText}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openSheet("custom", 0)}
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-pill border border-(--color-border) bg-(--color-bg) px-3.5 text-caption font-semibold text-(--color-text) transition-colors active:bg-(--color-fill)"
          >
            {t("stickyCtaCustom")}
          </button>
          <button
            type="button"
            onClick={() => openSheet()}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1 rounded-pill bg-(--color-brand) px-4 text-caption font-semibold text-(--color-ink) transition-colors hover:bg-(--color-brand-hover) active:scale-95"
          >
            {startedQuote ? t("launchResume") : t("stickyCtaQuote")}
            <ChevronIcon className="h-3 w-3 rtl:-scale-x-100" />
          </button>
        </div>
      </div>
    ) : null;

  return (
    <div className="scroll-mt-24">
      {launcher}
      {sheet}
      {stickyMobileBar}
    </div>
  );
}

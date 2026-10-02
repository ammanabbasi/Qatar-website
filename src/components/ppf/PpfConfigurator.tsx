"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button, buttonClasses } from "@/components/ui/Button";
import { AlertIcon, CheckIcon, ChevronIcon, ShieldCheckIcon } from "@/components/ui/Icons";
import { WhatsAppIcon } from "@/components/cta/WhatsAppIcon";
import { CarDiagram } from "./CarDiagram";
import {
  BODY_TYPES,
  COVERAGES,
  FILMS,
  PARTS,
  PART_KEYS,
  PRESET_PARTS,
  fromPrice,
  makeBookingRef,
  quotePpf,
  type BodyType,
  type CoverageKey,
  type FilmKey,
  type PartKey,
} from "@/data/ppfInstall";
import { formatQar } from "@/lib/pricing";
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

function BodyIcon({ body }: { body: BodyType }) {
  const d = {
    sedan: "M6 30 L14 30 Q16 24 22 24 Q28 24 30 30 L66 30 Q68 24 74 24 Q80 24 82 30 L92 30 L92 24 Q90 19 78 17 L62 9 Q56 6 44 6 L34 7 Q26 9 20 16 L10 18 Q6 20 6 24 Z",
    suv: "M6 30 L14 30 Q16 23 22 23 Q28 23 30 30 L66 30 Q68 23 74 23 Q80 23 82 30 L92 30 L92 20 Q91 15 84 14 L72 5 Q68 3 58 3 L28 3 Q22 3 18 8 L10 15 Q6 17 6 21 Z",
    "large-suv": "M4 30 L13 30 Q15 22 22 22 Q29 22 31 30 L65 30 Q67 22 74 22 Q81 22 83 30 L94 30 L94 16 Q93 12 88 11 L80 2 L26 2 Q20 2 17 6 L8 13 Q4 15 4 19 Z",
  }[body];
  return (
    <svg viewBox="0 0 98 34" aria-hidden className="h-10 w-auto">
      <path d={d} fill="currentColor" />
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

const inputCls =
  "h-11 w-full rounded-xl border bg-(--color-surface) px-3.5 text-body text-(--color-text) transition-colors duration-150 placeholder:text-(--color-text-subtle) hover:border-(--color-text-subtle) focus-visible:border-(--color-brand-deep) focus-visible:outline-2 focus-visible:outline-offset-0 disabled:opacity-50";

export function PpfConfigurator() {
  const t = useTranslations("PpfInstall");
  const locale = useLocale() as L;
  const qar = (n: number) => formatQar(n, locale);

  const [step, setStep] = useState<Step>(0);
  const [body, setBody] = useState<BodyType | null>(null);
  const [coverage, setCoverage] = useState<CoverageKey | null>(null);
  const [parts, setParts] = useState<Set<PartKey>>(new Set());
  const [film, setFilm] = useState<FilmKey>("pro");
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
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lastViewKey = useRef("0|");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // While the mobile price bar is showing, lift the floating bubble above it.
  const barShown = step < 3 && result === null;
  useEffect(() => {
    if (!barShown) return;
    const html = document.documentElement;
    html.dataset.stickyCta = "on";
    return () => {
      delete html.dataset.stickyCta;
    };
  }, [barShown]);

  // Move focus (and the viewport, if needed) to the new step's heading — only
  // when the step or result actually changes, never on mount (StrictMode
  // replays mount effects, so a "first run" flag isn't enough).
  const viewKey = `${step}|${result?.ref ?? ""}`;
  useEffect(() => {
    if (lastViewKey.current === viewKey) return;
    lastViewKey.current = viewKey;
    headingRef.current?.focus({ preventScroll: true });
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.4) {
      rootRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
  }, [viewKey]);

  const selectedParts: Set<PartKey> = useMemo(() => {
    if (coverage === "custom") return parts;
    if (coverage) return new Set(PRESET_PARTS[coverage]);
    return new Set();
  }, [coverage, parts]);

  const quote = useMemo(
    () =>
      body && coverage
        ? quotePpf({ body, coverage, parts: [...parts], film })
        : { priceQar: null, isEstimate: false },
    [body, coverage, parts, film],
  );
  const animatedPrice = useAnimatedNumber(quote.priceQar);

  const bodyInfo = BODY_TYPES.find((b) => b.key === body);
  const coverageInfo = COVERAGES.find((c) => c.key === coverage);
  const filmInfo = FILMS.find((f) => f.key === film)!;
  const partNames = coverage === "custom" ? PARTS.filter((p) => parts.has(p.key)).map((p) => p.name[locale]) : [];

  const canAdvance =
    (step === 0 && body !== null) ||
    (step === 1 && coverage !== null && (coverage !== "custom" || parts.size > 0)) ||
    step === 2;

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
    shownError(k) ? "border-(--color-danger)" : "border-(--color-border)";

  function togglePart(p: PartKey) {
    setParts((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const fields: FieldKey[] = ["make", "model", "year", "name", "mobile", "email", "consent"];
    const firstBad = fields.find((k) => errorFor(k));
    if (firstBad) {
      document.getElementById(`ppf-${firstBad}`)?.focus();
      return;
    }
    if (!body || !coverage) return;
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
    setStep(0);
    startedAt.current = Date.now();
  }

  // ── price block, shared by the summary card and the mobile bar ──
  const priceLabel = !coverage
    ? ""
    : quote.priceQar === null
      ? coverage === "custom" && parts.size === 0
        ? t("summaryChooseParts")
        : t("summaryQuote")
      : quote.isEstimate
        ? t("summaryEstimate")
        : t("summaryFixed");

  const whatsappHref = result
    ? buildPpfBookingWhatsAppUrl({
        locale,
        ref: result.ref,
        vehicle: `${form.year} ${form.make} ${form.model}`.trim(),
        bodyType: bodyInfo?.name[locale] ?? "",
        coverage: coverageInfo?.name[locale] ?? "",
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

  // ── result screen ──
  if (result) {
    return (
      <div ref={rootRef} className="scroll-mt-24">
        <div className="ppf-step-in tile mx-auto max-w-2xl p-6 sm:p-10">
          <span
            aria-hidden
            className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
              result.saved ? "bg-(--color-brand)/15 text-(--color-brand-deep)" : "bg-(--color-fill) text-(--color-text)"
            }`}
          >
            {result.saved ? <CheckIcon className="h-6 w-6" /> : <AlertIcon className="h-6 w-6" />}
          </span>
          <h3 ref={headingRef} tabIndex={-1} className="mt-5 text-title font-semibold outline-none">
            {result.saved ? t("successTitle") : t("failTitle")}
          </h3>
          <p className="mt-2 text-body text-(--color-text-muted)" role="status">
            {result.saved ? t("successBody") : t("failBody")}
          </p>
          <div className="mt-6 rounded-tile bg-(--color-bg) p-5">
            <p className="text-caption font-semibold uppercase tracking-[0.12em] text-(--color-text-muted)">
              {t("refLabel")}
            </p>
            <p className="ltr-nums mt-1 font-mono text-title font-bold tracking-wider">{result.ref}</p>
            <p className="mt-3 text-footnote text-(--color-text-muted)">
              {bodyInfo?.name[locale]} · {coverageInfo?.name[locale]} · {filmInfo.name[locale]}
              {quote.priceQar !== null ? ` · ${qar(quote.priceQar)}` : ""}
            </p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-order-ref={result.ref}
            data-placement="ppf_booking"
            className={`plausible-event-name=whatsapp_click plausible-event-audience=b2c mt-6 w-full ${buttonClasses("primary", "lg")}`}
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t("sendWhatsApp")}
          </a>
          <h4 className="mt-8 text-body font-semibold">{t("nextTitle")}</h4>
          <ol className="mt-3 flex flex-col gap-3">
            {(["next1", "next2", "next3"] as const).map((k, i) => (
              <li key={k} className="flex gap-3 text-footnote text-(--color-text-muted)">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-(--color-fill) text-caption font-semibold text-(--color-text)">
                  {i + 1}
                </span>
                <span className="pt-0.5">{t(k)}</span>
              </li>
            ))}
          </ol>
          <Button variant="secondary" size="sm" className="mt-8" onClick={startOver}>
            {t("startOver")}
          </Button>
        </div>
      </div>
    );
  }

  const summary = (
    <div className="flex flex-col gap-4">
      <h3 className="text-body font-semibold">{t("summaryTitle")}</h3>
      <dl className="flex flex-col gap-2 text-footnote">
        {[
          [t("summaryCar"), bodyInfo?.name[locale]],
          [t("summaryCoverage"), coverageInfo ? coverageInfo.name[locale] + (partNames.length ? ` (${partNames.length})` : "") : undefined],
          [t("summaryFilm"), body ? filmInfo.name[locale] : undefined],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-(--color-text-muted)">{k}</dt>
            <dd className="text-end font-medium">{v ?? "—"}</dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-(--color-border-soft) pt-4">
        <p className="text-caption text-(--color-text-muted)">{priceLabel}</p>
        <p className="mt-1 text-title font-bold tracking-tight" aria-live="polite">
          {animatedPrice !== null && quote.priceQar !== null ? qar(animatedPrice) : "—"}
        </p>
      </div>
      {coverage ? (
        <ul className="flex flex-col gap-1.5 text-caption text-(--color-text-muted)">
          <li>{t("summaryDuration", { duration: t(DURATION[coverage] as "durationFrontEnd") })}</li>
          <li className="flex items-start gap-1.5">
            <ShieldCheckIcon className="mt-px h-3.5 w-3.5 shrink-0 text-(--color-brand-deep)" />
            {t("filmWarranty", { years: filmInfo.warrantyYears })}
          </li>
          <li className="flex items-start gap-1.5">
            <ShieldCheckIcon className="mt-px h-3.5 w-3.5 shrink-0 text-(--color-brand-deep)" />
            {t("summaryWorkmanship")}
          </li>
          <li>{t("summaryPayment")}</li>
        </ul>
      ) : null}
    </div>
  );

  const nav = (
    <div className="flex items-center justify-between gap-3">
      {step > 0 ? (
        <Button variant="secondary" onClick={() => setStep((s) => (s - 1) as Step)}>
          <ChevronIcon className="h-3.5 w-3.5 rotate-180 rtl:rotate-0" />
          {t("back")}
        </Button>
      ) : (
        <span />
      )}
      {step < 3 ? (
        <Button onClick={() => setStep((s) => (s + 1) as Step)} disabled={!canAdvance}>
          {t("next")}
          <ChevronIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
        </Button>
      ) : null}
    </div>
  );

  const card = (active: boolean) =>
    `relative flex w-full flex-col items-start gap-2 rounded-tile border-2 bg-(--color-surface) p-4 text-start transition-[border-color,box-shadow,transform] duration-150 ease-soft hover:shadow-tile-hover active:scale-[0.99] ${
      active ? "border-(--color-brand) shadow-tile-hover" : "border-transparent shadow-tile"
    }`;
  const tick = (active: boolean) => (
    <span
      aria-hidden
      className={`absolute end-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-150 ${
        active ? "bg-(--color-brand) text-(--color-ink)" : "bg-(--color-fill) text-transparent"
      }`}
    >
      <CheckIcon className="h-3.5 w-3.5" />
    </span>
  );

  return (
    <div ref={rootRef} className="scroll-mt-24">
      {/* Stepper */}
      <ol className="mb-6 grid grid-cols-4 gap-2" aria-label={t("stepOf", { current: step + 1, total: 4 })}>
        {STEP_KEYS.map((k, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={k}>
              <button
                type="button"
                disabled={!done}
                onClick={() => setStep(i as Step)}
                aria-current={current ? "step" : undefined}
                className="group flex w-full flex-col gap-2 rounded-lg text-start disabled:cursor-default"
              >
                <span
                  className={`h-1 w-full rounded-pill transition-colors duration-300 ${
                    done || current ? "bg-(--color-brand)" : "bg-(--color-fill)"
                  }`}
                />
                <span
                  className={`text-caption font-semibold ${
                    current ? "text-(--color-text)" : done ? "text-(--color-link) group-hover:underline" : "text-(--color-text-subtle)"
                  }`}
                >
                  <span className="hidden sm:inline">{i + 1}. </span>
                  {t(k)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div key={step} className="ppf-step-in min-w-0">
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-(--color-text-muted)">
            {t("stepOf", { current: step + 1, total: 4 })}
          </p>

          {step === 0 ? (
            <>
              <h3 ref={headingRef} tabIndex={-1} className="mt-1 text-title-sm font-semibold outline-none">
                {t("bodyTitle")}
              </h3>
              <div role="radiogroup" aria-label={t("bodyTitle")} className="mt-5 grid gap-3 sm:grid-cols-3">
                {BODY_TYPES.map((b) => {
                  const active = body === b.key;
                  return (
                    <button
                      key={b.key}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setBody(b.key)}
                      className={card(active)}
                    >
                      {tick(active)}
                      <span className={`transition-colors duration-300 ${active ? "text-(--color-brand-deep)" : "text-(--color-text-subtle)"} rtl:-scale-x-100`}>
                        <BodyIcon body={b.key} />
                      </span>
                      <span className="text-body font-semibold">{b.name[locale]}</span>
                      <span className="text-caption text-(--color-text-muted)">
                        {t("bodyExamples", { examples: b.examples[locale] })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {step === 1 && body ? (
            <>
              <h3 ref={headingRef} tabIndex={-1} className="mt-1 text-title-sm font-semibold outline-none">
                {t("coverageTitle")}
              </h3>
              <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_200px]">
                <div role="radiogroup" aria-label={t("coverageTitle")} className="flex flex-col gap-3">
                  {COVERAGES.map((c) => {
                    const active = coverage === c.key;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setCoverage(c.key)}
                        className={card(active)}
                      >
                        {tick(active)}
                        <span className="pe-8 text-body font-semibold">{c.name[locale]}</span>
                        <span className="pe-8 text-footnote text-(--color-text-muted)">{c.desc[locale]}</span>
                        {c.key !== "custom" ? (
                          <span className="text-footnote font-semibold text-(--color-brand-deep)">
                            {qar(quotePpf({ body, coverage: c.key, parts: [], film: "pro" }).priceQar ?? fromPrice(c.key))}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-col items-center gap-3 md:sticky md:top-24 md:self-start">
                  <CarDiagram
                    selected={selectedParts}
                    frontEdge={coverage === "front-end"}
                    onToggle={coverage === "custom" ? togglePart : undefined}
                    label={t("diagramLabel")}
                    frontLabel={t("front")}
                    rearLabel={t("rear")}
                  />
                  {coverage === "front-end" ? (
                    <p className="text-center text-caption text-(--color-text-muted)">{t("frontEndNote")}</p>
                  ) : null}
                </div>
              </div>

              {coverage === "custom" ? (
                <fieldset className="ppf-step-in mt-6 rounded-tile bg-(--color-surface) p-5 shadow-tile">
                  <legend className="sr-only">{t("partsTitle")}</legend>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-body font-semibold">{t("partsTitle")}</p>
                      <p className="text-caption text-(--color-text-muted)">{t("partsHint")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setParts(new Set(PART_KEYS))}>
                        {t("partsSelectAll")}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => setParts(new Set())} disabled={parts.size === 0}>
                        {t("partsClear")}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {PARTS.map((p) => {
                      const on = parts.has(p.key);
                      return (
                        <label
                          key={p.key}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-footnote transition-colors duration-150 hover:border-(--color-text-subtle) has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-(--color-brand-deep) ${
                            on ? "border-(--color-brand) bg-(--color-brand)/8" : "border-(--color-border-soft)"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={() => togglePart(p.key)}
                            className="h-4 w-4 accent-(--color-brand-deep)"
                          />
                          {p.name[locale]}
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-caption font-medium text-(--color-text-muted)" aria-live="polite">
                    {t("partsSelected", { count: parts.size })}
                  </p>
                </fieldset>
              ) : null}
            </>
          ) : null}

          {step === 2 && body && coverage ? (
            <>
              <h3 ref={headingRef} tabIndex={-1} className="mt-1 text-title-sm font-semibold outline-none">
                {t("filmTitle")}
              </h3>
              <div role="radiogroup" aria-label={t("filmTitle")} className="mt-5 grid gap-3 sm:grid-cols-2">
                {FILMS.map((f) => {
                  const active = film === f.key;
                  const p = quotePpf({ body, coverage, parts: [...parts], film: f.key }).priceQar;
                  return (
                    <div key={f.key} className="relative">
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setFilm(f.key)}
                        className={`${card(active)} h-full pb-10`}
                      >
                        {tick(active)}
                        <span className="pe-8 text-body font-semibold">{f.name[locale]}</span>
                        <span className="text-caption font-semibold text-(--color-brand-deep)">
                          {f.uplift === 0
                            ? t("filmIncluded")
                            : f.uplift === null
                              ? t("filmQuote")
                              : `${t("filmUplift", { pct: Math.round(f.uplift * 100) })}${p !== null ? ` · ${qar(p)}` : ""}`}
                        </span>
                        <span className="text-footnote text-(--color-text-muted)">{f.desc[locale]}</span>
                        <span className="flex items-center gap-1.5 text-caption text-(--color-text-muted)">
                          <ShieldCheckIcon className="h-3.5 w-3.5 text-(--color-brand-deep)" />
                          {t("filmWarranty", { years: f.warrantyYears })}
                        </span>
                      </button>
                      <Link
                        href={`/b2c/products/${f.productSlug}`}
                        target="_blank"
                        className="text-link absolute bottom-4 start-4 text-caption"
                      >
                        {t("filmDetails")} ›
                      </Link>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <form noValidate onSubmit={onSubmit} className="mt-1">
              <h3 ref={headingRef} tabIndex={-1} className="text-title-sm font-semibold outline-none">
                {t("detailsTitle")}
              </h3>
              {submitted && (["make", "model", "year", "name", "mobile", "email", "consent"] as FieldKey[]).some((k) => errorFor(k)) ? (
                <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-(--color-danger)/8 px-4 py-3 text-footnote font-medium text-(--color-danger)">
                  <AlertIcon className="h-4 w-4 shrink-0" />
                  {t("errForm")}
                </p>
              ) : null}
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Field id="ppf-make" label={t("make")} required error={shownError("make")}>
                  <input id="ppf-make" autoComplete="off" value={form.make} onChange={(e) => set("make", e.target.value)} onBlur={blur("make")} maxLength={60} className={`${inputCls} ${borderFor("make")}`} {...aria("make")} />
                </Field>
                <Field id="ppf-model" label={t("model")} required error={shownError("model")}>
                  <input id="ppf-model" autoComplete="off" value={form.model} onChange={(e) => set("model", e.target.value)} onBlur={blur("model")} maxLength={60} className={`${inputCls} ${borderFor("model")}`} {...aria("model")} />
                </Field>
                <Field id="ppf-year" label={t("year")} required error={shownError("year")}>
                  <input id="ppf-year" inputMode="numeric" value={form.year} onChange={(e) => set("year", e.target.value.replace(/\D/g, "").slice(0, 4))} onBlur={blur("year")} className={`${inputCls} ltr-nums ${borderFor("year")}`} {...aria("year")} />
                </Field>
                <Field id="ppf-existing" label={t("existingFilm")}>
                  <select id="ppf-existing" value={form.existingFilm} onChange={(e) => set("existingFilm", e.target.value)} className={`${inputCls} border-(--color-border)`}>
                    {EXISTING.map((k) => (
                      <option key={k} value={k}>
                        {t(k)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="ppf-preferredDate" label={t("preferredDate")} optionalLabel={t("optional")} hint={t("preferredDateHint")}>
                  <input id="ppf-preferredDate" type="date" min={todayPlus(2)} value={form.preferredDate} onChange={(e) => set("preferredDate", e.target.value)} className={`${inputCls} border-(--color-border)`} aria-describedby="ppf-preferredDate-hint" />
                </Field>
                <span className="hidden sm:block" />
                <Field id="ppf-name" label={t("name")} required error={shownError("name")}>
                  <input id="ppf-name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} onBlur={blur("name")} maxLength={80} className={`${inputCls} ${borderFor("name")}`} {...aria("name")} />
                </Field>
                <Field id="ppf-mobile" label={t("mobile")} required hint={t("mobileHint")} error={shownError("mobile")}>
                  <input id="ppf-mobile" type="tel" autoComplete="tel" inputMode="tel" placeholder="+974 3083 8355" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} onBlur={blur("mobile")} maxLength={20} className={`${inputCls} ltr-nums ${borderFor("mobile")}`} {...aria("mobile", true)} />
                </Field>
                <Field id="ppf-email" label={t("email")} optionalLabel={t("optional")} error={shownError("email")}>
                  <input id="ppf-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} onBlur={blur("email")} maxLength={120} className={`${inputCls} ltr-nums ${borderFor("email")}`} {...aria("email")} />
                </Field>
                <div className="sm:col-span-3">
                  <Field id="ppf-notes" label={t("notes")} optionalLabel={t("optional")}>
                    <textarea id="ppf-notes" rows={3} maxLength={500} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder={t("notesPlaceholder")} className={`${inputCls} h-auto border-(--color-border) py-2.5`} />
                  </Field>
                </div>
                {/* Honeypot — hidden from people and assistive tech, irresistible to bots. */}
                <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="ppf-website">Website</label>
                  <input id="ppf-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set("website", e.target.value)} />
                </div>
                <div className="sm:col-span-3">
                  <label className="flex cursor-pointer items-start gap-3 text-footnote text-(--color-text)">
                    <input
                      id="ppf-consent"
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      onBlur={blur("consent")}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-(--color-brand-deep)"
                      {...aria("consent")}
                    />
                    <span>
                      {t("consent")}
                      <span aria-hidden className="ms-0.5 text-(--color-danger)">*</span>
                    </span>
                  </label>
                  {shownError("consent") ? (
                    <p id="ppf-consent-error" className="mt-1.5 ps-7 text-caption font-medium text-(--color-danger)">
                      {shownError("consent")}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between gap-3">
                <Button variant="secondary" onClick={() => setStep(2)} disabled={sending}>
                  <ChevronIcon className="h-3.5 w-3.5 rotate-180 rtl:rotate-0" />
                  {t("back")}
                </Button>
                <Button type="submit" size="lg" loading={sending}>
                  {sending ? t("submitting") : t("submit")}
                </Button>
              </div>
            </form>
          ) : null}

          {step < 3 ? <div className="mt-6 hidden lg:block">{nav}</div> : null}
        </div>

        {/* Summary: sticky card on desktop, compact bar + nav on phones */}
        <aside className="hidden lg:block">
          <div className="tile sticky top-24 p-5">{summary}</div>
        </aside>
      </div>

      {step < 3 ? (
        // One row, under 4.75rem tall: html[data-sticky-cta="on"] (globals.css)
        // lifts the floating WhatsApp bubble exactly that far, so it never
        // covers "Continue".
        <div className="sticky bottom-0 z-20 -mx-6 mt-6 flex items-center gap-3 border-t border-(--color-border-soft) bg-(--color-surface)/95 px-6 py-3 backdrop-blur lg:hidden">
          {step > 0 ? (
            <Button variant="secondary" className="w-11 shrink-0 px-0!" aria-label={t("back")} onClick={() => setStep((s) => (s - 1) as Step)}>
              <ChevronIcon className="h-3.5 w-3.5 shrink-0 rotate-180 rtl:rotate-0" />
            </Button>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="truncate text-caption text-(--color-text-muted)">{priceLabel}</p>
            <p className="text-body-lg font-bold leading-tight">
              {animatedPrice !== null && quote.priceQar !== null ? qar(animatedPrice) : "—"}
            </p>
          </div>
          <Button onClick={() => setStep((s) => (s + 1) as Step)} disabled={!canAdvance}>
            {t("next")}
            <ChevronIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
          </Button>
        </div>
      ) : (
        <div className="tile mt-6 p-5 lg:hidden">{summary}</div>
      )}
    </div>
  );
}

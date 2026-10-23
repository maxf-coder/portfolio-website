"use client";

import { useRef, useState, type ChangeEvent, type CSSProperties, type FormEvent } from "react";
import { AnimatePresence, m } from "motion/react";
import { useTranslations } from "next-intl";
import { FiArrowUpRight, FiCheck, FiCopy, FiMail, FiSend } from "react-icons/fi";
import { SiGithub, SiTelegram, SiWhatsapp  } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import {
  fadeUpHeading,
  revealSlow,
  slideFromLeft,
  slideFromRight,
  viewCard,
  viewSection,
} from "@/lib/motion";

const EMAIL = "max@maximf.com";

const LINKS = [
  { id: "github", href: "https://github.com/maxf-coder", Icon: SiGithub, brand: "#FFFFFF" },
  { id: "linkedin", href: "https://www.linkedin.com/in/maxim-furculita", Icon: FaLinkedin, brand: "#0A66C2",},
  { id: "whatsapp", href: "https://wa.me/40774272764", Icon: SiWhatsapp, brand: "#25D366" },
  { id: "telegram", href: "https://t.me/maximfurculita", Icon: SiTelegram, brand: "#26A5E4" },
] as const;

type Status = "idle" | "sending" | "success" | "error";
type Field = "name" | "email" | "message";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const t = useTranslations("Contact");
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);

  const update =
    (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setValues((current) => ({ ...current, [field]: value }));
      setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = t("errors.name");
    if (!values.email.trim()) next.email = t("errors.emailRequired");
    else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = t("errors.emailInvalid");
    if (!values.message.trim()) next.message = t("errors.message");

    setErrors(next);

    const firstInvalid = (Object.keys(next) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");

    // Lesson 11 replaces this with fetch("/api/contact").
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
    setValues({ name: "", email: "", message: "" });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied: the address is visible and is a mailto link anyway.
    }
  };

  const fieldClass =
    "glass w-full rounded-2xl px-4 py-3 text-sm text-cream placeholder:text-cream/30 transition-colors focus:border-cream/40 focus-ring aria-[invalid=true]:border-red-400/50";

  return (
    <section id="contact" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <m.div
          className="mb-16 text-center"
          variants={fadeUpHeading}
          initial="hidden"
          whileInView="visible"
          viewport={viewSection}
          transition={revealSlow}
        >
          <h2 className="gradient-text mb-3 text-4xl font-bold sm:text-5xl">{t("title")}</h2>
          <p className="text-lg text-cream/70">{t("subtitle")}</p>
        </m.div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5">
          <m.div
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewCard}
            transition={revealSlow}
            className="lg:col-span-3"
          >
            <div className="glass rounded-3xl p-6 shadow-glow sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <m.div
                    key="success"
                    role="status"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream/15">
                      <FiCheck size={28} className="text-cream" aria-hidden="true" />
                    </span>
                    <p className="max-w-sm text-lg font-medium text-cream">{t("form.success")}</p>
                    <button
                      type="button"
                      onClick={() => setStatus("idle")}
                      className="focus-ring mt-6 rounded text-sm text-cream/60 transition-colors hover:text-cream"
                    >
                      {t("form.reset")}
                    </button>
                  </m.div>
                ) : (
                  <m.form
                    key="form"
                    ref={formRef}
                    noValidate
                    aria-busy={status === "sending"}
                    onSubmit={onSubmit}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-2 block text-xs uppercase tracking-wider text-cream/50"
                      >
                        {t("form.name")}
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={update("name")}
                        placeholder={t("form.namePlaceholder")}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        className={fieldClass}
                      />
                      {errors.name && (
                        <p id="contact-name-error" className="mt-2 text-xs text-red-300">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-2 block text-xs uppercase tracking-wider text-cream/50"
                      >
                        {t("form.email")}
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={update("email")}
                        placeholder={t("form.emailPlaceholder")}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        className={fieldClass}
                      />
                      {errors.email && (
                        <p id="contact-email-error" className="mt-2 text-xs text-red-300">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-2 block text-xs uppercase tracking-wider text-cream/50"
                      >
                        {t("form.message")}
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={values.message}
                        onChange={update("message")}
                        placeholder={t("form.messagePlaceholder")}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={errors.message ? "contact-message-error" : undefined}
                        className={`${fieldClass} resize-none`}
                      />
                      {errors.message && (
                        <p id="contact-message-error" className="mt-2 text-xs text-red-300">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {status === "error" && (
                      <p role="alert" className="text-sm text-red-300">
                        {t("form.error")}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-navy-950 shadow-glow-cream transition-transform duration-300 disabled:opacity-60 motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] motion-safe:disabled:hover:scale-100"
                    >
                      <FiSend size={16} aria-hidden="true" />
                      {status === "sending" ? t("form.sending") : t("form.send")}
                    </button>
                  </m.form>
                )}
              </AnimatePresence>
            </div>
          </m.div>

          <m.div
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewCard}
            transition={revealSlow}
            className="space-y-4 lg:col-span-2"
          >
            <div className="glass rounded-3xl p-6 shadow-glow">
              <h3 className="mb-3 text-xs uppercase tracking-wider text-cream/50">
                {t("direct.title")}
              </h3>
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="glass-strong flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                    <FiMail size={18} className="text-cream" aria-hidden="true" />
                  </span>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="focus-ring truncate rounded text-sm font-medium text-cream transition-colors hover:text-cream/70"
                  >
                    {EMAIL}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? t("direct.copied") : t("direct.copy")}
                  className="glass-strong focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream transition-transform hover:scale-110"
                >
                  {copied ? (
                    <FiCheck size={16} aria-hidden="true" />
                  ) : (
                    <FiCopy size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
              <p aria-live="polite" className="sr-only">
                {copied ? t("direct.copied") : ""}
              </p>
            </div>

            {LINKS.map(({ id, href, Icon, brand }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                style={{ "--brand": brand } as CSSProperties}
                className="glass group flex items-center gap-3 rounded-3xl p-4 shadow-glow transition-colors hover:border-cream/25"
              >
                <span className="glass-strong flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-cream transition-colors group-hover:text-[var(--brand)]">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="flex-1 text-sm font-medium text-cream">{t(`links.${id}`)}</span>
                <FiArrowUpRight
                  size={16}
                  aria-hidden="true"
                  className="text-cream/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cream"
                />
              </a>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  );
}
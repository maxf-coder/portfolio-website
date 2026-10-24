import { getTranslations } from "next-intl/server";
import { FiMail } from "react-icons/fi";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { Logo } from "@/components/layout/logo";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { Link } from "@/i18n/navigation";
import { SECTION_IDS } from "@/lib/sections";

const NAV_IDS = SECTION_IDS.filter((id) => id !== "home");

const CONTACT_LINKS = [
  { label: "max@maximf.com", href: "mailto:max@maximf.com", Icon: FiMail },
  { label: "GitHub", href: "https://github.com/maxf-coder", Icon: SiGithub },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/maxim-furculita",
    Icon: FaLinkedin,
  },
] as const;

const headingClass = "mb-4 text-xs uppercase tracking-wider text-cream/70";
const linkClass =
  "focus-ring inline-flex items-center gap-2 rounded text-sm text-cream/60 transition-colors duration-300 hover:text-cream";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Navigation");

  return (
    <footer className="relative border-t border-cream/10 px-4 py-16 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="text-lg font-bold text-cream">Maxim Furculiță</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-cream/60">{t("tagline")}</p>
        </div>

        <nav aria-label={t("navigation")}>
          <h2 className={headingClass}>{t("navigation")}</h2>
          <ul className="space-y-2">
            {NAV_IDS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className={linkClass}>
                  {nav(id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={headingClass}>{t("contact")}</h2>
          <ul className="space-y-2">
            {CONTACT_LINKS.map(({ label, href, Icon }) => {
              const external = href.startsWith("http");

              return (
                <li key={label}>
                  <a
                    href={href}
                    className={linkClass}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <Icon size={14} aria-hidden="true" />
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className={headingClass}>{t("language")}</h2>
          <div className="mb-4">
            <LanguageToggle layoutId="locale-active-footer" />
          </div>
          <Link href="/privacy" className={linkClass}>
            {t("privacy")}
          </Link>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-cream/10 pt-8 text-center text-sm text-cream/70">
        {t("copyright")}
      </p>
    </footer>
  );
}
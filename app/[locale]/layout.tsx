import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { MotionProvider } from "@/components/providers/motion-provider";
import { BackgroundProvider } from "@/components/providers/background-provider";
import "../globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@/components/providers/analytics";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const locale = await getLocale();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: "%s | Maxim Furculiță",
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ro: "/ro",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      siteName: SITE_NAME,
      locale: locale === "ro" ? "ro_RO" : "en_US",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider>
          <BackgroundProvider>
            <MotionProvider>
              <SiteHeader />
              {children}
              </MotionProvider>
          </BackgroundProvider>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
import { Metadata } from "next"

const enum APP_NAME {
  SHORT = "Statter",
  FULL = "Statter App"
}

export const APP_URL = process.env.APP_URL || "http://localhost:3000"

export const NO_INDEX_PAGE = { robots: { index: false, follow: false } }

const SEO = {
  CREATOR: "Statter",
  GITHUB_URL: "https://github.com/statter-team",
  SITE_KEYWORDS: []
}

export const APP_TITLE = `${APP_NAME.SHORT} - Your Uptime Checker`

export const APP_METADATA: Metadata = {
  title: {
    default: APP_TITLE,
    template: `%s | ${APP_NAME.SHORT}`
  },
  description: "Zunno is a tool for tracking your expenses and achieving your financial goals.",
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME.SHORT,
  creator: SEO.CREATOR,
  authors: {
    name: SEO.CREATOR,
    url: SEO.GITHUB_URL
  },
  keywords: SEO.SITE_KEYWORDS,
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    description: "AI-powered resume builder",
    url: APP_URL,
    locale: "en-US",
    siteName: APP_NAME.SHORT,
    emails: `example@${APP_NAME.SHORT}`,
    images: [
      {
        url: `${APP_URL}/images/opengraph.png`,
        width: 1280,
        height: 640,
        alt: APP_NAME.FULL
      }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME.SHORT,
    startupImage: {
      url: "/images/256x256.svg"
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: APP_URL
  }
}

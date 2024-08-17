import type { Metadata } from 'next'

interface Props {
  title: string
  description: string
  openGraphImage: string
  author?: string
  canonical?: string
}

const domain = 'https://ahmedibra.com'

export default function meta({
  title,
  description,
  openGraphImage,
  author = 'Ahmed Ibrahim',
  ...props
}: Props & Metadata) {
  return {
    title,
    description,
    authors: {
      name: author,
    },
    author: author,
    creator: author,
    publisher: author,
    metadataBase: new URL(domain),
    generator: 'Next.js',
    applicationName: 'Ahmed Ibrahim',
    referrer: 'origin-when-cross-origin' as any,
    robots: {
      index: true,
      follow: true,
      nocache: false,
      noimageindex: false,
      'max-video-preview': -1,
      'max-snippet': -1,
    },
    alternates: {
      canonical: props?.canonical || '/',
      languages: {
        'en-US': '/en-US',
      },
    },
    openGraph: {
      title,
      description,
      url: domain,
      siteName: 'TopTayo',
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    icons: {
      icon: '/logo.svg',
      shortcut: '/logo.svg',
      apple: '/logo.svg',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/logo.svg',
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      siteId: '1467726470533754880',
      creator: author,
      creatorId: '1467726470533754880',
      images: {
        url: openGraphImage,
        alt: title,
      },
      app: {
        name: 'twitter_app',
        id: {
          iphone: 'twitter_app://iphone',
          ipad: 'twitter_app://ipad',
          googleplay: 'twitter_app://googleplay',
        },
        url: {
          iphone: 'https://iphone_url',
          ipad: 'https://ipad_url',
        },
      },
    },
    verification: {
      google: 'google',
      yandex: 'yandex',
      yahoo: 'yahoo',
      other: {
        me: ['info@ahmedibra.com', 'ahmaat19@gmail.com'],
      },
    },
    appleWebApp: {
      title,
      startupImage: [
        '/logo.svg',
        {
          url: '/logo.svg',
          media: '(device-width: 768px) and (device-height: 1024px)',
        },
      ],
    },
    web: {
      url: domain,
      should_fallback: true,
    },
    keywords:
      props?.keywords ||
      `Ahmed Ibrahim, Ahmed Ibrahim Samow, Next.js, Web & Mobile Development, App Development, Design Agency, Web Design, eCommerce, Websites, Web Solutions, Business Growth, Software Development, Custom Software Development, Custom Web Design, Somalia, Somali Web Design, Somali Web Development, SEO Optimization, Marketing, Branding, USSD, EVC Plus, Web Development, scalable web applications, responsive web applications, Mobile App Development, cross-platform mobile applications, Full Stack Development, end-to-end web solutions, front-end and back-end development, API Development, robust APIs, different technologies, Database Management, SQL, NoSQL, PostgreSQL, MongoDB, optimize databases, Server Configuration and Deployment, server setup, app deployment, Docker, AWS, DigitalOcean, UI/UX Design and Development, visually appealing UI/UX, interactive experiences, E-commerce Solutions, secure e-commerce platforms, scalable e-commerce, Custom Software Development, tailor-made software solutions, specific business requirements, Code Review and Refactoring, code review, code refactoring, quality improvement, dropshipping, toptayo, top-tayo, toptayo.com, https://toptayo.com`,
    ...props,
  }
}

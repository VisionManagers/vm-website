import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'Vision Managers';
const SITE_URL = 'https://visionmanagers.com';
const DEFAULT_DESCRIPTION = 'Most businesses are leaking $100K+ a year — missed calls, follow-up that never happens, work still done by hand. Vision Managers finds the leaks and builds the systems that fix them, with one person accountable.';
const DEFAULT_IMAGE = 'https://storage.googleapis.com/vm-website/web%20images/logo-social.png';

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Find What Your Business Is Leaking`;
  const canonicalUrl = `${SITE_URL}${path}`;

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vision Managers',
    url: SITE_URL,
    logo: 'https://storage.googleapis.com/vm-website/web%20images/vm-logo%402x.png',
    description: DEFAULT_DESCRIPTION,
    email: 'sukhneet@visionmanagers.com',
    telephone: '+1-425-494-4489',
    sameAs: [
      'https://linkedin.com/in/sukhneetsingh/',
    ],
    areaServed: 'US',
    serviceType: [
      'AI Strategy & Advisory',
      'Business Process Automation',
      'Bid & Estimate Automation',
      'Market Research & Idea Validation',
      'AI Voice Agents',
    ],
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEO;

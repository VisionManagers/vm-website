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
const DEFAULT_DESCRIPTION = 'AI for high-trust businesses. We build secure AI systems for intake, follow-up, and data — helping dentists, optometrists, and real estate agents recover revenue.';
const DEFAULT_IMAGE = 'https://storage.googleapis.com/vm-website/web%20images/vm-og-image.png';

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | AI for High-Trust Businesses`;
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
      'AI Voice Agents',
      'AI Consulting',
      'AI Audit',
      'Business Process Automation',
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

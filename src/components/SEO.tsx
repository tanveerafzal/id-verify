import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

const BASE_URL = 'https://trustcredo.com';
const DEFAULT_TITLE = 'TrustCredo - Secure Identity Verification Platform';
const DEFAULT_DESCRIPTION = 'TrustCredo provides fast, secure, and reliable identity verification services. Verify IDs, passports, and documents with AI-powered KYC solutions.';
const DEFAULT_KEYWORDS = 'identity verification, KYC, document verification, ID verification, passport verification, biometric verification, face matching';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  noIndex = false
}) => {
  const fullTitle = title ? `${title} | TrustCredo` : DEFAULT_TITLE;
  const fullCanonicalUrl = canonicalUrl ? `${BASE_URL}${canonicalUrl}` : BASE_URL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

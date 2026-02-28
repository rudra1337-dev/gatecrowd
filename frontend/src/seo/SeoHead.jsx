import { useEffect } from 'react';
import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, DEFAULT_KEYWORDS, SITE_NAME, absoluteUrl } from './siteConfig';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertCanonical(href) {
  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', href);
}

function SeoHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  path = '/',
  image = DEFAULT_IMAGE,
  noIndex = false,
  structuredData = []
}) {
  useEffect(() => {
    const canonical = absoluteUrl(path);
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'
    });

    upsertCanonical(canonical);

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

    const oldSchemas = document.head.querySelectorAll('script[data-seo-route-schema="true"]');
    oldSchemas.forEach((node) => node.remove());

    structuredData.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-route-schema', 'true');
      script.setAttribute('data-seo-route-schema-index', String(index));
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const routeSchemas = document.head.querySelectorAll('script[data-seo-route-schema="true"]');
      routeSchemas.forEach((node) => node.remove());
    };
  }, [description, image, keywords, noIndex, path, structuredData, title]);

  return null;
}

export default SeoHead;

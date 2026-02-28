import { SITE_NAME, SITE_URL, absoluteUrl } from './siteConfig';

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    sameAs: [SITE_URL]
  };
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/gates?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

export function buildSiteNavigationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { '@type': 'SiteNavigationElement', position: 1, name: 'Home', url: absoluteUrl('/home') },
      { '@type': 'SiteNavigationElement', position: 2, name: 'Gates', url: absoluteUrl('/gates') },
      { '@type': 'SiteNavigationElement', position: 3, name: 'Alerts', url: absoluteUrl('/alerts') },
      { '@type': 'SiteNavigationElement', position: 4, name: 'About', url: absoluteUrl('/about') }
    ]
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

export function buildProjectSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web Browser',
    url: SITE_URL,
    description:
      'Live crowd guidance web app for Puri Jagannath Temple with gate-level recommendations and alerts.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR'
    }
  };
}

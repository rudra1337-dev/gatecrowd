import { useEffect } from 'react';
import { buildOrganizationSchema, buildSiteNavigationSchema, buildWebSiteSchema } from './schema';

function GlobalSeo() {
  useEffect(() => {
    const schemas = [buildOrganizationSchema(), buildWebSiteSchema(), buildSiteNavigationSchema()];
    const oldSchemas = document.head.querySelectorAll('script[data-seo-global-schema="true"]');
    oldSchemas.forEach((node) => node.remove());

    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-global-schema', 'true');
      script.setAttribute('data-seo-global-schema-index', String(index));
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const scripts = document.head.querySelectorAll('script[data-seo-global-schema="true"]');
      scripts.forEach((node) => node.remove());
    };
  }, []);

  return null;
}

export default GlobalSeo;

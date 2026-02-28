export const SITE_URL = 'https://gatecrowd.vercel.app';

export const SITE_NAME = 'GateCrowd';

export const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/5/56/Jagannath_Temple%2C_Puri%2C_Odisha.jpg';

export const DEFAULT_DESCRIPTION =
  'GateCrowd provides live crowd monitoring, gate recommendations, and alerts for visitors planning darshan at Puri Jagannath Temple.';

export const DEFAULT_KEYWORDS =
  'GateCrowd, Puri Jagannath Temple, crowd monitoring, temple gates, darshan queue, live alerts, Odisha pilgrimage, smart temple guidance';

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

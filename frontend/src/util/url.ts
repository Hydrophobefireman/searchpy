const IS_LOCAL = location.hostname.includes("localhost");

const IS_VC_DEV = location.port === "3000";

const API_HOST = IS_VC_DEV
  ? "http://localhost:3000"
  : IS_LOCAL
  ? "http://localhost:5000"
  : location.origin;

export function buildUrl(u: string) {
  return new URL(u, API_HOST).href;
}

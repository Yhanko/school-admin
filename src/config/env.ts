declare global {
  interface Window {
    __ENV__?: Record<string, string>;
  }
}

const env = {
  API_BASE_URL:
    (typeof window !== "undefined" && window.__ENV__?.NEXT_PUBLIC_API_URL) ||
    (typeof window !== "undefined" && window.__ENV__?.NEXT_PUBLIC_API_BASE_URL) ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    "http://localhost:4000",
};

export default env;
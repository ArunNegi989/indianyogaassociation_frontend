const ORIGIN = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export function resolveImage(src?: string, fallback = ""): string {
  if (!src) return fallback;
  if (src.startsWith("http") || src.startsWith("blob:")) return src;
  return `${ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;
}

export function stripOrigin(src: string): string {
  if (src.startsWith(ORIGIN)) return src.slice(ORIGIN.length);
  return src;
}

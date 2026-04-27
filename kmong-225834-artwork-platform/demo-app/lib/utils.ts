import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function daysLeft(deadline: string, from = new Date()): number {
  const end = new Date(deadline);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function relativeDate(iso: string, from = new Date()): string {
  const d = new Date(iso.includes(" ") ? iso.replace(" ", "T") : iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diff = Math.floor((from.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days}일 전`;
  return formatDate(iso.split(" ")[0]);
}

export function stripHtml(html: string, max = 140): string {
  const plain = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, max) + "…";
}

export function ensureHtml(text: string): string {
  if (/<(h\d|p|ul|ol|li|blockquote|strong|em|a|br)/i.test(text)) return text;
  return text
    .split(/\n\n+/)
    .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

export function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

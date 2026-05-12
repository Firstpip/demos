import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKRW(value: number): string {
  return value.toLocaleString('ko-KR') + '원'
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export function basePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? ''
}

export function asset(path: string): string {
  const bp = basePath()
  if (path.startsWith('http')) return path
  return `${bp}${path.startsWith('/') ? '' : '/'}${path}`
}

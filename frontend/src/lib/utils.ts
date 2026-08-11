import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getInitials(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.charAt(0) || '';
  const last = lastName?.charAt(0) || '';
  return (first + last).toUpperCase() || '?';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function socialPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    instagram: 'from-pink-500 to-purple-600',
    youtube: 'from-red-500 to-red-700',
    tiktok: 'from-black to-gray-800',
    linkedin: 'from-blue-600 to-blue-800',
    twitter: 'from-sky-400 to-blue-500',
    facebook: 'from-blue-600 to-blue-800',
    website: 'from-neutral-600 to-neutral-800',
  };
  return colors[platform] || 'from-neutral-500 to-neutral-700';
}

export function socialPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: 'instagram',
    youtube: 'youtube',
    tiktok: 'music',
    linkedin: 'linkedin',
    twitter: 'twitter',
    facebook: 'facebook',
    website: 'globe',
  };
  return icons[platform] || 'link';
}

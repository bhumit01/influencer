import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  firstName?: string | null;
  lastName?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  name?: string;
}

export function Avatar({ src, alt, firstName, lastName, size = 'md', className, name }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    );
  }

  const displayName = name || `${firstName || ''} ${lastName || ''}`.trim();

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white font-semibold',
        sizes[size],
        className
      )}
    >
      {displayName ? getInitialsFromName(displayName) : '?'}
    </div>
  );
}

function getInitialsFromName(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  const firstPart = parts[0];
  if (!firstPart || parts.length === 1) {
    return firstPart ? firstPart.charAt(0).toUpperCase() : '?';
  }
  const lastPart = parts[parts.length - 1];
  const first = firstPart.charAt(0);
  const last = lastPart ? lastPart.charAt(0) : '';
  return (first + last).toUpperCase();
}

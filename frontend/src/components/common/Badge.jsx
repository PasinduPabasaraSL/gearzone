import { cn } from '../../utils/cn'

const TONES = {
  neutral: 'bg-subtle text-muted border-line',
  accent: 'bg-accent text-white border-transparent',
  accentSoft: 'bg-accent-soft text-link border-transparent',
  success: 'bg-success-soft text-success border-transparent',
  warning: 'bg-warning-soft text-warning border-transparent',
  danger: 'bg-danger-soft text-danger border-transparent',
  contrast: 'bg-ink text-canvas border-transparent',
}

/**
 * Small metadata chip. Kept deliberately restrained: no large sale banners,
 * just a bordered pill that works on photography and on flat surfaces.
 */
export default function Badge({ tone = 'neutral', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold tracking-[0.09em] uppercase',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

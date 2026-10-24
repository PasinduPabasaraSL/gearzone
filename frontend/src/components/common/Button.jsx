import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-accent text-white hover:bg-accent-hover active:bg-brand-800 shadow-xs',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-subtle active:bg-line/60',
  outline: 'border border-accent text-link hover:bg-accent-soft active:bg-brand-100',
  ghost: 'text-ink hover:bg-subtle active:bg-line/60',
  quiet: 'text-muted hover:text-ink hover:bg-subtle',
  danger: 'bg-danger text-white hover:brightness-110 active:brightness-95',
  onAccent: 'bg-white text-brand-700 hover:bg-brand-50 active:bg-brand-100',
}

const SIZES = {
  sm: 'h-9 gap-1.5 px-3.5 text-[13px]',
  md: 'h-11 gap-2 px-5 text-sm',
  lg: 'h-13 gap-2 px-6 text-[15px]',
}

const ICON_SIZES = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
  lg: 'h-13 w-13',
}

/**
 * Single button primitive for the whole site. Renders as <Link> when given
 * `to`, as <a> when given `href`, and as <button> otherwise, so call sites
 * never have to restyle a link to look like a CTA.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  fullWidth = false,
  to,
  href,
  type,
  className,
  children,
  ...rest
}) {
  const classes = cn(
    'inline-flex select-none items-center justify-center rounded-control font-semibold whitespace-nowrap',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-150',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    iconOnly ? ICON_SIZES[size] : SIZES[size],
    VARIANTS[variant],
    fullWidth && 'w-full',
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <button type={type ?? 'button'} className={classes} {...rest}>
      {children}
    </button>
  )
}

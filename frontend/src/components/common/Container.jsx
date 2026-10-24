import { cn } from '../../utils/cn'

/**
 * The single horizontal rhythm for the whole site. Every full-width section
 * wraps its content in this so nothing drifts out of alignment. Content runs
 * close to full width on large monitors, capped only on ultra-wide screens.
 */
export default function Container({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1840px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16', className)} {...rest}>
      {children}
    </Tag>
  )
}

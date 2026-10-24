import Breadcrumbs from '../common/Breadcrumbs'
import { cn } from '../../utils/cn'

/** Title block for listing and content pages, with breadcrumbs above. */
export default function PageHeader({ breadcrumbs, eyebrow, title, description, aside, className }) {
  return (
    <header className={cn('pt-6 pb-8 sm:pt-8 sm:pb-10', className)}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="mt-5 flex flex-col gap-5 sm:mt-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {eyebrow && <p className="micro-label mb-3 text-link">{eyebrow}</p>}
          <h1 className="text-[32px] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink sm:text-[40px]">{title}</h1>
          {description && <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">{description}</p>}
        </div>
        {aside}
      </div>
    </header>
  )
}

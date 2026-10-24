import FilterSidebar from './FilterSidebar'
import Button from '../common/Button'
import Drawer from '../common/Drawer'

/**
 * Bottom sheet holding the full filter sidebar on small screens. Changes
 * apply live; the footer shows the resulting count and closes the sheet.
 */
export default function MobileFilters({ open, onClose, total, activeCount, onClear, ...sidebarProps }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="bottom"
      title="Filters"
      footer={
        <div className="grid grid-cols-[auto_1fr] gap-2.5">
          <Button variant="secondary" onClick={onClear} disabled={activeCount === 0}>
            Clear
          </Button>
          <Button onClick={onClose}>
            Show {total} product{total === 1 ? '' : 's'}
          </Button>
        </div>
      }
    >
      <FilterSidebar {...sidebarProps} className="px-5" />
    </Drawer>
  )
}

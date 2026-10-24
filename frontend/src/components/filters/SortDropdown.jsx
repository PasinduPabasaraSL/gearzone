import Select from '../common/Select'
import { SORT_OPTIONS } from '../../utils/filterProducts'

export default function SortDropdown({ value, onChange, includeRelevance = false, className }) {
  const options = includeRelevance ? [{ value: 'relevance', label: 'Best match' }, ...SORT_OPTIONS] : SORT_OPTIONS

  return (
    <Select
      label="Sort by"
      hideLabel
      options={options}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      wrapperClassName={className}
      className="h-10 text-sm"
    />
  )
}

import {
  BatteryCharging,
  Cable,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Package,
  Smartphone,
  Usb,
} from 'lucide-react'

const ICONS = { BatteryCharging, Cable, Headphones, Keyboard, Laptop, Monitor, Mouse, Smartphone, Usb }

/** Resolves the icon name stored on a category record to a lucide component. */
export default function CategoryIcon({ name, ...props }) {
  const Icon = ICONS[name] ?? Package
  return <Icon aria-hidden="true" {...props} />
}

import { useEffect } from 'react'

const SITE_NAME = 'GearZoneLK'
const DEFAULT_DESCRIPTION =
  'GearZoneLK sells keyboards, mice, desk mats, cables, hubs, audio and phone accessories with islandwide delivery across Sri Lanka.'

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    const [, key, name] = selector.match(/\[(\w+)="([^"]+)"\]/) ?? []
    if (key) element.setAttribute(key, name)
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

/**
 * Per-route document title and description, plus Open Graph equivalents.
 * Keeps pages SEO-ready until server rendering or a head manager is added.
 */
export function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Everyday Tech. Better Gear.`
    const text = description ?? DEFAULT_DESCRIPTION

    document.title = fullTitle
    setMeta('meta[name="description"]', 'content', text)
    setMeta('meta[property="og:title"]', 'content', fullTitle)
    setMeta('meta[property="og:description"]', 'content', text)
  }, [title, description])
}

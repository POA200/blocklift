import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

type SeoProps = {
  title?: string
  description?: string
  canonical?: string
  image?: string
  noindex?: boolean
}

const SITE_NAME = 'BlockLift'
const DEFAULT_DESC = 'BlockLift uses Stacks & Bitcoin to provide fully transparent, on-chain verification for donations of school supplies in underserved communities.'
const BASE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://www.blocklift.org'
const SOCIAL_IMAGE = (import.meta.env.VITE_SOCIAL_IMAGE as string | undefined) || 'https://www.blocklift.org/assets/blocklift-social-preview.png'

export default function Seo({ title, description, canonical, image, noindex }: SeoProps) {
  const loc = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}`
    const desc = description || DEFAULT_DESC
    const url = canonical || new URL(loc.pathname + loc.search, BASE_URL).toString()
    const img = image || SOCIAL_IMAGE

    document.title = fullTitle

    setMeta('name', 'description', desc)
    setMeta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow')
    setLink('canonical', url)

    // Open Graph
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('property', 'og:site_name', SITE_NAME)

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', img)
  }, [title, description, canonical, image, noindex, loc.pathname, loc.search])

  return null
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  if (!value) return
  let el = document.head.querySelector(`meta[${attr}="${cssEscape(key)}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setLink(rel: string, href: string) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${cssEscape(rel)}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

// Basic CSS.escape fallback for attribute selectors
function cssEscape(str: string) {
  return str.replace(/"/g, '\\"')
}

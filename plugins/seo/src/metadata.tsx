import { useEffect, useRef } from 'react';

/**
 * Per-page metadata that overrides global SEO defaults.
 *
 * Drop `<Metadata>` into any route component to set the page title,
 * description, Open Graph tags, Twitter Card tags, and canonical URL.
 * Tags are applied on mount and cleaned up on unmount so navigating
 * between pages restores the previous (global) values automatically.
 *
 * @example
 * ```tsx
 * import { Metadata } from '@manicjs/seo/metadata';
 *
 * export default function About() {
 *   return (
 *     <>
 *       <Metadata
 *         title="About Us"
 *         description="Learn more about our company"
 *         ogImage="/images/about-og.png"
 *       />
 *       <h1>About</h1>
 *     </>
 *   );
 * }
 * ```
 */
export interface MetadataProps {
  /** Page title — sets `<title>` and `og:title` / `twitter:title` */
  title?: string;
  /** Meta description — sets `name="description"`, `og:description`, `twitter:description` */
  description?: string;
  /** Author — sets `name="author"` */
  author?: string;
  /** Canonical URL — creates/updates `<link rel="canonical">` */
  canonical?: string;
  /** Open Graph image URL — sets `og:image` and `twitter:image` */
  ogImage?: string;
  /** Open Graph type — sets `og:type` (default from global config) */
  ogType?: string;
  /** Open Graph URL — sets `og:url` */
  ogUrl?: string;
  /** Open Graph locale — sets `og:locale` */
  ogLocale?: string;
  /** Open Graph site name — sets `og:site_name` */
  ogSiteName?: string;
  /** Twitter card type — sets `twitter:card` */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  /** Twitter site handle — sets `twitter:site` */
  twitterSite?: string;
  /** Twitter creator handle — sets `twitter:creator` */
  twitterCreator?: string;
}

// ---------------------------------------------------------------------------
// Helpers for managing <meta> and <link> tags in <head>
// ---------------------------------------------------------------------------

type TagEntry = { element: Element; previous: string | null };

const MANIC_ATTR = 'data-manic-seo';

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  value: string,
  tracker: TagEntry[]
) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector);
  const previous = el?.getAttribute('content') ?? null;

  if (el) {
    el.setAttribute('content', value);
  } else {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute('content', value);
    el.setAttribute(MANIC_ATTR, '');
    document.head.appendChild(el);
  }

  tracker.push({ element: el, previous });
}

function upsertLink(
  rel: string,
  href: string,
  tracker: TagEntry[]
) {
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector(selector);
  const previous = el?.getAttribute('href') ?? null;

  if (el) {
    el.setAttribute('href', href);
  } else {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    el.setAttribute('href', href);
    el.setAttribute(MANIC_ATTR, '');
    document.head.appendChild(el);
  }

  tracker.push({ element: el, previous });
}

/**
 * React component for per-page SEO metadata.
 *
 * Renders nothing visible — it manages `<head>` tags via side effects.
 * On unmount the previous tag values are restored so global SEO defaults
 * come back when navigating away from the page.
 */
export function Metadata(props: MetadataProps): null {
  const tracked = useRef<{
    title: string | null;
    tags: TagEntry[];
  }>({ title: null, tags: [] });

  useEffect(() => {
    const tags: TagEntry[] = [];
    const prevTitle = document.title;

    // Title
    if (props.title) {
      document.title = props.title;
    }

    // Standard meta
    if (props.title) upsertMeta('name', 'title', props.title, tags);
    if (props.description)
      upsertMeta('name', 'description', props.description, tags);
    if (props.author) upsertMeta('name', 'author', props.author, tags);

    // Open Graph
    if (props.title) upsertMeta('property', 'og:title', props.title, tags);
    if (props.description)
      upsertMeta('property', 'og:description', props.description, tags);
    if (props.ogImage) upsertMeta('property', 'og:image', props.ogImage, tags);
    if (props.ogType) upsertMeta('property', 'og:type', props.ogType, tags);
    if (props.ogUrl) upsertMeta('property', 'og:url', props.ogUrl, tags);
    if (props.ogLocale)
      upsertMeta('property', 'og:locale', props.ogLocale, tags);
    if (props.ogSiteName)
      upsertMeta('property', 'og:site_name', props.ogSiteName, tags);

    // Twitter Card
    if (props.twitterCard)
      upsertMeta('name', 'twitter:card', props.twitterCard, tags);
    if (props.title)
      upsertMeta('name', 'twitter:title', props.title, tags);
    if (props.description)
      upsertMeta('name', 'twitter:description', props.description, tags);
    if (props.ogImage)
      upsertMeta('name', 'twitter:image', props.ogImage, tags);
    if (props.twitterSite)
      upsertMeta('name', 'twitter:site', props.twitterSite, tags);
    if (props.twitterCreator)
      upsertMeta('name', 'twitter:creator', props.twitterCreator, tags);

    // Canonical
    if (props.canonical) upsertLink('canonical', props.canonical, tags);

    tracked.current = { title: prevTitle, tags };

    // Cleanup: restore previous values on unmount / re-render
    return () => {
      if (tracked.current.title !== null) {
        document.title = tracked.current.title;
      }

      for (const { element, previous } of tracked.current.tags) {
        if (previous === null) {
          // We created this tag — remove it
          if (element.hasAttribute(MANIC_ATTR)) {
            element.remove();
          }
        } else {
          // We modified an existing tag — restore original value
          const attr = element.hasAttribute('content') ? 'content' : 'href';
          element.setAttribute(attr, previous);
        }
      }
    };
  }, [
    props.title,
    props.description,
    props.author,
    props.canonical,
    props.ogImage,
    props.ogType,
    props.ogUrl,
    props.ogLocale,
    props.ogSiteName,
    props.twitterCard,
    props.twitterSite,
    props.twitterCreator,
  ]);

  return null;
}

import type { WpLinkAttributes } from "./WpLinkAttributes";

/**
 * A link for a nav menu or to appear in nav bar plainly.
 * 
 * @since latest
 */
export interface WpNavigationLink {
    label: string;

    /** Absolute or relative (starting slahs in that case but no trailing slash) */
    url: string;

    linkAttributes: WpLinkAttributes;
}
import type { WpNavigationLink } from "./WpNavigationLink";

/**
 * A menu with some links, meant to appear in navbar.
 * 
 * @since latest
 */
export interface WpNavigationMenu {
    label: string;

    $items: WpNavigationLink[]
}
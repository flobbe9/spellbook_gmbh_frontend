import type { WpNavigationLink } from "./WpNavigationLink";

/**
 * A menu with some links, meant to appear in navbar.
 * 
 * @since 0.0.1
 */
export interface WpNavigationMenu {
    label: string;

    $items: WpNavigationLink[]
}
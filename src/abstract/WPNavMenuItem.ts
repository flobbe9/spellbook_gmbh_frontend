/**
 * @since 0.0.2
 */
export class WPNavMenuItem {

    ID: number;

    /** the label of the menu item */
    title: string;

    /** the <a> tag "target" attribute */
    target: string;

    /** where the nav menu item should navigate to */
    url: string;

    /** the position of the item among the other items in the nav menu */
    menu_order: number;

    /** Wether the url points to this domain or not */
    isInternalLink: boolean;
}
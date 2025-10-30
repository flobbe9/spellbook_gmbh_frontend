import WPBlock from "@/abstracts/backendDefinitions/WpBlock";
import type { WPPostStatus } from "@/abstracts/backendDefinitions/WpPostStatus";

/**
 * @since latest
 */
export default class WPPage {
    ID: number;

    /** Date string of page creation. Formatted like: `2025-10-29 16:02:0` */
    post_date: string;

    post_title: string;

    post_type: string;

    post_name: string;
    
    blocks: WPBlock[];
    
    post_status: WPPostStatus;

    /** TODO */
    menu_order: number;

    /** No trailing "/" */
    path: string;
}
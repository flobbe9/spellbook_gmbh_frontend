import WPBlock from "./WPBlock";
import { WPPostStatus } from "./WPPostStatus";


/**
 * @since 0.0.1
 */
export default class WPPage {

    ID: number;

    post_title: string;

    post_type: string;

    post_name: string;

    blocks: WPBlock[];

    post_status: WPPostStatus;

    /** no "/" at start or end */
    path: string;
}
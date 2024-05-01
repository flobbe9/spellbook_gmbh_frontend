import WPBlock from "./WPBlock";


/**
 * @since 0.0.1
 */
export default class WPPage {

    ID: number;

    // TODO: is this used?
    post_content: string;

    post_title: string;

    post_type: string;

    post_name: string;

    blocks: WPBlock[];

    /** no "/" at start or end */
    path: string;
}
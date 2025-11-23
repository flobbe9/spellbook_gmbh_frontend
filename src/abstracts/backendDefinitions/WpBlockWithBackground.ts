import type { WpBackgroundType } from "./WpBackgroundType";

/**
 * @since latest
 */
export interface WpBlockWithBackground {
    background_type: WpBackgroundType;

    /** Absolute url */
    background_image_url: string,
    /** Valid css string */
    background_color: string,
}
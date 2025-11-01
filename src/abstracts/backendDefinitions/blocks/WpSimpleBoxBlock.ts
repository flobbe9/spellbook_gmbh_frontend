import type { WpBackgroundType } from "../WpBackgroundType";


/**
 * Should contain all simple block fields too.
 * 
 * @since latest
 */
export interface WpSimpleBoxBlock {
    /** Adds an fixed amount of padding. Default should be `false` */
    box_more_padding: boolean,

    /** Valid css string */
    box_width: string,

    box_background_type: WpBackgroundType

    /** Absolute url */
    box_background_image_url: string,

    /** Valid css string */
    box_background_color: string,

    /** The full `blockName` of the simple block */
    box_simple_block_type: string
}

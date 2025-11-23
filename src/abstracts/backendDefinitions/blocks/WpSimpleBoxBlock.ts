import type { WpBlockWithBackground } from "../WpBlockWithBackground";


/**
 * Should contain all simple block fields too.
 * 
 * @since latest
 */
export interface WpSimpleBoxBlock extends WpBlockWithBackground { // NOTE: background fields actually have "box_" prefix!!
    /** Adds an fixed amount of padding. Default should be `false` */
    box_more_padding: boolean,

    /** Valid css string */
    box_width: "100%" | "66%" | "fit-content",

    /** The full `blockName` of the simple block */
    box_simple_block_type: string
}

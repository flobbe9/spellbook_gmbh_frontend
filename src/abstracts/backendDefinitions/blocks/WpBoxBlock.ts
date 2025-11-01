import { assertFalsyOrBlankAndThrow } from "@/helpers/utils";
import type { WpBackgroundType } from "../WpBackgroundType";
import type WpBlock from "../WpBlock";
import type { WpSimpleBoxBlock } from "./WpSimpleBoxBlock";

/**
 * @since latest
 */
export interface WpBoxBlock {
    background_type: WpBackgroundType,

    background_image_url: string,

    background_image_fixed: boolean,

    background_color: string,

    display_flex: false,

    justify_content: string,

    simpleBlocks: WpSimpleBoxBlock[]
}

export function parseWpBoxBlock(wpBlock: WpBlock): WpBoxBlock {
    assertFalsyOrBlankAndThrow(wpBlock, wpBlock.attrs?.["data"]);
    
    const data = wpBlock.attrs["data"];

    return {
        background_type: data[`box_container_background_type`],
        background_image_url: data[`box_container_background_image_url`],
        background_image_fixed: data[`box_container_background_image_fixed`],
        background_color: data[`box_container_background_color`],
        display_flex: data[`box_container_display_flex`],
        justify_content: data[`box_container_justify_content`],
        simpleBlocks: data[`box_container_boxes`] // contains all simple block fields too
    }
}
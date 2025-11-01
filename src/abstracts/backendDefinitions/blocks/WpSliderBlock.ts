import { assertFalsyOrBlankAndThrow } from "@/helpers/utils";
import type WpBlock from "../WpBlock";
import { getWpBlockFieldPrefix } from "../WpBlock";

/**
 * @since latest
 */
export interface WpSliderBlock {
    slides: WpSliderBlockSlide[];
}

/**
 * @since latest
 */
interface WpSliderBlockSlide {
    type: "text" | "image" | "video";

    /** Absolute url */
    image_url: string;

    /** Absolute url */
    video_url: string;

    /** Html */
    html: string;
}

export function parseWpSliderBlock(wpBlock: WpBlock, parentBlockName: string): WpSliderBlock {
    assertFalsyOrBlankAndThrow(wpBlock, wpBlock.attrs?.["data"]);

    const data = wpBlock.attrs["data"];
    const fieldNamePrefix = getWpBlockFieldPrefix(parentBlockName);

    const slides: WpSliderBlockSlide[] = (data[`${fieldNamePrefix}slider_slides`] as object[])
        .map(slide => ({
            type: slide[`${fieldNamePrefix}slide_type`],
            image_url: slide[`${fieldNamePrefix}slide_image_url`],
            video_url: slide[`${fieldNamePrefix}slide_video_url`],
            html: slide[`${fieldNamePrefix}slide_html`],
        }));

    return {
        slides
    }
}
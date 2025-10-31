import { assertFalsyOrBlankAndThrow, isBlank } from "@/helpers/utils";
import type WpBlock from "./WpBlock";
import { getWpBlockFieldPrefix } from "./WpBlock";

/**
 * @since latest
 */
export interface WpButtonLinkBlock {
    label: string;

    scope: "internal" | "external";

    /** Relative path of wordpress page, contains starting slash, may be blank */
    internal_page: string;
    /** Absolute url of any external page, may be blank */
    external_url: string;
    /** Should default to `false` */
    open_in_new_tab: boolean;
    /** Valid css value */
    background_color: string;
}

export function parseWpButtonLinkBlock(wpBlock: WpBlock, parentBlockName?: string): WpButtonLinkBlock {
    assertFalsyOrBlankAndThrow(wpBlock, wpBlock.attrs?.["data"]);

    const data = wpBlock.attrs["data"];
    const fieldNamePrefix = !isBlank(parentBlockName) ? getWpBlockFieldPrefix(parentBlockName) : '';

    return {
        label: data[`${fieldNamePrefix}button_link_label`],
        scope: data[`${fieldNamePrefix}button_link_scope`],
        internal_page: data[`${fieldNamePrefix}button_link_internal_page`],
        external_url: data[`${fieldNamePrefix}button_link_external_url`],
        open_in_new_tab: data[`${fieldNamePrefix}button_link_open_in_new_tab`],
        background_color: data[`${fieldNamePrefix}button_link_background_color`],
    }
}
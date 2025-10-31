import { assertFalsyOrBlankAndThrow } from "@/helpers/utils";
import type WpBlock from "../WpBlock";
import { getWpBlockFieldPrefix } from "../WpBlock";

/**
 * An `<hr>` or an icon.
 * 
 * @since latest
 */
export interface WpSeparatorBlock {
    type: "yugioh" | "pokemon" | "magic" | "line"
}

export function parseWpSeparatorBlock(wpBlock: WpBlock, parentBlockName?: string): WpSeparatorBlock {
    assertFalsyOrBlankAndThrow(wpBlock, wpBlock.attrs?.["data"])

    const data = wpBlock.attrs["data"];

    return {
        type: data[`${getWpBlockFieldPrefix(parentBlockName)}trenner_type`]
    }
}
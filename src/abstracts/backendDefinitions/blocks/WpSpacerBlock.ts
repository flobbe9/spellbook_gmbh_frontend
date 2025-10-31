import { assertFalsyOrBlankAndThrow } from "@/helpers/utils";
import type WpBlock from "../WpBlock";
import { getWpBlockFieldPrefix } from "../WpBlock";

export interface WpSpacerBlock {
    /** In px */
    height: number
}

export function parseWpSpacerBlock(wpBlock: WpBlock, parentBlockName: string): WpSpacerBlock {
    assertFalsyOrBlankAndThrow(wpBlock, wpBlock.attrs?.["data"]);

    const data = wpBlock.attrs["data"];

    return {
        height: data[`${getWpBlockFieldPrefix(parentBlockName)}spacer_height`]
    }
}
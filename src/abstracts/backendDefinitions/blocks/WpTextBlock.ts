import { assertFalsyOrBlankAndThrow, isBlank } from "@/helpers/utils";
import type WPBlock from "../WpBlock";
import { getWpBlockFieldPrefix } from "../WpBlock";

/**
 * Rich text block with html content.
 * 
 * @since latest
 */
export interface WpTextBlock {
    html: string
}

/**
 * @param wpBlock 
 * @param parentBlockName full `blockName` (blockType in backend) of parent block. Omit if no parent. 
 * @returns `html` never falsy, just blank
 */
export function parseWpTextBlock(wpBlock: WPBlock, parentBlockName?: string): WpTextBlock {
    assertFalsyOrBlankAndThrow(wpBlock);

    const data = wpBlock.attrs?.["data"];
    if (!data)
        return { html: ''};

    const rawFieldName = "text_rich_text";
    const fieldName = !isBlank(parentBlockName) ? getWpBlockFieldPrefix(parentBlockName) + rawFieldName : rawFieldName;

    return { 
        html: data[fieldName] ?? ''
    }
}
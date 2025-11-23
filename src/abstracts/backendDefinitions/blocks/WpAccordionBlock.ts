import { assertFalsyOrBlankAndThrow } from "@/helpers/utils";
import type WpBlock from "../WpBlock";
import { getWpBlockFieldPrefix } from "../WpBlock";

/**
 * @since latest
 */
export interface WpAccordionBlock {
    /** Never empty */
    header_bodies: WpAccordionItem[]
}

interface WpAccordionItem {
    /** Html string */
    header: string;

    /** Html string, may be blank */
    body: string;
}

export function parseWpAccordionBlock(wpBlock: WpBlock, parentBlockName?: string): WpAccordionBlock {
    assertFalsyOrBlankAndThrow(wpBlock, wpBlock.attrs?.["data"]);

    const data = wpBlock.attrs["data"];
    const fieldNamePrefix = getWpBlockFieldPrefix(parentBlockName);

    const header_bodies = (data[`${fieldNamePrefix}accordion_header_bodies`] as object[])
        .map(header_body => ({
            header: header_body[`${fieldNamePrefix}accordion_header`],
            body: header_body[`${fieldNamePrefix}accordion_body`],
        }))

    return {
        header_bodies: header_bodies
    }
}
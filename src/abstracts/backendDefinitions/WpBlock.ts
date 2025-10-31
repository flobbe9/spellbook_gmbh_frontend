import { isBlank } from "@/helpers/utils";

/**
 * @since latest
 */
export default class WpBlock {
    /** `null` beeing equivalent to a linke break */
    blockName: string | null;

    attrs: object;

    innerBlocks: WpBlock[];

    innerHTML: string;
}

/**
 * Prepend this to child block field names.
 * 
 * @param wpBlockName in backend it's called "blockType", means the full "blockTypeCategory/blockName", e.g. "carbon-fields/text"
 * @returns parsed name portion (everything after the first "/") to lowercase and replacing "-" with "_". Ends with "_". Return empty string if arg is falsy
 * @see "CustomBlockWrapper::parseName()" in backend
 */
export function getWpBlockFieldPrefix(wpBlockName: string): string {
    if (isBlank(wpBlockName))
        return ''

    const wpBlockNameSplit = wpBlockName.split('/');
    if (!wpBlockNameSplit || wpBlockNameSplit.length < 2)
        throw new Error(`Failed to get block field prefix for wpBlockname '${wpBlockName}'. Invalid format, missing a '/'`);

    return wpBlockNameSplit[1].toLowerCase().replace("-", "_") + "_";
}
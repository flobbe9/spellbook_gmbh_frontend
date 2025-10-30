
/**
 * @since latest
 */
export default class WPBlock {

    /** `null` beeing equivalent to a linke break */
    blockName: string | null;

    attrs: object;

    innerBlocks: WPBlock[];

    innerHTML: string;
}
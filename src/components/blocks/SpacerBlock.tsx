import { parseWpSpacerBlock } from "@/abstracts/backendDefinitions/blocks/WpSpacerBlock";
import { useBlockProps } from "@/hooks/useBlockProps";
import type { BlockProps } from "../Block";
import ConditionalDiv from "../ConditionalDiv";

/**
 * @since latest 
 */
export default function SpacerBlock(props: BlockProps) {
    const componentName = "SpacerBlock";
    const { parsedWpBlock, style = {}, ...otherProps } = useBlockProps(componentName, props, parseWpSpacerBlock);

    return (
        <ConditionalDiv {...otherProps} style={{...style, height: `${parsedWpBlock.height}px`}} />
    )
}
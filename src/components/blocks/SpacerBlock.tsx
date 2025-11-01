import { parseWpSpacerBlock } from "@/abstracts/backendDefinitions/blocks/WpSpacerBlock";
import { useBlockProps } from "@/hooks/useBlockProps";
import type { BlockProps } from "../Block";
import ConditionalDiv from "../ConditionalDiv";
import Sanitized from "../Sanitized";

/**
 * @since latest 
 */
export default function SpacerBlock(props: BlockProps) {
    const componentName = "SpacerBlock";
    const { children, wpBlock, parsedWpBlock, style = {}, ...otherProps } = useBlockProps(componentName, props, parseWpSpacerBlock);

    return (
        <ConditionalDiv {...otherProps} style={{...style, height: `${parsedWpBlock.height}px`}}>
            <Sanitized 
                dirtyHTML={wpBlock.innerHTML}
                {...otherProps} 
            />

            {children}
        </ConditionalDiv>
    )
}
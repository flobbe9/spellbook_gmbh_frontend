import { useBlockProps } from "@/hooks/useBlockProps";
import type { BlockProps } from "../Block";
import Conditional from "../Conditional";
import { parseWpTextBlock } from "@/abstracts/backendDefinitions/blocks/WpTextBlock";
import Sanitized from "../Sanitized";

/**
 * @since latest
 */
export default function TextBlock(props: BlockProps) {
    const componentName = "TextBlock";
    const { wpBlock, parsedWpBlock, children, ...otherProps } = useBlockProps(componentName, props, parseWpTextBlock)

    return (
        <Conditional {...otherProps}>
            <Sanitized 
                dirtyHTML={`<div>${parsedWpBlock.html}</div>`}
                {...otherProps} 
            />

            <Sanitized 
                dirtyHTML={wpBlock.innerHTML}
                {...otherProps} 
            />

            {children}
        </Conditional>
    )
}

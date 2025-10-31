import { parseWpSeparatorBlock } from "@/abstracts/backendDefinitions/blocks/WpSeparatorBlock";
import { useBlockProps } from "@/hooks/useBlockProps";
import type { BlockProps } from "../Block";
import ConditionalDiv from "../ConditionalDiv";

/**
 * `<hr>` or icon
 * 
 * @since latest 
 */
export default function SeparatorBlock(props: BlockProps) {
    const componentName = "SeparatorBlock";
    const { parsedWpBlock, children, ...otherProps } = useBlockProps(componentName, props, parseWpSeparatorBlock);

    const height = 30;

    return (
        <ConditionalDiv {...otherProps}>
            {
                parsedWpBlock.type === "line" &&
                <hr />
            }

            {
                parsedWpBlock.type === "yugioh" &&
                <img 
                    src="/images/yugiohSeparator.png"
                    alt="yugioh icon"
                    height={height}
                />
            }

            {
                parsedWpBlock.type === "pokemon" &&
                <img 
                    src="/images/pokemonSeparator.png"
                    alt="pokemon icon"
                    height={height}
                />
            }

            {
                parsedWpBlock.type === "magic" &&
                <img 
                    src="/images/magicSeparator.png"
                    alt="magic icon"
                    height={height}
                />
            }

            {children}
        </ConditionalDiv>
    )
}
import { parseWpBoxBlock } from "@/abstracts/backendDefinitions/blocks/WpBoxBlock";
import type WpBlock from "@/abstracts/backendDefinitions/WpBlock";
import { CARBON_FIELDS_BLOCK_TYPE_CATEGORY } from "@/helpers/constants";
import { useBlockProps } from "@/hooks/useBlockProps";
import { useEffect, useState, type JSX } from "react";
import type { BlockProps } from "../Block";
import Block from "../Block";
import BlockDimensions, { type BlockDimensionProps } from "../BlockDimensions";
import ConditionalDiv from "../ConditionalDiv";
import Sanitized from "../Sanitized";

/**
 * Cannot be nested.
 * 
 * @since latest
 */
export default function BoxBlock(props: BlockProps) {
    const componentName = "BoxBlock";
    const { wpBlock, parsedWpBlock, children, style, className, ...otherProps } = useBlockProps(componentName, props, parseWpBoxBlock)

    const [simpleBlocks, setSimpleBlocks] = useState<JSX.Element[]>([]);

    const { background_color, background_image_fixed, background_image_url, background_type, display_flex, justify_content } = parsedWpBlock;

    useEffect(() => {
        setSimpleBlocks(mapSimpleBlocks());
    }, [wpBlock]);

    /**
     * Style the `<BlockDimensionProps>` of every simple block as block wrapper, passing background color etc
     */
    function mapSimpleBlocks(): JSX.Element[] {
        return parsedWpBlock.simpleBlocks
            .map((wpSimpleBlock, i) => { 
                // for the direct block parent
                const blockDimensionProps: BlockDimensionProps = {
                    mode: "fit-content",
                    style: {
                        backgroundColor: wpSimpleBlock.box_background_type === "color" ? wpSimpleBlock.box_background_color : undefined,
                        backgroundImage: wpSimpleBlock.box_background_type === "image" ? `url(${wpSimpleBlock.box_background_image_url})` : undefined,
                        padding: wpSimpleBlock.box_more_padding ? '30px' : undefined,
                        width: wpSimpleBlock.box_width,
                    },
                    className: `${componentName}-simpleBlockDimensions`
                }

                // for parsing functions to work properly
                const fakeWpBlock: WpBlock = {
                    blockName: wpSimpleBlock.box_simple_block_type,
                    attrs: { data: wpSimpleBlock },
                    innerBlocks: [],
                    innerHTML: ""
                }

                return <Block 
                    wpBlock={fakeWpBlock} 
                    blockDimensionProps={blockDimensionProps}
                    parentBlockName={`${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/box`} 
                    key={i} 
                />
            })
    }

    return (
        // "box_container"
        <ConditionalDiv 
            style={{
                ...style,
                backgroundColor: background_type === "color" ? background_color : undefined,
                backgroundImage: background_type === "image" ? `url(${background_image_url})` : undefined
            }}
            className={`${
                className} ${
                componentName}-background-${background_type} ${
                background_image_fixed ? `${componentName}-background-${background_type}-fixed` : ''}`
            }
            {...otherProps}
        >
            {/* "box" */}
            <BlockDimensions 
                className={`${
                    componentName}-simpleBlocksWrapper flex ${
                    display_flex ? "justify" : "items"}-${justify_content} ${
                    display_flex ? "flex-row" : "flex-col"}`
                }
                mode="margin-auto" 
            >
                {/* "box_elements" */}
                {simpleBlocks}
            </BlockDimensions>

            <Sanitized 
                dirtyHTML={wpBlock.innerHTML}
                {...otherProps} 
            />

            {children}
        </ConditionalDiv>
    );
}
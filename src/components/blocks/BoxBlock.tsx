import { parseWpBoxBlock } from "@/abstracts/backendDefinitions/blocks/WpBoxBlock";
import type WpBlock from "@/abstracts/backendDefinitions/WpBlock";
import type { WpBlockWithBackground } from "@/abstracts/backendDefinitions/WpBlockWithBackground";
import { CARBON_FIELDS_BLOCK_TYPE_CATEGORY } from "@/helpers/constants";
import { getCssConstant, isBlank } from "@/helpers/utils";
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

    const { background_image_fixed, display_flex, justify_content } = parsedWpBlock;

    useEffect(() => {
        setSimpleBlocks(mapSimpleBlocks());
    }, [wpBlock]);

    /**
     * Style the `<BlockDimensionProps>` of every simple block as block wrapper, passing background color etc
     */
    function mapSimpleBlocks(): JSX.Element[] {
        if (!parsedWpBlock?.simpleBlocks)
            return [];
        
        return parsedWpBlock.simpleBlocks
            .map((wpSimpleBlock, i) => { 
                // for the direct block parent
                const blockDimensionProps: BlockDimensionProps = {
                    mode: "fit-content",
                    style: {
                        backgroundColor: getBackgroundColor(wpSimpleBlock, "box"),
                        backgroundImage: getBackgroundImage(wpSimpleBlock, "box"),
                        width: wpSimpleBlock.box_width,
                    },
                    className: `${componentName}-simpleBlocksDimension-simpleBlockDimension ${
                        wpSimpleBlock.box_more_padding ? `${componentName}-simpleBlocksDimension-simpleBlockDimension-morePadding` : ''
                        } d-flex align-items-center`
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

    function getBackgroundImage(wpBlockWithBackground: WpBlockWithBackground, parentBlockName = ''): string {
        if (!isBlank(parentBlockName))
            parentBlockName = `${parentBlockName}_`;
        
        if (wpBlockWithBackground[`${parentBlockName}background_type`] === "image")
            return `url(${wpBlockWithBackground[`${parentBlockName}background_image_url`]})`;

        if (wpBlockWithBackground[`${parentBlockName}background_type`] === "color" && wpBlockWithBackground[`${parentBlockName}background_color`] === "theme")
            return `linear-gradient(to right, ${getCssConstant(`accentColor`)}, ${getCssConstant('themeColorInBetween')}, ${getCssConstant(`themeColor`)})`;

        return undefined;
    }

    function getBackgroundColor(wpBlockWithBackground: WpBlockWithBackground, parentBlockName = ''): string {
        if (!isBlank(parentBlockName))
            parentBlockName = `${parentBlockName}_`;

        if (wpBlockWithBackground[`${parentBlockName}background_type`] === "color" && wpBlockWithBackground[`${parentBlockName}background_color`] !== "theme")
            return getCssConstant(`${wpBlockWithBackground[`${parentBlockName}background_color`]}Color`);

        return undefined;
    }

    return (
        // "box_container"
        <ConditionalDiv 
            style={{
                ...style,
                backgroundColor: getBackgroundColor(parsedWpBlock),
                backgroundImage: getBackgroundImage(parsedWpBlock)
            }}
            className={`${
                className} ${
                componentName}-background-${parsedWpBlock.background_type} ${
                background_image_fixed ? `${componentName}-background-${parsedWpBlock.background_type}-fixed` : ''}`
            }
            {...otherProps}
        >
            {/* "box" */}
            <BlockDimensions 
                className={`${
                    componentName}-simpleBlocksDimension d-flex flex-wrap flex-lg-nowrap ${
                    display_flex ? "justify-content" : "align-items"}-${justify_content} ${
                    display_flex ? "flex-row" : "flex-column"}`
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
import type WpBlock from "@/abstracts/backendDefinitions/WpBlock";
import { CARBON_FIELDS_BLOCK_TYPE_CATEGORY } from "@/helpers/constants";
import { logError } from "@/helpers/logUtils";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { Fragment } from "react/jsx-runtime";
import BlockDimensions, { type BlockDimensionProps } from "./BlockDimensions";
import BoxBlock from "./blocks/BoxBlock";
import ButtonLinkBlock from "./blocks/ButtonLinkBlock";
import SeparatorBlock from "./blocks/SeparatorBlock";
import SpacerBlock from "./blocks/SpacerBlock";
import TextBlock from "./blocks/TextBlock";
import type DefaultProps from "@/abstracts/props/DefaultProps";
import AccordionBlock from "./blocks/AccordionBlock";
import SliderBlock from "./blocks/SliderBlock";

export interface BlockProps extends DefaultProps {
    wpBlock: WpBlock,
    /** * The parent's full `blockName` (blockTypeCategory + bckend blockName). Omit if no parent*/
    parentBlockName?: string,
}

/**
 * @returns the specific block component passing `props.children` or just `props.children` if no implementation
 * @since latest
 */
export default function Block(props: BlockProps & { blockDimensionProps?: BlockDimensionProps }) {
    const componentName = "Block";
    const { children, ...otherProps } = useDefaultProps(componentName, props);
    const { mode, ...otherBlockDimensionProps } = otherProps.blockDimensionProps;

    switch (props.wpBlock.blockName) {
        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/box`:
            return (
                <BlockDimensions 
                    mode={mode ?? "window-width"}
                    {...otherBlockDimensionProps} 
                >
                    <BoxBlock {...otherProps} />
                </BlockDimensions>
            );

        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/slider`:
            return (
                <BlockDimensions 
                    mode={mode ?? "margin-auto"}
                    {...otherBlockDimensionProps} 
                >
                    <SliderBlock {...otherProps} />
                </BlockDimensions>
            );
            
        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/akkordeon`:
            return (
                <BlockDimensions 
                    mode={mode ?? "margin-auto"}
                    {...otherBlockDimensionProps} 
                >
                    <AccordionBlock {...otherProps} />
                </BlockDimensions>
            );

        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/trenner`:
            return (
                <BlockDimensions 
                    mode={mode ?? "margin-auto"}
                    {...otherBlockDimensionProps} 
                >
                    <SeparatorBlock {...otherProps} />
                </BlockDimensions>
            );

        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/leerer-abnschnitt`:
            return (
                <BlockDimensions 
                    mode={mode ?? "margin-auto"}
                    {...otherBlockDimensionProps} 
                >
                    <SpacerBlock {...otherProps} />
                </BlockDimensions>
            );

        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/button-link`:
            return (
                <BlockDimensions 
                    mode={mode ?? "margin-auto"}
                    {...otherBlockDimensionProps} 
                >
                    <ButtonLinkBlock {...otherProps} />
                </BlockDimensions>
            );

        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/text`:
            return (
                <BlockDimensions 
                    mode={mode ?? "margin-auto"}
                    {...otherBlockDimensionProps} 
                >
                    <TextBlock {...otherProps} />
                </BlockDimensions>
            );

        // NOTE: don't know why these popup sometimes...
        case null:
            return <Fragment />;

        default:
            logError(`Block '${props.wpBlock.blockName}' not implemented.`);
            return children;
    }
}
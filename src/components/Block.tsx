import type WPBlock from "@/abstracts/backendDefinitions/WpBlock";
import type DefaultProps from "@/abstracts/props/DefaultProps";
import { CARBON_FIELDS_BLOCK_TYPE_CATEGORY } from "@/helpers/constants";
import { logError } from "@/helpers/logUtils";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { Fragment } from "react/jsx-runtime";
import BlockDimensions from "./BlockDimensions";
import ButtonLinkBlock from "./blocks/ButtonLinkBlock";
import SpacerBlock from "./blocks/SpacerBlock";
import TextBlock from "./blocks/TextBlock";

export interface BlockProps extends DefaultProps {
    wpBlock: WPBlock,
    /** * The parent's full `blockName` (blockTypeCategory + bckend blockName). Omit if no parent*/
    parentBlockName?: string,
}

/**
 * @returns the specific block component passing `props.children` or just `props.children` if no implementation
 * @since latest
 */
export default function Block({...props}: BlockProps) {
    const componentName = "Block";
    const { children, ...otherProps } = useDefaultProps(componentName, props);

    switch (props.wpBlock.blockName) {
        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/leerer-abnschnitt`:
            return (
                <BlockDimensions mode="margin-auto">
                    <SpacerBlock {...otherProps} />
                </BlockDimensions>
            );

        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/button-link`:
            return (
                <BlockDimensions mode="margin-auto">
                    <ButtonLinkBlock {...otherProps} />
                </BlockDimensions>
            );

        case `${CARBON_FIELDS_BLOCK_TYPE_CATEGORY}/text`:
            return (
                <BlockDimensions mode="margin-auto">
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
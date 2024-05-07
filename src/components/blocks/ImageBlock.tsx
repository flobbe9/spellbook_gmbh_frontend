import React from "react";
import "../../assets/styles/ImageBlock.css";
import { getCleanDefaultProps } from "../../abstract/DefaultProps";
import WPBlock from "../../abstract/wp/WPBlock";
import Sanitized from "../helpers/Sanitized";
import { log } from "../../utils/genericUtils";
import BlockProps from "../../abstract/BlockProps";
import Flex from "../helpers/Flex";
import Block from "./Block";
import { parseWPAlignString } from "../../abstract/wp/WPBlockAttribute";


interface Props extends BlockProps {
    wpBlock: WPBlock,
}


/**
 * Serves as component for "core/image" block type.
 * 
 * @since 0.0.1
 */
export default function ImageBlock({wpBlock, mainTagNames, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ImageBlock");

    const { align } = wpBlock.attrs;
    const imageClass = wpBlock.attrs.className;


    function isFullWidth(): boolean {

        return align !== "left" && align !== "right";
    }


    /**
     * Return ```marginLeft``` in case of ```align``` "right" and ```marginRight``` in case of ```align``` "left" .
     * 
     * @returns an object with only the margin prop depending on the alignment
     */
    function getMargin(): object {

        if (align === "right")
            return {marginLeft: "25px"}

        if (align === "left")
            return {marginRight: "25px"}

        return {};
    }


    return (
        <Flex 
            id={id} 
            className={className}
            style={{
                ...style,
                width: isFullWidth() ? "100%" : "fit-content",
                ...getMargin()
            }}
            horizontalAlign={parseWPAlignString(align || "left")}
        >
            {/* InnerHTML */}
            <Sanitized
                className={imageClass}
                dirtyHTML={wpBlock.innerHTML} 
                mainTagNames={mainTagNames}
            />
            
            {/* InnerBlocks */}
            <Block wpBlocks={wpBlock.innerBlocks} />
                
            {children}
        </Flex>
    )
}
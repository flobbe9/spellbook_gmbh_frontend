import React, { useEffect } from "react";
import "../../assets/styles/ParagraphBlock.css";
import WPBlock from "../../abstract/wp/WPBlock";
import Sanitized from "../helpers/Sanitized";
import { log } from "../../helpers/genericUtils";
import BlockProps, { getCleanBlockProps } from "../../abstract/props/BlockProps";
import Block from "./Block";
import { TextAlign } from "../../abstract/CSSTypes";


interface Props extends BlockProps {
    wpBlock: WPBlock
}


/**
 * Serves as component for "core/paragraph" and "heading" block types.
 * 
 * @since 0.0.1
 */
export default function ParagraphBlock({wpBlock, mainTagNames, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanBlockProps(otherProps, "ParagraphBlock");

    const { align, textAlign } = wpBlock.attrs;


    function getTextAlign(): TextAlign | undefined {

        if (align === "full")
            return textAlign;

        return align || textAlign;
    }


    return (
        <div 
            id={id} 
            className={className}
            style={style}
        >
            {/* InnerHTML */}
            <Sanitized
                dirtyHTML={wpBlock.innerHTML}
                style={{
                    textAlign: getTextAlign()
                }}
                mainTagNames={mainTagNames}
            />

            {/* InnerBlocks */}
            <Block wpBlocks={wpBlock.innerBlocks} />
            
            {children}
        </div>
    )
}
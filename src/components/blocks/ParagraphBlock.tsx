import React, { useEffect } from "react";
import "../../assets/styles/ParagraphBlock.css";
import { getCleanDefaultProps } from "../../abstract/DefaultProps";
import WPBlock from "../../abstract/wp/WPBlock";
import Sanitized from "../helpers/Sanitized";
import { log } from "../../utils/genericUtils";
import BlockProps from "../../abstract/BlockProps";
import Block from "./Block";


interface Props extends BlockProps {
    wpBlock: WPBlock
}


/**
 * Serves as component for "core/paragraph" and "heading" block types.
 * 
 * @since 0.0.1
 */
export default function ParagraphBlock({wpBlock, mainTagNames, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ParagraphBlock");

    const { align, textAlign } = wpBlock.attrs;


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
                    textAlign: align || textAlign || "left"
                }}
                mainTagNames={mainTagNames}
            />

            {/* InnerBlocks */}
            <Block wpBlocks={wpBlock.innerBlocks} />
            
            {children}
        </div>
    )
}
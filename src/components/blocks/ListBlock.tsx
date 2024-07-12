import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import Sanitized from "../helpers/Sanitized";
import BlockProps, { getCleanBlockProps } from "../../abstract/props/BlockProps";
import WPBlock from "../../abstract/wp/WPBlock";
import Block from "./Block";


interface Props extends BlockProps {
    wpBlock: WPBlock,
}


/**
 * @since 0.1.4
 */
export default function ListBlock({wpBlock, mainTagNames, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanBlockProps(otherProps, "ListBlock");


    return (
        <div
            id={id} 
            className={className}
            style={style}
        >
            <Sanitized dirtyHTML={wpBlock.innerHTML} mainTagNames={mainTagNames}>
                <Block wpBlocks={wpBlock.innerBlocks} />
            </Sanitized>
                
            {children}
        </div>
    )
}
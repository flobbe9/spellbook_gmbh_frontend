import React from "react";
import "../../assets/styles/ListItemBlock.scss";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import Sanitized from "../helpers/Sanitized";
import WPBlock from "../../abstract/wp/WPBlock";
import Block from "./Block";
import BlockProps from "../../abstract/props/BlockProps";


interface Props extends BlockProps {
}


/**
 * Represents a ```<li>``` element.
 * 
 * @since latest
 */
export default function ListItemBlock({wpBlock, mainTagNames, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ListItemBlock");

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
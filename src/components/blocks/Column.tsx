import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import Flex from "../helpers/Flex";
import Sanitized from './../helpers/Sanitized';
import WPBlock from "../../abstract/wp/WPBlock";
import Block from "./Block";


interface Props extends DefaultProps {
    wpBlock: WPBlock
}


/**
 * @since 0.0.1
 */
export default function Column({wpBlock, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Column");

    // TODO: where to pass id etc

    // TODO:
        // attrs


    return (
        <div style={{flex: 1}}> 
            <Sanitized dirtyHTML={wpBlock.innerHTML} />

            <Block wpBlocks={wpBlock.innerBlocks} />

            {children}
        </div>
    )
}
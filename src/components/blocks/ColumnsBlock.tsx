import React from "react";
import "../../assets/styles/ColumnsBlock.css";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import Flex from "../helpers/Flex";
import Sanitized from '../helpers/Sanitized';
import WPBlock from "../../abstract/wp/WPBlock";
import Block from "./Block";


interface Props extends DefaultProps {
    wpBlock: WPBlock
}


/**
 * @since 0.0.1
 */
export default function ColumnsBlock({wpBlock, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ColumnsBlock");
    const { verticalAlignment, align } = wpBlock.attrs;


    function isFullWindowWidth(): boolean {

        return align === "full";
    }


    return (
        <Flex 
            id={id}
            className={className + (isFullWindowWidth() ? "fullWindowWidth" : "")}
            style={{
                ...style,
                alignItems: verticalAlignment,
            }}
            horizontalAlign="center"
        > 
            <Sanitized dirtyHTML={wpBlock.innerHTML} />

            <Block wpBlocks={wpBlock.innerBlocks} />

            {children}
        </Flex>
    )
}
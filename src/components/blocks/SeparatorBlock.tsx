import React from "react";
import "../../assets/styles/SeparatorBlock.scss";
import Sanitized from "../helpers/Sanitized";
import BlockProps, { getCleanBlockProps } from "../../abstract/props/BlockProps";


interface Props extends BlockProps {
}


/**
 * Represents a ```<hr>``` element.
 * 
 * @since latest
 */
export default function SeparatorBlock({wpBlock, mainTagNames, ...otherProps}: Props) {

    const { id, className, style } = getCleanBlockProps(otherProps, "SeparatorBlock");


    return (
        <div
            id={id} 
            className={className}
            style={style}
        >
            <Sanitized dirtyHTML={wpBlock.innerHTML} mainTagNames={mainTagNames} className="flexCenter" />
        </div>
    )
}
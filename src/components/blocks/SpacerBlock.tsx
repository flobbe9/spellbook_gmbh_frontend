import React from "react";
import { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import BlockProps from "../../abstract/props/BlockProps";
import Sanitized from "../helpers/Sanitized";
import WPBlock from "../../abstract/wp/WPBlock";


interface Props extends BlockProps {
    wpBlock: WPBlock
}


/**
 * @since 0.1.4
 */
export default function SpacerBlock({wpBlock, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "SpacerBlock");

    return (
        <div 
            id={id} 
            className={className}
            style={style}
        >
            <Sanitized dirtyHTML={wpBlock.innerHTML} />
                
            {children}
        </div>
    )
}
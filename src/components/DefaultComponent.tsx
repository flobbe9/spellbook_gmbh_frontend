import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";


interface Props extends DefaultProps {

}


/**
 * 
 * @returns @since 0.0.1
 */
export default function DefaultComponent({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "DefaultComponent");

    return (
        <div 
            id={id} 
            className={className}
            style={style}
            >
                
            {children}
        </div>
    )
}
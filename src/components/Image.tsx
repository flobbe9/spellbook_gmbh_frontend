import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";


interface Props extends DefaultProps {

}


/**
 * 
 * @since 0.0.1
 */
export default function Image({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Image");

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
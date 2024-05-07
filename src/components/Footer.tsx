import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";


interface Props extends DefaultProps {

}


/**
 * 
 * @since 0.0.1
 */
export default function Footer({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Footer");

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
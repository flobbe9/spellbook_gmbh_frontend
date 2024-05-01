import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import WPPage from "../abstract/wp/WPPage";


interface Props extends DefaultProps {
    pending: boolean
}

/**
 * Fallback component for 404 status. If ```pending``` is ```true``` a pending animation will be 
 * displayed instead of a 404 message. Pending should be ```true``` if no pages have been fetched from wp yet.
 * 
 * @since 0.0.1
 */
export default function _404({pending, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "_404");


    return (
        <div 
            id={id} 
            className={className}
            style={style}
            >
            {
                pending ? 
                    <h1>Pending</h1> : 
                    <h1>404</h1>
            }
                
            {children}
        </div>
    )
}
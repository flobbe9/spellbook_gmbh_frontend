import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";


interface Props extends DefaultProps {
    bottom?: number,
    left?: number,
    right?: number,
    top?: number,
    /** Default is "black". */
    backgroundColor?: string,
    /** Width and height. Default is "10px" */
    size?: string
}


/**
 * Just a square box div with one background color.
 * 
 * @since 0.0.2
 */
export default function SquareBox({bottom, left, right, top, backgroundColor = "black", size = "10px", ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "SquareBox");

    return (
        <div 
            id={id} 
            className={className}
            style={{
                position: "absolute",
                ...style,
                bottom: bottom,
                background: backgroundColor,
                height: size,
                left: left,
                right: right,
                top: top,
                width: size
            }}
        >
            {children}
        </div>
    )
}
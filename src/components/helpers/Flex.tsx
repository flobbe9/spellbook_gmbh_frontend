import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import { isBlank } from "../../utils/genericUtils";
import { TextAlign } from "../../abstract/wp/WPBlockAttribute";


interface Props extends DefaultProps {
    horizontalAlign: TextAlign
    verticalAlign?: TextAlign
}


/**
 * Component that is basically a div with ```display: "flex"``` using the ```horizontalAlign``` prop for
 * ```justify-content``` and the ```verticalAlign``` prop for ```align-items```. 
 * 
 * See App.css for class names.
 * 
 * @since 0.0.1
 */
export default function Flex({horizontalAlign, verticalAlign, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Flex");


    return (
        <div 
            id={id} 
            className={className}
            style={{
                ...style,
                display: "flex",
                justifyContent: horizontalAlign,
                alignItems: verticalAlign
            }}
            >
            {children}
        </div>
    )
}
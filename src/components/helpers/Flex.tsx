import React, { forwardRef, LegacyRef, MutableRefObject } from "react";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import { isBlank } from "../../utils/genericUtils";
import { FlexDirection, TextAlign } from "../../abstract/CSSTypes";


interface Props extends DefaultProps {
    /** Wont be set at all if ```undefined``` */
    horizontalAlign?: TextAlign,
    /** Wont be set at all if ```undefined``` */
    verticalAlign?: TextAlign,
    /** If true, dont set display to "flex". Default is false. */
    disableFlex?: boolean,
    /** Default is "row". See {@link FlexDirection} */
    flexDirection?: FlexDirection,
    onClick?: (event) => void
}


/**
 * Component that is basically a div with ```display: "flex"``` using the ```horizontalAlign``` prop for
 * ```justify-content``` and the ```verticalAlign``` prop for ```align-items```. 
 * 
 * See App.css for class names.
 * 
 * @since 0.0.1
 */
export default forwardRef(function(
    {horizontalAlign, verticalAlign, disableFlex = false, flexDirection = "row", onClick, ...otherProps}: Props,
    ref: LegacyRef<HTMLDivElement>) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Flex");


    return (
        <div 
            id={id} 
            className={className}
            style={{
                ...style,
                display: disableFlex ? "" : "flex",
                flexDirection: flexDirection,
                justifyContent: horizontalAlign,
                alignItems: verticalAlign
            }}
            ref={ref}
            onClick={onClick}
            >
            {children}
        </div>
    )
})
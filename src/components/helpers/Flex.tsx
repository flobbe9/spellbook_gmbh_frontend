import React, { forwardRef, LegacyRef, MutableRefObject } from "react";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import { isBlank } from "../../utils/genericUtils";
import { FlexDirection, FlexWrap, TextAlign } from "../../abstract/CSSTypes";


interface Props extends DefaultProps {
    /** Wont be set at all if ```undefined``` */
    horizontalAlign?: TextAlign,
    /** Wont be set at all if ```undefined``` */
    verticalAlign?: TextAlign,
    /** If true, dont set display to "flex". Default is false. */
    disableFlex?: boolean,
    /** Default is "row". See {@link FlexDirection} */
    flexDirection?: FlexDirection,
    /** Default is "wrap". See {@link FlexWrap} */
    flexWrap?: FlexWrap,
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
export default forwardRef(function({horizontalAlign, 
                                    verticalAlign,
                                    disableFlex = false,
                                    flexDirection = "row",
                                    flexWrap = "wrap",
                                    onClick,
                                    ...otherProps}: Props,
    ref: LegacyRef<HTMLDivElement>) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps);


    return (
        <div 
            id={id} 
            className={className}
            style={{
                ...style,
                alignItems: verticalAlign,
                display: disableFlex ? "" : "flex",
                flexDirection: flexDirection,
                flexWrap: flexWrap,
                justifyContent: horizontalAlign,
            }}
            ref={ref}
            onClick={onClick}
            >
            {children}
        </div>
    )
})
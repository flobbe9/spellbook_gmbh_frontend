import React, { forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import HelperProps from "../../abstract/props/HelperProps";
import { log } from "../../helpers/genericUtils";


interface Props extends HelperProps {
}


/**
 * Component applying most helper props like ```_hover```. 
 * 
 * @since 0.0.1
 */
export default forwardRef(function HelperDiv(
    {
        title = "",
        disabled = false,
        rendered = true,
        _hover = {},
        ...props
    }: Props,
    ref: Ref<HTMLDivElement>
) {

    const [isHover, setIsHover] = useState(false);
    
    const { id, className, style, children, ...otherProps } = getCleanDefaultProps(props);

    const componentRef = useRef(null)

    // make "ref" usable inside this component
    useImperativeHandle(ref, () => componentRef.current!, []);


    useEffect(() => {

        toggleIsHover();
    }, []);


    function toggleIsHover(): void {

        const component = $(componentRef.current!);

        component.on("mouseenter", () => setIsHover(true))
                 .on("mouseleave", () => setIsHover(false));
    }


    return (
        <div 
            id={id} 
            className={className}
            style={{
                ...style,
                ...(isHover && !disabled ? _hover : {}),
            }}
            ref={componentRef}
            title={title}
            hidden={!rendered}
            contentEditable={otherProps.contentEditable}
            {...otherProps}
        >
            {children}
        </div>
    )
})
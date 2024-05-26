import React, { forwardRef, LegacyRef, useContext, useRef, useState } from "react";
import "../assets/styles/Toast.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import Flex from "./helpers/Flex";
import { AppContext } from "./App";


interface Props extends DefaultProps {
    summary: string,
    message?: string
    /** Default is ```info``` */
    sevirity?: ToastSevirity,
}


/**
 * z-index 10
 * 
 * @since 0.0.1
 */
export default forwardRef(function Toast({summary, message = "", sevirity = "info", ...otherProps}: Props, ref: LegacyRef<HTMLDivElement> | undefined) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Toast", true);

    const { moveToast } = useContext(AppContext);


    return (
        <div 
            id={id} 
            ref={ref}
            className={className}
            style={style}
        >
            <div className={"textContainer " + sevirity}>
                <div className="summary">
                    <Flex>
                        <h4 className="col-10">{summary}</h4>
                        <span className="col-2 textRight hover" onClick={() => moveToast(true)}>
                            <i className="fa-solid fa-xmark fa-xl "></i>
                        </span>
                    </Flex>
                </div>

                <div className="message">
                    {message}
                </div>
            </div>
                
            {children}
        </div>
    )
});


export type ToastSevirity = "error" | "warn" | "info" | "success";
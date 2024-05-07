import React from "react";
import "../assets/styles/_404.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import WPPage from "../abstract/wp/WPPage";
import { getCssConstant } from "../utils/genericUtils";
import Flex from "./helpers/Flex";


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

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "_404", true);


    const pendingAnimation = (
        <Flex className="pendingContainer" horizontalAlign="center" verticalAlign="center">
            <div className="textCenter">
                <i className="fa-solid fa-spinner rotating"
                    style={{
                        fontSize: "80px",
                        opacity: 0.4,
                        color: getCssConstant("themeColor")
                    }}>
                </i>
                <p className="mt-3">Lade Kontent...</p>
            </div>
        </Flex>
    )


    // TODO: style
    const notFound = (
        <h1>Not found</h1>
    )


    return (
        <div 
            id={id} 
            className={className}
            style={style}
            >
            {pending ? pendingAnimation : notFound}
                
            {children}
        </div>
    )
}